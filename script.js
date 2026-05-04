// State Management
let weights = JSON.parse(localStorage.getItem('weights')) || [];
let goalWeight = localStorage.getItem('goalWeight') || null;
let currentMode = 'ADD_WEIGHT'; // Modes: 'ADD_WEIGHT' or 'SET_GOAL'

// DOM Elements
const modalOverlay = document.getElementById('modal-overlay');
const modalInput = document.getElementById('modal-input');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const weightDisplay = document.getElementById('current-weight-display');
const goalDisplay = document.getElementById('goal-weight-display');
const historyList = document.getElementById('history-list');
const ctx = document.getElementById('weightChart').getContext('2d');

let chart;

// Initialize App
function init() {
    updateUI();
    setupEventListeners();
    renderChart();
}

function updateUI() {
    // Update weight displays
    const latestWeight = weights.length > 0 ? weights[weights.length - 1].value : '--';
    weightDisplay.innerText = latestWeight + ' kg';
    goalDisplay.innerText = goalWeight ? goalWeight + ' kg' : '--';

    // Update History List
    historyList.innerHTML = '';
    [...weights].reverse().forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${entry.date}</span> <strong>${entry.value} kg</strong>`;
        historyList.appendChild(li);
    });

    updateChart();
    localStorage.setItem('weights', JSON.stringify(weights));
    localStorage.setItem('goalWeight', goalWeight);
}

function setupEventListeners() {
    document.getElementById('add-weight-btn').onclick = () => openModal('ADD_WEIGHT');
    document.getElementById('set-goal-btn').onclick = () => openModal('SET_GOAL');
    document.getElementById('modal-cancel').onclick = closeModal;
    document.getElementById('modal-save').onclick = handleSave;
}

function openModal(mode) {
    currentMode = mode;
    modalInput.value = '';
    
    if (mode === 'ADD_WEIGHT') {
        modalTitle.innerText = "Add Weight";
        modalDesc.innerText = "Enter your current weight.";
    } else {
        modalTitle.innerText = "Set Goal";
        modalDesc.innerText = "What is your target weight?";
    }
    
    modalOverlay.style.display = 'flex';
    modalInput.focus();
}

function closeModal() {
    modalOverlay.style.display = 'none';
}

function handleSave() {
    const val = parseFloat(modalInput.value);
    if (isNaN(val)) return alert("Please enter a valid number");

    if (currentMode === 'ADD_WEIGHT') {
        const newEntry = {
            value: val,
            date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        };
        weights.push(newEntry);
    } else {
        goalWeight = val;
    }

    updateUI();
    closeModal();
}

function renderChart() {
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weights.map(w => w.date),
            datasets: [{
                label: 'Weight (kg)',
                data: weights.map(w => w.value),
                borderColor: '#2ecc71',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: false } }
        }
    });
}

function updateChart() {
    if (!chart) return;
    chart.data.labels = weights.map(w => w.date);
    chart.data.datasets[0].data = weights.map(w => w.value);
    chart.update();
}

init();
