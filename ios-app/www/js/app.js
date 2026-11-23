(function () {
  'use strict';

  const COURSES = window.DAL_COURSES;
  const $ = (id) => document.getElementById(id);
  const view = $('view');

  // ---------- Storage (native Preferences on iOS, localStorage in a browser) ----------
  const Prefs = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences;
  const STORE_KEY = 'dal-training-state-v1';
  let state = { completed: {}, timeSpent: {}, last: {}, quiz: {}, theme: 'auto', scale: 1 };

  async function loadState() {
    try {
      let raw = null;
      if (Prefs) raw = (await Prefs.get({ key: STORE_KEY })).value;
      if (!raw) raw = localStorage.getItem(STORE_KEY);
      if (raw) state = Object.assign(state, JSON.parse(raw));
    } catch (e) { /* first run or storage unavailable */ }
  }
  function saveState() {
    const raw = JSON.stringify(state);
    try { localStorage.setItem(STORE_KEY, raw); } catch (e) {}
    if (Prefs) Prefs.set({ key: STORE_KEY, value: raw }).catch(() => {});
  }

  // ---------- Helpers ----------
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const course = (id) => COURSES.find((c) => c.id === id);
  const key = (c, l) => `${c.id}/${l.id}`;
  const isDone = (c, l) => !!state.completed[key(c, l)];
  const doneCount = (c) => c.lessons.filter((l) => isDone(c, l)).length;
  const nextIncomplete = (c, after = -1) =>
    c.lessons.slice(after + 1).find((l) => !isDone(c, l)) || c.lessons.find((l) => !isDone(c, l));
  const quizPassed = (c) => !c.quiz || !!(state.quiz[c.id] && state.quiz[c.id].passedAt);
  const courseDone = (c) => doneCount(c) === c.lessons.length && quizPassed(c);
  const courseTime = (c) => c.lessons.reduce((a, l) => a + (state.timeSpent[key(c, l)] || 0), 0);
  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    return m < 1 ? `${s}s` : m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`;
  };
  const pctOf = (c) => {
    const steps = c.lessons.length + (c.quiz ? 1 : 0);
    const done = doneCount(c) + (c.quiz && quizPassed(c) ? 1 : 0);
    return Math.round((done / steps) * 100);
  };

  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 1800);
  }

  function applyPrefs() {
    const root = document.documentElement;
    if (state.theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', state.theme);
    root.style.setProperty('--scale', state.scale);
    $('textSizeLabel').textContent = Math.round(state.scale * 100) + '%';
    document.querySelectorAll('[data-theme-choice]').forEach((b) =>
      b.setAttribute('aria-checked', String(b.dataset.themeChoice === state.theme)));
  }

  const cbtn = (href, main, sub) =>
    `<button class="continue-btn" data-href="${href}"><span class="cb-main">${main} ›</span>${sub ? `<small>${sub}</small>` : ''}</button>`;

  function ring(pct, size = 84, color = '#5fd39d') {
    const r = size / 2 - 6, C = 2 * Math.PI * r;
    return `<div class="ring" style="width:${size}px;height:${size}px" aria-label="${pct}% complete">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="rgba(255,255,255,.22)" stroke-width="7" fill="none"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"
          stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/>
      </svg><div class="pct" style="font-size:${size / 4.4}px">${pct}%</div></div>`;
  }

  function setChrome({ title, back, pager }) {
    $('topbarTitle').textContent = title;
    $('backBtn').hidden = !back;
    if (back) { $('backLabel').textContent = back.label; $('backBtn').dataset.href = back.href; }
    $('pager').hidden = !pager;
    document.body.classList.toggle('has-pager', !!pager);
  }

  // ---------- Time tracking ----------
  let timer = null;
  function startTimer(k) {
    stopTimer();
    timer = setInterval(() => {
      if (document.hidden) return;
      state.timeSpent[k] = (state.timeSpent[k] || 0) + 1;
      if (state.timeSpent[k] % 10 === 0) saveState();
    }, 1000);
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; saveState(); } }

  // ---------- Academy home ----------
  function renderAcademy() {
    setChrome({ title: 'DAL TRAINING' });
    const inProgress = COURSES.filter((c) => doneCount(c) > 0 && !courseDone(c));
    view.innerHTML = `
      <section class="academy-hero">
        <div class="logo-chip"><img src="img/logo.png" alt="Domestic Airlines" /></div>
        <h1>Training Academy</h1>
        <p>${COURSES.length} courses · works offline</p>
      </section>

      ${inProgress.length ? `<h2 class="section-title">Continue where you left off</h2>
        ${inProgress.map((c) => {
          const l = lessonToResume(c);
          return cbtn(`#/c/${c.id}/l/${l.id}`, `Continue ${esc(c.short)}`, `${esc(c.lessonLabel)} ${l.number}: ${esc(l.title)}`);
        }).join('')}` : ''}

      <h2 class="section-title">Courses</h2>
      <div class="course-grid">
        ${COURSES.map((c) => {
          const pct = pctOf(c);
          const done = courseDone(c);
          return `<button class="course-card" data-href="#/c/${c.id}" style="--course:${c.accent}">
            <div class="course-top">
              <span class="course-icon" aria-hidden="true">${c.icon}</span>
              ${ring(pct, 58)}
            </div>
            <div class="course-title">${esc(c.title)}</div>
            <div class="course-sub">${esc(c.subtitle)}</div>
            <div class="course-foot">
              <span>${c.lessons.length} ${esc(c.lessonLabel.toLowerCase())}s${c.quiz ? ' + quiz' : ''}</span>
              <span class="status ${done ? 'done' : pct ? 'started' : 'new'}">${done ? '✓ Completed' : pct ? 'In progress' : 'Start ›'}</span>
            </div>
          </button>`;
        }).join('')}
      </div>`;
  }

  function lessonToResume(c) {
    const last = c.lessons.find((l) => l.id === state.last[c.id]);
    return last && !isDone(c, last) ? last : nextIncomplete(c) || c.lessons[0];
  }

  // ---------- Course page ----------
  function renderCourse(c) {
    setChrome({ title: c.short, back: { label: 'Courses', href: '#/' } });
    const done = doneCount(c);
    const total = c.lessons.length;
    const pct = pctOf(c);
    const next = nextIncomplete(c);
    const resume = lessonToResume(c);
    const q = state.quiz[c.id];
    const time = courseTime(c);

    let cta;
    if (next) {
      cta = cbtn(`#/c/${c.id}/l/${resume.id}`, done === 0 ? 'Start course' : 'Continue', `${esc(c.lessonLabel)} ${resume.number}: ${esc(resume.title)}`);
    } else if (!quizPassed(c)) {
      cta = cbtn(`#/c/${c.id}/quiz`, '📝 Take the final quiz', `All ${esc(c.lessonLabel.toLowerCase())}s done · pass mark ${c.quiz.passPct}%`);
    } else {
      cta = `<div class="card done-banner"><div class="big">🎖️</div><h2>Course complete</h2>
        <p>${c.quiz ? `Quiz passed with ${q.best}% on ${new Date(q.passedAt).toLocaleDateString()}.` : 'All modules completed.'}<br/>You may now proceed to evaluation.</p></div>`;
    }

    view.innerHTML = `
      <section class="hero" style="--course:${c.accent}">
        ${ring(pct)}
        <div>
          <h1>${esc(c.title)}</h1>
          <p>${done} of ${total} ${esc(c.lessonLabel.toLowerCase())}s completed${time ? ` · ${fmtTime(time)} studied` : ''}</p>
        </div>
      </section>
      ${cta}
      <h2 class="section-title">${esc(c.lessonLabel)}s</h2>
      <ul class="module-list">
        ${c.lessons.map((l) => {
          const d = isDone(c, l);
          const started = !d && state.timeSpent[key(c, l)];
          return `<li><button class="module-card" data-href="#/c/${c.id}/l/${l.id}">
            <span class="module-icon" aria-hidden="true">${l.icon}</span>
            <span class="module-meta">
              <div class="module-num">${esc(c.lessonLabel.toUpperCase())} ${l.number} · ~${l.minutes} MIN</div>
              <div class="module-name">${esc(l.title)}</div>
            </span>
            <span class="status ${d ? 'done' : started ? 'started' : 'new'}">${d ? '✓ Done' : started ? 'In progress' : '›'}</span>
          </button></li>`;
        }).join('')}
        ${c.quiz ? `<li><button class="module-card quiz-card" data-href="#/c/${c.id}/quiz">
            <span class="module-icon" aria-hidden="true">📝</span>
            <span class="module-meta">
              <div class="module-num">FINAL QUIZ · PASS MARK ${c.quiz.passPct}%</div>
              <div class="module-name">Course quiz</div>
            </span>
            <span class="status ${quizPassed(c) ? 'done' : q ? 'started' : 'new'}">${quizPassed(c) ? `✓ ${q.best}%` : q ? `Best ${q.best}%` : '›'}</span>
          </button></li>` : ''}
      </ul>`;
  }

  // ---------- Lesson page ----------
  let current = null; // { c, i }
  function renderLesson(c, lessonId) {
    const i = c.lessons.findIndex((l) => l.id === lessonId);
    if (i < 0) return renderCourse(c);
    const l = c.lessons[i];
    current = { c, i };
    state.last[c.id] = l.id;
    saveState();
    startTimer(key(c, l));

    setChrome({ title: `${c.lessonLabel} ${l.number}`, back: { label: 'Course', href: `#/c/${c.id}` }, pager: true });
    $('prevBtn').disabled = i === 0;
    $('nextBtn').disabled = i === c.lessons.length - 1 && !c.quiz;
    $('nextBtn').textContent = i === c.lessons.length - 1 && c.quiz ? 'Quiz ›' : 'Next ›';
    updateCompleteBtn();

    view.innerHTML = `
      <div class="module-head">
        <div class="module-num">${esc(c.lessonLabel.toUpperCase())} ${l.number} · ${i + 1} OF ${c.lessons.length}</div>
        <h1>${l.icon} ${esc(l.title)}</h1>
        <div class="progress-bar" style="--course:${c.accent}"><div style="width:${((i + 1) / c.lessons.length) * 100}%"></div></div>
        <div class="chip-row">
          <span class="chip">~${l.minutes} min</span>
          ${isDone(c, l) ? '<span class="chip done">✓ Completed</span>' : ''}
        </div>
      </div>

      <article class="card">${l.body}</article>

      ${l.audio ? `
        <div class="card audio-card" id="audioCard">
          <span class="label">🎧 Listen to this ${esc(c.lessonLabel.toLowerCase())}</span>
          <audio controls preload="metadata" src="${l.audio}"></audio>
        </div>` : ''}

      ${l.images.length ? `
        <div class="gallery">
          ${l.images.map((img, k) => `
            <figure class="figure">
              <button data-zoom="${k}" aria-label="Enlarge: ${esc(img.alt)}"><img loading="lazy" src="${img.src}" alt="${esc(img.alt)}"/></button>
              <figcaption><span>${esc(img.alt)}</span><span>Tap to enlarge</span></figcaption>
            </figure>`).join('')}
        </div>` : ''}
    `;

    // Hide media that is not bundled with the app.
    view.querySelectorAll('.figure img').forEach((img) =>
      img.addEventListener('error', () => img.closest('.figure').remove()));
    const audio = view.querySelector('audio');
    if (audio) audio.addEventListener('error', () => $('audioCard') && $('audioCard').remove());
  }

  function updateCompleteBtn() {
    if (!current) return;
    const b = $('completeBtn');
    const done = isDone(current.c, current.c.lessons[current.i]);
    b.textContent = done ? '✓ Completed' : 'Mark complete';
    b.classList.toggle('completed', done);
    b.classList.toggle('primary', !done);
  }

  // ---------- Quiz ----------
  let quiz = null; // { c, qs, idx, answers }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function renderQuizIntro(c) {
    quiz = null;
    setChrome({ title: 'Final quiz', back: { label: 'Course', href: `#/c/${c.id}` } });
    const n = Math.min(c.quiz.count, c.quiz.questions.length);
    const remaining = c.lessons.length - doneCount(c);
    const q = state.quiz[c.id];
    view.innerHTML = `
      <div class="card quiz-intro">
        <div class="big">📝</div>
        <h1>Final quiz</h1>
        <p>${n} question${n === 1 ? '' : 's'}, one at a time. You need <strong>${c.quiz.passPct}%</strong> to pass. You can retry as often as you like.</p>
        ${q ? `<p class="hint">Best score so far: <strong>${q.best}%</strong> · ${q.attempts} attempt${q.attempts === 1 ? '' : 's'}</p>` : ''}
        ${remaining ? `<p class="warn-note">You still have ${remaining} ${esc(c.lessonLabel.toLowerCase())}${remaining === 1 ? '' : 's'} to complete. We recommend finishing them first.</p>` : ''}
        <button class="continue-btn" id="startQuiz">Start quiz ›</button>
      </div>`;
    $('startQuiz').onclick = () => {
      const qs = shuffle([...c.quiz.questions]).slice(0, n).map((x) => {
        const order = shuffle(x.options.map((_, k) => k));
        return { q: x.q, options: order.map((k) => x.options[k]), answer: order.indexOf(x.answer) };
      });
      quiz = { c, qs, idx: 0, answers: [] };
      renderQuizQuestion();
    };
  }

  function renderQuizQuestion() {
    const { c, qs, idx } = quiz;
    const q = qs[idx];
    view.innerHTML = `
      <div class="module-head">
        <div class="module-num">QUESTION ${idx + 1} OF ${qs.length}</div>
        <div class="progress-bar" style="--course:${c.accent}"><div style="width:${((idx + 1) / qs.length) * 100}%"></div></div>
      </div>
      <div class="card"><h2 class="question">${esc(q.q)}</h2></div>
      <div class="options">
        ${q.options.map((o, k) => `<button class="option" data-opt="${k}"><span class="opt-letter">${'ABCD'[k] || k + 1}</span><span>${esc(o)}</span></button>`).join('')}
      </div>
      <div id="feedback"></div>`;
    window.scrollTo(0, 0);
  }

  function answerQuiz(k) {
    const { qs, idx } = quiz;
    const q = qs[idx];
    if (quiz.answers[idx] !== undefined) return;
    quiz.answers[idx] = k;
    view.querySelectorAll('.option').forEach((b) => {
      const o = +b.dataset.opt;
      b.disabled = true;
      if (o === q.answer) b.classList.add('correct');
      else if (o === k) b.classList.add('wrong');
    });
    const last = idx === qs.length - 1;
    $('feedback').innerHTML = `
      <p class="feedback ${k === q.answer ? 'ok' : 'bad'}">${k === q.answer ? '✓ Correct' : '✗ Not quite. The correct answer is highlighted.'}</p>
      <button class="continue-btn" id="quizNext">${last ? 'See results' : 'Next question'} ›</button>`;
    $('quizNext').onclick = () => { if (last) renderQuizResult(); else { quiz.idx++; renderQuizQuestion(); } };
    $('quizNext').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderQuizResult() {
    const { c, qs, answers } = quiz;
    const correct = qs.filter((q, i) => answers[i] === q.answer).length;
    const pct = Math.round((correct / qs.length) * 100);
    const passed = pct >= c.quiz.passPct;
    const rec = state.quiz[c.id] || { best: 0, attempts: 0, passedAt: null };
    rec.attempts++;
    rec.best = Math.max(rec.best, pct);
    if (passed && !rec.passedAt) rec.passedAt = new Date().toISOString();
    state.quiz[c.id] = rec;
    saveState();
    view.innerHTML = `
      <div class="card done-banner">
        <div class="big">${passed ? '🎖️' : '🔁'}</div>
        <h1>${pct}%</h1>
        <p><strong>${correct} of ${qs.length}</strong> correct · pass mark ${c.quiz.passPct}%</p>
        <p class="feedback ${passed ? 'ok' : 'bad'}">${passed ? 'Passed. Well done!' : 'Not yet passed. Review the lessons and try again.'}</p>
      </div>
      <button class="continue-btn" id="quizRetry">${passed ? 'Retake quiz' : 'Try again'} ›</button>
      <button class="secondary-btn" data-href="#/c/${c.id}">Back to course</button>
      <h2 class="section-title">Review</h2>
      <div class="review">
        ${qs.map((q, i) => `<div class="card review-item ${answers[i] === q.answer ? 'ok' : 'bad'}">
          <div class="review-q">${i + 1}. ${esc(q.q)}</div>
          <div>${answers[i] === q.answer ? '✓' : '✗'} Your answer: ${esc(q.options[answers[i]])}</div>
          ${answers[i] === q.answer ? '' : `<div class="review-a">Correct: ${esc(q.options[q.answer])}</div>`}
        </div>`).join('')}
      </div>`;
    $('quizRetry').onclick = () => renderQuizIntro(c);
    window.scrollTo(0, 0);
    quiz = null;
  }

  // ---------- Routing ----------
  function route() {
    stopTimer();
    current = null;
    const parts = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    const c = parts[0] === 'c' && course(parts[1]);
    if (!c) renderAcademy();
    else if (parts[2] === 'l') renderLesson(c, parts[3]);
    else if (parts[2] === 'quiz' && c.quiz) renderQuizIntro(c);
    else renderCourse(c);
    view.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  const go = (href) => { if (location.hash === href) route(); else location.hash = href; };

  // ---------- Events ----------
  view.addEventListener('click', (e) => {
    const link = e.target.closest('[data-href]');
    if (link) return go(link.dataset.href);
    const opt = e.target.closest('[data-opt]');
    if (opt && quiz) return answerQuiz(+opt.dataset.opt);
    const zoom = e.target.closest('[data-zoom]');
    if (zoom) {
      const img = zoom.querySelector('img');
      $('lightboxImg').src = img.src;
      $('lightboxImg').alt = img.alt;
      $('lightboxCaption').textContent = img.alt;
      $('lightbox').hidden = false;
    }
  });
  $('lightboxClose').onclick = () => { $('lightbox').hidden = true; };
  $('lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox') $('lightbox').hidden = true; });

  $('backBtn').onclick = () => go($('backBtn').dataset.href || '#/');
  $('prevBtn').onclick = () => { if (current && current.i > 0) go(`#/c/${current.c.id}/l/${current.c.lessons[current.i - 1].id}`); };
  $('nextBtn').onclick = () => {
    if (!current) return;
    const { c, i } = current;
    if (i < c.lessons.length - 1) go(`#/c/${c.id}/l/${c.lessons[i + 1].id}`);
    else if (c.quiz) go(`#/c/${c.id}/quiz`);
  };

  $('completeBtn').onclick = () => {
    if (!current) return;
    const { c, i } = current;
    const l = c.lessons[i];
    const k = key(c, l);
    if (state.completed[k]) {
      delete state.completed[k];
      saveState();
      toast('Marked as not completed');
      return renderLesson(c, l.id);
    }
    state.completed[k] = new Date().toISOString();
    saveState();
    updateCompleteBtn();
    const next = nextIncomplete(c, i);
    if (next) {
      toast(`✓ ${c.lessonLabel} ${l.number} completed`);
      setTimeout(() => go(`#/c/${c.id}/l/${next.id}`), 600);
    } else if (!quizPassed(c)) {
      toast(`✓ All ${c.lessonLabel.toLowerCase()}s done. Time for the quiz!`);
      setTimeout(() => go(`#/c/${c.id}/quiz`), 900);
    } else {
      toast('🎖️ Course complete!');
      setTimeout(() => go(`#/c/${c.id}`), 900);
    }
  };

  // Swipe left/right between lessons
  let sx = null, sy = null;
  view.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  view.addEventListener('touchend', (e) => {
    if (sx === null || !current) return;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 2) (dx < 0 ? $('nextBtn') : $('prevBtn')).click();
  }, { passive: true });

  // Settings
  const openSheet = () => { $('settingsSheet').hidden = false; $('sheetBackdrop').hidden = false; };
  const closeSheet = () => { $('settingsSheet').hidden = true; $('sheetBackdrop').hidden = true; };
  $('settingsBtn').onclick = openSheet;
  $('closeSettings').onclick = closeSheet;
  $('sheetBackdrop').onclick = closeSheet;
  document.querySelectorAll('[data-theme-choice]').forEach((b) => {
    b.onclick = () => { state.theme = b.dataset.themeChoice; applyPrefs(); saveState(); };
  });
  $('textSmaller').onclick = () => { state.scale = Math.max(0.85, +(state.scale - 0.1).toFixed(2)); applyPrefs(); saveState(); };
  $('textLarger').onclick = () => { state.scale = Math.min(1.6, +(state.scale + 0.1).toFixed(2)); applyPrefs(); saveState(); };
  $('resetBtn').onclick = () => {
    if (!confirm('Reset all training progress (all courses) on this device?')) return;
    state.completed = {}; state.timeSpent = {}; state.last = {}; state.quiz = {};
    saveState(); closeSheet(); toast('Progress reset'); go('#/');
  };

  document.addEventListener('visibilitychange', () => { if (document.hidden) saveState(); });
  window.addEventListener('hashchange', route);

  // ---------- Start ----------
  loadState().then(() => { applyPrefs(); route(); });
})();
