(function () {
  'use strict';

  const MODULES = window.UPRT_MODULES;
  const $ = (id) => document.getElementById(id);
  const view = $('view');

  // ---------- Storage (native Preferences on iOS, localStorage in a browser) ----------
  const Prefs = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences;
  const STORE_KEY = 'uprt-state-v1';
  let state = { completed: {}, timeSpent: {}, lastModule: null, theme: 'auto', scale: 1, courseDoneAt: null };

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
  const indexOf = (id) => MODULES.findIndex((m) => m.id === id);
  const doneCount = () => MODULES.filter((m) => state.completed[m.id]).length;
  const nextIncomplete = () => MODULES.find((m) => !state.completed[m.id]);
  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    return m < 1 ? `${s}s` : m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`;
  };
  const totalTime = () => Object.values(state.timeSpent).reduce((a, b) => a + b, 0);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

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

  // ---------- Time tracking ----------
  let timer = null;
  function startTimer(id) {
    stopTimer();
    timer = setInterval(() => {
      if (document.hidden) return;
      state.timeSpent[id] = (state.timeSpent[id] || 0) + 1;
      if (state.timeSpent[id] % 10 === 0) saveState();
    }, 1000);
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; saveState(); } }

  // ---------- Views ----------
  function renderHome() {
    stopTimer();
    const done = doneCount();
    const total = MODULES.length;
    const pct = Math.round((done / total) * 100);
    const next = nextIncomplete();
    const resume = state.lastModule && !state.completed[state.lastModule] ? MODULES[indexOf(state.lastModule)] : next;
    const C = 2 * Math.PI * 36;

    $('topbarTitle').textContent = 'UPRT Training';
    $('backBtn').hidden = true;
    $('pager').hidden = true;

    view.innerHTML = `
      <section class="hero">
        <div class="ring" aria-label="${pct}% complete">
          <svg width="84" height="84" viewBox="0 0 84 84">
            <circle cx="42" cy="42" r="36" stroke="rgba(255,255,255,.2)" stroke-width="8" fill="none"/>
            <circle cx="42" cy="42" r="36" stroke="#5fd39d" stroke-width="8" fill="none" stroke-linecap="round"
              stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - done / total)}"/>
          </svg>
          <div class="pct">${pct}%</div>
        </div>
        <div>
          <h1>UPRT – All Fleet</h1>
          <p>${done} of ${total} modules completed${totalTime() ? ` · ${fmtTime(totalTime())} studied` : ''}</p>
        </div>
      </section>

      ${resume ? `
        <button class="continue-btn" data-open="${resume.id}">
          ${done === 0 ? 'Start training' : 'Continue'} <small>· Module ${resume.number}: ${esc(resume.title)}</small> ›
        </button>` : `
        <div class="card done-banner">
          <div class="big">🎖️</div>
          <h2>Course complete</h2>
          <p>All modules completed${state.courseDoneAt ? ' on ' + new Date(state.courseDoneAt).toLocaleDateString() : ''}.<br/>You may now proceed to evaluation.</p>
        </div>`}

      <h2 class="section-title">Modules</h2>
      <ul class="module-list">
        ${MODULES.map((m) => {
          const isDone = !!state.completed[m.id];
          const started = !isDone && state.timeSpent[m.id];
          return `<li><button class="module-card" data-open="${m.id}">
            <span class="module-icon" aria-hidden="true">${m.icon}</span>
            <span class="module-meta">
              <div class="module-num">MODULE ${m.number} · ~${m.minutes} MIN</div>
              <div class="module-name">${esc(m.title)}</div>
            </span>
            <span class="status ${isDone ? 'done' : started ? 'started' : 'new'}">${isDone ? '✓ Done' : started ? 'In progress' : '›'}</span>
          </button></li>`;
        }).join('')}
      </ul>`;
    view.focus();
    window.scrollTo(0, 0);
  }

  function renderModule(id) {
    const i = indexOf(id);
    if (i < 0) return renderHome();
    const m = MODULES[i];
    state.lastModule = id;
    saveState();
    startTimer(id);

    $('topbarTitle').textContent = `Module ${m.number}`;
    $('backBtn').hidden = false;
    $('pager').hidden = false;
    $('prevBtn').disabled = i === 0;
    $('nextBtn').disabled = i === MODULES.length - 1;
    updateCompleteBtn(m);

    view.innerHTML = `
      <div class="module-head">
        <div class="module-num">MODULE ${m.number} · STEP ${i + 1} OF ${MODULES.length}</div>
        <h1>${m.icon} ${esc(m.title)}</h1>
        <div class="progress-bar"><div style="width:${((i + 1) / MODULES.length) * 100}%"></div></div>
        <div class="chip-row">
          <span class="chip">~${m.minutes} min</span>
          ${state.completed[m.id] ? '<span class="chip done">✓ Completed</span>' : ''}
        </div>
      </div>

      <article class="card">${m.body}</article>

      ${m.audio ? `
        <div class="card audio-card" id="audioCard">
          <span class="label">🎧 Listen to this module</span>
          <audio controls preload="metadata" src="${m.audio}"></audio>
        </div>` : ''}

      ${m.images.length ? `
        <div class="gallery">
          ${m.images.map((img, k) => `
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

    view.focus();
    window.scrollTo(0, 0);
  }

  function updateCompleteBtn(m) {
    const b = $('completeBtn');
    const done = !!state.completed[m.id];
    b.textContent = done ? '✓ Completed' : 'Mark complete';
    b.classList.toggle('completed', done);
    b.classList.toggle('primary', !done);
  }

  // ---------- Routing ----------
  function route() {
    const match = location.hash.match(/^#\/module\/(.+)$/);
    if (match) renderModule(decodeURIComponent(match[1]));
    else renderHome();
  }
  const go = (id) => { location.hash = id ? `#/module/${encodeURIComponent(id)}` : '#/'; };
  const currentId = () => { const m = location.hash.match(/^#\/module\/(.+)$/); return m && decodeURIComponent(m[1]); };

  // ---------- Events ----------
  view.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open]');
    if (open) return go(open.dataset.open);
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

  $('backBtn').onclick = () => go(null);
  $('prevBtn').onclick = () => { const i = indexOf(currentId()); if (i > 0) go(MODULES[i - 1].id); };
  $('nextBtn').onclick = () => { const i = indexOf(currentId()); if (i < MODULES.length - 1) go(MODULES[i + 1].id); };

  $('completeBtn').onclick = () => {
    const id = currentId();
    const m = MODULES[indexOf(id)];
    if (!m) return;
    if (state.completed[id]) {
      delete state.completed[id];
      state.courseDoneAt = null;
      toast('Marked as not completed');
      saveState();
      return renderModule(id);
    }
    state.completed[id] = new Date().toISOString();
    if (doneCount() === MODULES.length) state.courseDoneAt = new Date().toISOString();
    saveState();
    if (state.courseDoneAt && doneCount() === MODULES.length) {
      toast('🎖️ Course complete!');
      return go(null);
    }
    toast(`✓ Module ${m.number} completed`);
    const next = MODULES.slice(indexOf(id) + 1).find((x) => !state.completed[x.id]) || nextIncomplete();
    setTimeout(() => (next ? go(next.id) : go(null)), 600);
  };

  // Swipe left/right between modules
  let sx = null, sy = null;
  view.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  view.addEventListener('touchend', (e) => {
    if (sx === null || !currentId()) return;
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
    if (!confirm('Reset all training progress on this device?')) return;
    state.completed = {}; state.timeSpent = {}; state.lastModule = null; state.courseDoneAt = null;
    saveState(); closeSheet(); toast('Progress reset'); go(null); route();
  };

  document.addEventListener('visibilitychange', () => { if (document.hidden) saveState(); });
  window.addEventListener('hashchange', route);

  // ---------- Start ----------
  loadState().then(() => { applyPrefs(); route(); });
})();
