let history = JSON.parse(localStorage.getItem('weightHistory')) || [];
let goal = JSON.parse(localStorage.getItem('weightGoal')) || null;
let chart = null;

const listEl = document.getElementById('history-list');
const currentWeightEl = document.getElementById('current-weight');
const goalWeightEl = document.getElementById('goal-weight');
const modal = document.getElementById('modal');
const weightInput = document.getElementById('weight-input');

// Initialize App
function init() {
    render();
    initChart();
    
    document.getElementById('fab').onclick = () => modal.style.display = 'flex';
    document.getElementById('cancel-btn').onclick = () => modal.style.display = 'none';
    document.getElementById('save-btn').onclick = saveEntry;
    document.getElementById('clear-btn').onclick = clearData;
}

function saveEntry() {
    const val = parseFloat(weightInput.value);
    if (!val) return;

    const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        weight: val
    };

    // If first entry, set goal
    if (history.length === 0) {
        goal = { target: val };
        localStorage.setItem('weightGoal', JSON.stringify(goal));
    }

    history.unshift(newEntry);
    localStorage.setItem('weightHistory', JSON.stringify(history));
    
    weightInput.value = '';
    modal.style.display = 'none';
    
    render();
    updateChart();
}

function deleteEntry(id) {
    history = history.filter(item => item.id !== id);
    localStorage.setItem('weightHistory', JSON.stringify(history));
    render();
    updateChart();
}

function clearData() {
    if (confirm("Delete everything?")) {
        history = [];
        goal = null;
        localStorage.clear();
        location.reload();
    }
}

function render() {
    // Update Stats
    currentWeightEl.textContent = history.length > 0 ? `${history[0].weight}kg` : '--';
    goalWeightEl.textContent = goal ? `${goal.target}kg` : '--';

    // Update List
    listEl.innerHTML = history.length === 0 ? '<p style="text-align:center; color:gray; padding:20px;">No entries yet.</p>' : '';
    history.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div>
                <p style="font-weight:bold">${entry.weight} kg</p>
                <p style="font-size:0.75rem; color:gray">${entry.date}</p>
            </div>
            <button onclick="deleteEntry(${entry.id})" style="background:none; border:none; color:red; cursor:pointer;">🗑️</button>
        `;
        listEl.appendChild(div);
    });
}

function initChart() {
    const ctx = document.getElementById('weightChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: history.map(e => e.date).reverse(),
            datasets: [{
                label: 'Weight',
                data: [...history].reverse().map(e => e.weight),
                borderColor: '#10b981',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(16, 185, 129, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { grid: { color: '#27272a' }, ticks: { color: '#a1a1aa' } }
            }
        }
    });
}

function updateChart() {
    chart.data.labels = history.map(e => e.date).reverse();
    chart.data.datasets[0].data = [...history].reverse().map(e => e.weight);
    chart.update();
}

init();
