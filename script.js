// State Management
let appData = {
    currentWeight: 0,
    goalWeight: 0,
    history: []
};

// Load data from localStorage on startup
function init() {
    const saved = localStorage.getItem('weightTrackerData');
    if (saved) {
        appData = JSON.parse(saved);
    }
    updateUI();
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function updateUI() {
    const weightDisplay = document.getElementById('display-current');
    const progress = document.getElementById('progress-bar');
    const goalStatus = document.getElementById('display-goal-status');
    const historyList = document.getElementById('history-list');

    if (appData.currentWeight > 0) {
        weightDisplay.innerHTML = `${appData.currentWeight.toFixed(1)} <span class="unit">kg</span>`;
    }

    // Progress Logic
    if (appData.goalWeight > 0) {
        const diff = appData.goalWeight - appint_weight_logic(appData.currentWeight, appData.goalWeight);
        // Simple progress: how close are we to the goal?
        let percent = Math.min(100, Math.max(0, (1 - (appData.currentWeight / appData.goalWeight)) * 100));
        progress.style.width = percent + '%';
        goalStatus.innerText = `Target: ${appData.goalWeight}kg`;
    }

    // History Logic
    if (appData.history.length === 0) {
        historyList.innerHTML = '<li class="empty-state">No entries recorded yet.</li>';
    } else {
        historyList.innerHTML = appData.history.map(entry => `
            <li class="history-item">
                <span>${entry.date}</span>
                <strong>${entry.weight.toFixed(1)} kg</strong>
            </li>
        `).join('');
    }

    localStorage.setItem('weightTrackerData', JSON.stringify(appData));
}

function appint_weight_logic(curr, goal) { return curr; } // Helper

// Modal Logic
let currentMode = 'log'; 

function openModal(mode) {
    currentMode = mode;
    document.getElementById('modal-title').innerText = mode === 'log' ? 'Log Weight' : 'Set Goal';
    document.getElementById-modal-desc'.innerText = mode === 'log' ? 'Enter your current weight.' : 'Enter your target weight.';
    document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('weight-input').value = '';
}

function handleSave() {
    const val = parseFloat(document.getElementById('weight-input').value);
    if (isNaN(val) || val <= 0) return alert("Please enter a valid number");

    if (currentMode === 'log') {
        appData.currentWeight = val;
        appData.history.unshift({
            weight: val,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
        if (appData.history.length > 5) appData.history.pop();
    } else {
        appData.goalWeight = val;
    }

    updateUI();
    closeModal();
}

window.onload = init;
