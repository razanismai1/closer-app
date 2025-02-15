import { 
    getDatabase, 
    ref, 
    get,
    update,
    onValue 
} from 'firebase/database';
import { database } from './firebase.js';

// DOM Elements
const thinkingBtn = document.getElementById('thinking-btn');
const statsContainer = document.querySelector('.stats-container');
const counterGrid = document.querySelector('.counter-grid');
let userData = null;
let chart = null;

// Initialize the dashboard
async function initializeDashboard(userCode) {
    userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) return false;

    // Listen for thoughts in real-time
    const thoughtsRef = ref(database, `pairs/${userCode}_${userData.pairedWith}/thoughts`);
    onValue(thoughtsRef, (snapshot) => {
        if (snapshot.exists()) {
            updateStats(snapshot.val());
        }
    });

    // Listen for partner's name changes
    const partnerRef = ref(database, `users/${userData.pairedWith}`);
    onValue(partnerRef, (snapshot) => {
        if (snapshot.exists()) {
            const partnerData = snapshot.val();
            document.querySelector('.partner-name').textContent = partnerData.username;
        }
    });

    return true;
}

// Update stats display
function updateStats(thoughtsData) {
    const myThoughts = thoughtsData[userData.userCode] || 0;
    const theirThoughts = thoughtsData[userData.pairedWith] || 0;

    // Update counters
    counterGrid.innerHTML = `
        <div class="counter">
            <h3>Thoughts Sent</h3>
            <p>${myThoughts}</p>
        </div>
        <div class="counter">
            <h3>Thoughts Received</h3>
            <p>${theirThoughts}</p>
        </div>
    `;

    // Update chart
    if (chart) {
        chart.data.datasets[0].data = [theirThoughts];
        chart.update();
    }
}

// Send a thought
async function sendThought() {
    try {
        const pairId = `${userData.userCode}_${userData.pairedWith}`;
        const thoughtsRef = ref(database, `pairs/${pairId}/thoughts/${userData.userCode}`);
        
        // Get current count
        const snapshot = await get(thoughtsRef);
        const currentCount = snapshot.exists() ? snapshot.val() : 0;
        
        // Update thought count
        await update(ref(database, `pairs/${pairId}/thoughts`), {
            [userData.userCode]: currentCount + 1
        });

        // Add animation to button
        thinkingBtn.classList.add('clicked');
        setTimeout(() => {
            thinkingBtn.classList.remove('clicked');
        }, 300);

    } catch (error) {
        console.error('Error sending thought:', error);
        alert('Failed to send thought. Please try again.');
    }
}

// Initialize charts
function initializeCharts() {
    const ctx = document.getElementById('trendsChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Thoughts Received'],
            datasets: [{
                label: 'Thoughts from Partner',
                data: [0],
                backgroundColor: 'rgba(255, 107, 107, 0.5)',
                borderColor: 'rgba(255, 107, 107, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Event Listeners
thinkingBtn.addEventListener('click', sendThought);

// Tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Add this at the beginning of app.js
function checkAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const pairCode = urlParams.get('code');
    const username = urlParams.get('user');

    if (!pairCode || !username) {
        window.location.href = 'landing.html';
        return false;
    }
    return { pairCode, username };
}

// In your app.js, add this after checkAuth()
function initializePairListener(userCode) {
    pairingService.onPairStatusChange(userCode, (userData) => {
        if (userData.pairedWith) {
            // Update UI to show connected status
            document.querySelector('.connection-status').textContent = 
                `Connected with ${userData.pairedWith}`;
        }
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
    const auth = checkAuth();
    if (!auth) return;
    
    const initialized = await initializeDashboard(auth.pairCode);
    if (initialized) {
        initializeCharts();
    } else {
        window.location.href = 'landing.html';
    }
}); 