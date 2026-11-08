/* Domestic Airlines Training – trainee app (vanilla JS, hash routing). */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const userMenu = document.getElementById("user-menu");
  const USER_KEY = "dat.user";

  // ---------- storage helpers ----------
  function load(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  }

  const getUser = () => load(USER_KEY, null);
  const progressKey = (u, c) => `dat.progress.${u.id}.${c}`;
  const getProgress = (u, c) => load(progressKey(u, c), { modules: {}, exam: null });
  const setProgress = (u, c, p) => save(progressKey(u, c), p);

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, ch =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  const findCourse = id => window.COURSES.find(c => c.id === id);

  // Report to the server; the app keeps working offline / without a backend.
  function report(attempt) {
    const u = getUser();
    fetch("api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ traineeId: u.id, traineeName: u.name, fleet: u.fleet, ...attempt })
    }).catch(() => {});
  }

  function moduleState(course, progress) {
    let unlocked = true;
    return course.modules.map(m => {
      const p = progress.modules[m.id];
      const done = !!(p && p.passed);
      const state = done ? "done" : unlocked ? "current" : "locked";
      if (!done) unlocked = false;
      return { m, p, state };
    });
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  // ---------- timer ----------
  let timerHandle = null;
  function stopTimer() { if (timerHandle) clearInterval(timerHandle); timerHandle = null; }
  function startTimer(el) {
    const start = Date.now();
    timerHandle = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      el.textContent = `⏱ ${Math.floor(s / 60)}m ${s % 60}s`;
    }, 1000);
  }

  // ---------- views ----------
  function renderUserMenu() {
    const u = getUser();
    userMenu.innerHTML = u
      ? `<span>${esc(u.name)} · ${esc(u.id)}</span><button id="logout">Sign out</button>`
      : "";
    if (u) document.getElementById("logout").onclick = () => {
      localStorage.removeItem(USER_KEY);
      location.hash = "#/";
      route();
    };
  }

  function viewLogin() {
    app.innerHTML = `
      <div class="card login">
        <h1>Welcome</h1>
        <p class="muted">Sign in with your staff details to start or continue your training.</p>
        <form id="login-form">
          <label for="name">Full name</label>
          <input id="name" required maxlength="100" autocomplete="name" />
          <label for="sid">Staff ID</label>
          <input id="sid" required maxlength="50" pattern="[A-Za-z0-9\\-_.]+" title="Letters, numbers, - _ ." />
          <label for="fleet">Fleet / Position</label>
          <select id="fleet">
            <option>B737-800 Captain</option>
            <option>B737-800 First Officer</option>
            <option>Cadet / Trainee</option>
            <option>Instructor</option>
          </select>
          <p><button type="submit">Start training</button></p>
        </form>
      </div>`;
    document.getElementById("login-form").onsubmit = e => {
      e.preventDefault();
      save(USER_KEY, {
        name: document.getElementById("name").value.trim(),
        id: document.getElementById("sid").value.trim().toUpperCase(),
        fleet: document.getElementById("fleet").value
      });
      route();
    };
  }

  function viewDashboard() {
    const u = getUser();
    const cards = window.COURSES.map(course => {
      const prog = getProgress(u, course.id);
      const states = moduleState(course, prog);
      const done = states.filter(s => s.state === "done").length;
      const pct = Math.round((done / course.modules.length) * 100);
      const examPassed = prog.exam && prog.exam.passed;
      const next = states.find(s => s.state === "current");
      const totalMin = course.modules.reduce((t, m) => t + m.minutes, 0);

      const list = states.map(({ m, p, state }, i) => `
        <li class="${state}">
          <div class="num">${state === "done" ? "✓" : i + 1}</div>
          <div class="spacer">
            <div class="title">${esc(m.title)}</div>
            <div class="muted">${m.minutes} min · ${m.quiz.length}-question knowledge check</div>
          </div>
          ${p ? `<span class="badge ${p.passed ? "ok" : "bad"}">Best ${p.best}%</span>` : ""}
          ${state === "locked"
            ? `<span class="badge">🔒 Locked</span>`
            : `<a class="btn ${state === "done" ? "btn-secondary" : ""}" href="#/course/${course.id}/module/${m.id}">${state === "done" ? "Review" : "Start"}</a>`}
        </li>`).join("");

      const allDone = done === course.modules.length;
      return `
        <section class="card">
          <div class="row">
            <div class="spacer">
              <h2 style="margin:0">${esc(course.title)}</h2>
              <div class="muted">${esc(course.fleet)} · ${course.modules.length} modules · ~${totalMin} min</div>
            </div>
            ${examPassed ? `<span class="badge ok">✓ Certified</span>` : ""}
          </div>
          <p>${esc(course.description)}</p>
          <div class="progress" aria-label="Course progress"><span style="width:${pct}%"></span></div>
          <div class="stats">
            <div class="stat"><b>${pct}%</b><span>Modules complete</span></div>
            <div class="stat"><b>${done}/${course.modules.length}</b><span>Knowledge checks passed</span></div>
            <div class="stat"><b>${prog.exam ? prog.exam.percent + "%" : "—"}</b><span>Final exam (pass ${course.passMark}%)</span></div>
          </div>
          <div class="row" style="margin-bottom:12px">
            ${next ? `<a class="btn" href="#/course/${course.id}/module/${next.m.id}">${done ? "Continue" : "Begin"}: ${esc(next.m.title)}</a>` : ""}
            ${allDone ? `<a class="btn btn-accent" href="#/course/${course.id}/exam">${prog.exam ? "Retake" : "Take"} final exam</a>` : ""}
            ${examPassed ? `<a class="btn btn-secondary" href="#/course/${course.id}/certificate">View certificate</a>` : ""}
          </div>
          <ul class="modules">${list}</ul>
        </section>`;
    }).join("");

    app.innerHTML = `
      <h1>Hello, ${esc(u.name.split(" ")[0])}</h1>
      <p class="muted">Complete each module and pass its knowledge check (${window.COURSES[0].passMark}%) to unlock the next. Finish all modules to sit the final exam and earn your certificate.</p>
      ${cards}`;
  }

  function guardModule(course, moduleId) {
    const u = getUser();
    const states = moduleState(course, getProgress(u, course.id));
    const idx = states.findIndex(s => s.m.id === moduleId);
    if (idx < 0 || states[idx].state === "locked") { location.hash = "#/"; return null; }
    return { idx, states };
  }

  function viewModule(course, moduleId) {
    const g = guardModule(course, moduleId);
    if (!g) return;
    const m = course.modules[g.idx];
    const imgs = m.images.map(src =>
      `<img src="images/${esc(src)}" alt="${esc(m.title)}" loading="lazy" onerror="this.remove()" />`).join("");

    app.innerHTML = `
      <div class="crumbs"><a href="#/">Dashboard</a> › ${esc(course.short)} › Module ${g.idx + 1}</div>
      <article class="card lesson">
        <div class="row">
          <h1 class="spacer">${g.idx + 1}. ${esc(m.title)}</h1>
          <span class="timer" id="timer">⏱ 0m 0s</span>
        </div>
        ${m.body}
        ${imgs ? `<div class="gallery">${imgs}</div>` : ""}
        ${m.audio ? `<audio controls preload="none" src="audio/${esc(m.audio)}" onerror="this.remove()"></audio>` : ""}
      </article>
      <div class="row">
        ${g.idx > 0 ? `<a class="btn btn-secondary" href="#/course/${course.id}/module/${course.modules[g.idx - 1].id}">← Previous</a>` : `<a class="btn btn-secondary" href="#/">← Dashboard</a>`}
        <span class="spacer"></span>
        <a class="btn" href="#/course/${course.id}/quiz/${m.id}">Take knowledge check →</a>
      </div>`;
    startTimer(document.getElementById("timer"));
  }

  function renderQuiz({ title, crumbs, questions, onSubmit }) {
    app.innerHTML = `
      <div class="crumbs">${crumbs}</div>
      <div class="card">
        <h1>${title}</h1>
        <p class="muted">${questions.length} questions. Select one answer for each.</p>
        <div id="result"></div>
        <form id="quiz">
          ${questions.map((q, i) => `
            <fieldset class="question" style="border:none;padding:0;margin:0 0 18px">
              <p>${i + 1}. ${q.q}</p>
              ${q.options.map((o, j) => `
                <label class="option" data-q="${i}" data-o="${j}">
                  <input type="radio" name="q${i}" value="${j}" required /> <span>${o}</span>
                </label>`).join("")}
              <div class="why" id="why${i}" hidden>${q.why || ""}</div>
            </fieldset>`).join("")}
          <div class="row" id="quiz-actions"><button type="submit">Submit answers</button></div>
        </form>
      </div>`;

    document.getElementById("quiz").onsubmit = e => {
      e.preventDefault();
      let score = 0;
      questions.forEach((q, i) => {
        const chosen = Number(new FormData(e.target).get(`q${i}`));
        if (chosen === q.answer) score++;
        e.target.querySelectorAll(`.option[data-q="${i}"]`).forEach(el => {
          const o = Number(el.dataset.o);
          if (o === q.answer) el.classList.add("correct");
          else if (o === chosen) el.classList.add("wrong");
        });
        document.getElementById(`why${i}`).hidden = false;
      });
      e.target.querySelectorAll("input").forEach(i => (i.disabled = true));
      onSubmit(score, document.getElementById("result"), document.getElementById("quiz-actions"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }

  function viewQuiz(course, moduleId) {
    const g = guardModule(course, moduleId);
    if (!g) return;
    const m = course.modules[g.idx];
    const next = course.modules[g.idx + 1];

    renderQuiz({
      title: `Knowledge check: ${esc(m.title)}`,
      crumbs: `<a href="#/">Dashboard</a> › <a href="#/course/${course.id}/module/${m.id}">Module ${g.idx + 1}</a> › Knowledge check`,
      questions: m.quiz,
      onSubmit(score, resultEl, actions) {
        const total = m.quiz.length;
        const percent = Math.round((score / total) * 100);
        const passed = percent >= course.passMark;
        const u = getUser();
        const prog = getProgress(u, course.id);
        const prev = prog.modules[m.id];
        prog.modules[m.id] = {
          passed: passed || !!(prev && prev.passed),
          best: Math.max(percent, prev ? prev.best : 0),
          attempts: (prev ? prev.attempts : 0) + 1,
          at: new Date().toISOString()
        };
        setProgress(u, course.id, prog);
        report({ courseId: course.id, moduleId: m.id, kind: "quiz", score, total, passed });

        resultEl.innerHTML = `<div class="result ${passed ? "pass" : "fail"}">
          ${passed ? "✅ Passed" : "❌ Not passed"} — ${score}/${total} (${percent}%). Pass mark ${course.passMark}%.</div>`;
        actions.innerHTML = passed
          ? (next
              ? `<a class="btn" href="#/course/${course.id}/module/${next.id}">Next module: ${esc(next.title)} →</a>`
              : `<a class="btn btn-accent" href="#/course/${course.id}/exam">Go to final exam →</a>`)
            + `<a class="btn btn-secondary" href="#/">Dashboard</a>`
          : `<a class="btn btn-secondary" href="#/course/${course.id}/module/${m.id}">Review module</a>
             <button id="retry">Retry</button>`;
        const retry = document.getElementById("retry");
        if (retry) retry.onclick = () => viewQuiz(course, moduleId);
      }
    });
  }

  function viewExam(course) {
    const u = getUser();
    const prog = getProgress(u, course.id);
    if (moduleState(course, prog).some(s => s.state !== "done")) { location.hash = "#/"; return; }

    const pool = course.modules.flatMap(m => m.quiz).concat(course.examExtra || []);
    const questions = shuffle(pool).slice(0, Math.min(course.examQuestionCount, pool.length)).map(q => {
      const order = shuffle(q.options.map((_, i) => i));
      return { ...q, options: order.map(i => q.options[i]), answer: order.indexOf(q.answer) };
    });

    renderQuiz({
      title: `Final exam: ${esc(course.title)}`,
      crumbs: `<a href="#/">Dashboard</a> › ${esc(course.short)} › Final exam`,
      questions,
      onSubmit(score, resultEl, actions) {
        const total = questions.length;
        const percent = Math.round((score / total) * 100);
        const passed = percent >= course.passMark;
        const p = getProgress(u, course.id);
        const wasPassed = p.exam && p.exam.passed;
        // Keep the first passing result for the certificate; otherwise record the latest.
        if (!wasPassed) {
          p.exam = {
            passed, percent, score, total,
            at: new Date().toISOString(),
            certId: passed ? `DA-${course.short}-${u.id}-${Date.now().toString(36).toUpperCase()}` : null
          };
          setProgress(u, course.id, p);
        }
        report({ courseId: course.id, moduleId: "final-exam", kind: "exam", score, total, passed });

        resultEl.innerHTML = `<div class="result ${passed ? "pass" : "fail"}">
          ${passed ? "🎉 Congratulations, you passed!" : "❌ Not passed"} — ${score}/${total} (${percent}%). Pass mark ${course.passMark}%.</div>`;
        actions.innerHTML = (passed || wasPassed)
          ? `<a class="btn btn-accent" href="#/course/${course.id}/certificate">View certificate</a><a class="btn btn-secondary" href="#/">Dashboard</a>`
          : `<a class="btn btn-secondary" href="#/">Review modules</a><button id="retry">Retake exam</button>`;
        const retry = document.getElementById("retry");
        if (retry) retry.onclick = () => viewExam(course);
      }
    });
  }

  function viewCertificate(course) {
    const u = getUser();
    const e = getProgress(u, course.id).exam;
    if (!e || !e.passed) { location.hash = "#/"; return; }
    app.innerHTML = `
      <div class="certificate">
        <p class="muted" style="color:#5d6b7a">Domestic Airlines · Flight Operations Training</p>
        <h1>Certificate of Completion</h1>
        <p>This is to certify that</p>
        <div class="name">${esc(u.name)}</div>
        <p>Staff ID ${esc(u.id)} · ${esc(u.fleet)}</p>
        <p>has successfully completed</p>
        <h2>${esc(course.title)}</h2>
        <p>${esc(course.fleet)} · Final assessment score ${e.percent}%</p>
        <div class="meta">
          <div><b>Date</b><br>${fmtDate(e.at)}</div>
          <div><b>Certificate No.</b><br>${esc(e.certId)}</div>
          <div><b>Training Manager</b><br><br>____________________</div>
        </div>
      </div>
      <div class="row no-print" style="justify-content:center">
        <button onclick="window.print()">🖨 Print / Save as PDF</button>
        <a class="btn btn-secondary" href="#/">Dashboard</a>
      </div>`;
  }

  // ---------- router ----------
  function route() {
    stopTimer();
    renderUserMenu();
    if (!getUser()) return viewLogin();

    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const course = parts[0] === "course" ? findCourse(parts[1]) : null;
    if (course && parts[2] === "module") viewModule(course, parts[3]);
    else if (course && parts[2] === "quiz") viewQuiz(course, parts[3]);
    else if (course && parts[2] === "exam") viewExam(course);
    else if (course && parts[2] === "certificate") viewCertificate(course);
    else viewDashboard();
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", route);
  route();
})();
