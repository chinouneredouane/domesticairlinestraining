// Track completion
function markComplete(moduleId) {
    localStorage.setItem(moduleId, 'completed');
    alert(`Module "${moduleId}" marked as completed.`);
    updateProgress(moduleId);
}

// Show progress status
function updateProgress(moduleId) {
    const status = localStorage.getItem(moduleId);
    if (status === 'completed') {
        const badge = document.getElementById('progress-badge');
        if (badge) badge.textContent = '✅ Completed';
    }
}

// Timer
let startTime;
function startTimer() {
    startTime = Date.now();
    setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        document.getElementById('timer').textContent = `⏱ Time: ${minutes}m ${seconds}s`;
    }, 1000);
}