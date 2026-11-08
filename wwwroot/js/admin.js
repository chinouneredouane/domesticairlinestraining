/* Instructor dashboard: summarises attempts recorded by the server. */
(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  let rows = [];

  function summarise(attempts) {
    const byTrainee = new Map();
    for (const a of attempts) {
      const key = `${a.traineeId}|${a.courseId}`;
      if (!byTrainee.has(key)) {
        byTrainee.set(key, { id: a.traineeId, name: a.traineeName, fleet: a.fleet, courseId: a.courseId,
          passedModules: new Set(), attempts: 0, exam: null, last: a.at });
      }
      const t = byTrainee.get(key);
      t.name = a.traineeName; t.fleet = a.fleet; t.attempts++;
      if (a.at > t.last) t.last = a.at;
      if (a.kind === "quiz" && a.passed) t.passedModules.add(a.moduleId);
      if (a.kind === "exam") {
        const pct = Math.round((a.score / a.total) * 100);
        if (!t.exam || (a.passed && !t.exam.passed) || pct > t.exam.pct) t.exam = { pct, passed: a.passed, at: a.at };
      }
    }
    return [...byTrainee.values()].map(t => {
      const course = window.COURSES.find(c => c.id === t.courseId);
      const total = course ? course.modules.length : 0;
      return { ...t, course: course ? course.short : t.courseId, done: t.passedModules.size, total };
    }).sort((a, b) => b.last.localeCompare(a.last));
  }

  function render() {
    const q = $("filter").value.trim().toLowerCase();
    const list = rows.filter(r => !q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
    const certified = rows.filter(r => r.exam && r.exam.passed).length;
    const scores = rows.filter(r => r.exam).map(r => r.exam.pct);

    $("stats").innerHTML = `
      <div class="stat"><b>${new Set(rows.map(r => r.id)).size}</b><span>Trainees</span></div>
      <div class="stat"><b>${certified}</b><span>Certified</span></div>
      <div class="stat"><b>${rows.filter(r => !(r.exam && r.exam.passed)).length}</b><span>In progress</span></div>
      <div class="stat"><b>${scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) + "%" : "—"}</b><span>Avg best exam score</span></div>`;

    $("trainees").innerHTML = `
      <thead><tr><th>Name</th><th>Staff ID</th><th>Fleet</th><th>Course</th><th>Modules</th><th>Final exam</th><th>Last activity</th></tr></thead>
      <tbody>${list.map(r => `
        <tr>
          <td>${esc(r.name)}</td><td>${esc(r.id)}</td><td>${esc(r.fleet)}</td><td>${esc(r.course)}</td>
          <td>${r.done}/${r.total}</td>
          <td>${r.exam ? `<span class="badge ${r.exam.passed ? "ok" : "bad"}">${r.exam.pct}% ${r.exam.passed ? "Pass" : "Fail"}</span>` : "—"}</td>
          <td>${new Date(r.last).toLocaleString()}</td>
        </tr>`).join("") || `<tr><td colspan="7" class="muted">No results yet.</td></tr>`}
      </tbody>`;
  }

  function csv() {
    const cell = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [["Name", "Staff ID", "Fleet", "Course", "Modules passed", "Modules total", "Exam %", "Exam result", "Last activity"]]
      .concat(rows.map(r => [r.name, r.id, r.fleet, r.course, r.done, r.total,
        r.exam ? r.exam.pct : "", r.exam ? (r.exam.passed ? "PASS" : "FAIL") : "", r.last]));
    const blob = new Blob([lines.map(l => l.map(cell).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `training-results-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  $("key-form").onsubmit = async e => {
    e.preventDefault();
    $("status").textContent = "Loading…";
    try {
      const res = await fetch("api/admin/attempts", { headers: { "X-Admin-Key": $("key").value } });
      if (res.status === 401) throw new Error("Invalid admin key.");
      if (!res.ok) throw new Error(`Server error (${res.status}).`);
      rows = summarise(await res.json());
      $("status").textContent = "";
      $("content").hidden = false;
      render();
    } catch (err) {
      $("status").textContent = err.message.includes("fetch") ? "Server not reachable." : err.message;
    }
  };
  $("filter").oninput = render;
  $("csv").onclick = csv;
})();
