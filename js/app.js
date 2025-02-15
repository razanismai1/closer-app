// Remove Firebase-related imports for now since we're focusing on UI
// import { database } from './firebase.js';

// DOM Elements
const thinkingBtn = document.getElementById('thinking-btn');
const heartFill = document.querySelector('.heart-fill');
const loveLevelElement = document.querySelector('.love-level');
const loveMessage = document.querySelector('.love-message');

const usernameDisplay = document.querySelector('.username');
const pairCodeDisplay = document.querySelector('.pair-code');
const logoutBtn = document.getElementById('logoutBtn');

let currentLoveLevel = 0;
const messages = [
    "Your partner's heart is growing bigger for you!",
    "Keep the love flowing!",
    "Almost at soulmate level, keep going!",
    "Your love is reaching new heights!",
    "You're making their heart flutter!",
    "Love is in the air!",
    "Your partner's heart is overflowing!",
    "Soulmate status achieved! 💕",
];

// Add these functions for new animations
function createFloatingHearts() {
    const container = document.querySelector('.heart-container');
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '❤️';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.bottom = '0';
            container.appendChild(heart);
            
            // Remove after animation
            heart.addEventListener('animationend', () => heart.remove());
        }, i * 200);
    }
}

function createLoveParticles() {
    const container = document.querySelector('.heart-container');
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'love-particle';
        
        // Random position and movement
        const angle = (i / 12) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
        
        particle.style.animation = `particle 1s ease-out forwards`;
        container.appendChild(particle);
        
        // Remove after animation
        particle.addEventListener('animationend', () => particle.remove());
    }
}

// Update the love meter function
function updateLoveMeter() {
    // Increment the level
    currentLoveLevel = Math.min(currentLoveLevel + 10, 100);
    
    // Update fill height
    heartFill.style.transform = `scaleY(${currentLoveLevel / 100})`;
    
    // Update percentage
    loveLevelElement.textContent = `${currentLoveLevel}%`;
    
    // Update message
    const messageIndex = Math.floor((currentLoveLevel / 100) * (messages.length - 1));
    loveMessage.textContent = messages[messageIndex];
    
    // Add effects based on level
    if (currentLoveLevel >= 50) {
        heartFill.classList.add('active');
        createFloatingHearts();
    }
    
    // Create particles on every update
    createLoveParticles();
}

// Handle button click
function handleClick() {
    if (!thinkingBtn.disabled) {
        thinkingBtn.disabled = true;
        
        // Add button animation
        thinkingBtn.classList.add('clicked');
        
        // Create initial burst of particles
        createLoveParticles();
        
        // Update the heart meter
        updateLoveMeter();
        
        // Create floating hearts
        createFloatingHearts();
        
        // Re-enable button after animation
        setTimeout(() => {
            thinkingBtn.classList.remove('clicked');
            thinkingBtn.disabled = false;
        }, 1000);
    }
}

// Initialize user data
function initializeUserData() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
        window.location.href = 'landing.html';
        return;
    }

    // Update header
    usernameDisplay.textContent = userData.username;
    pairCodeDisplay.textContent = userData.userCode;
}

// Handle logout
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('userData');
    window.location.href = 'landing.html';
});

// Easter Egg Handler
const breakupBtn = document.getElementById('breakupBtn');
let clickCount = 0;
const breakupMessages = [
    {
        title: "Nice try! 😏",
        message: "Love doesn't have an undo button."
    },
    {
        title: "Still trying? 😅",
        message: "Oops! You can't escape that easily."
    },
    {
        title: "Really? 🤨",
        message: "The only way out is through more love!"
    }
];

function createPopup(title, message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h3 class="popup-title">${title}</h3>
            <p class="popup-message">${message}</p>
        </div>
        <button class="popup-btn">Fine, I'll stay! 🥰</button>
    `;
    
    document.body.appendChild(popup);
    
    // Show popup with delay for animation
    setTimeout(() => popup.classList.add('show'), 10);
    
    // Handle close button
    const closeBtn = popup.querySelector('.popup-btn');
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    });
}

breakupBtn.addEventListener('click', () => {
    const messageIndex = clickCount % breakupMessages.length;
    createPopup(breakupMessages[messageIndex].title, breakupMessages[messageIndex].message);
    clickCount++;
    
    // Add some fun animations to the page
    document.querySelectorAll('.heart-container').forEach(heart => {
        heart.style.animation = 'heartBeat 0.5s ease-in-out';
        setTimeout(() => heart.style.animation = '', 500);
    });
});

// Game Logic
const partner1Key = document.querySelector("#partner1Key");
const partner2Key = document.querySelector("#partner2Key");
const scoreDisplay = document.querySelector("#score");
const retryButton = document.querySelector("#retry");

const randomKeys = ["A", "S", "D", "F", "J", "K", "L", "P"];
let pressTimes = { partner1: null, partner2: null };
let currentKeys = { partner1: null, partner2: null };

function initGame() {
    // Generate different random keys for each partner
    do {
        currentKeys.partner1 = randomKeys[Math.floor(Math.random() * randomKeys.length)];
        currentKeys.partner2 = randomKeys[Math.floor(Math.random() * randomKeys.length)];
    } while (currentKeys.partner1 === currentKeys.partner2);

    partner1Key.textContent = currentKeys.partner1;
    partner2Key.textContent = currentKeys.partner2;
    partner1Key.classList.remove('pressed');
    partner2Key.classList.remove('pressed');
    scoreDisplay.textContent = '';
    pressTimes = { partner1: null, partner2: null };
}

document.addEventListener("keydown", (event) => {
    const key = event.key.toUpperCase();
    
    if (key === currentKeys.partner1 && !pressTimes.partner1) {
        pressTimes.partner1 = new Date().getTime();
        partner1Key.classList.add('pressed');
    }
    if (key === currentKeys.partner2 && !pressTimes.partner2) {
        pressTimes.partner2 = new Date().getTime();
        partner2Key.classList.add('pressed');
    }

    if (pressTimes.partner1 && pressTimes.partner2) {
        const timeDifference = Math.abs(pressTimes.partner1 - pressTimes.partner2);
        const compatibility = Math.max(0, 100 - timeDifference / 5);
        
        let message = '';
        if (compatibility > 90) {
            message = " - Perfect Match! 💖";
            scoreDisplay.classList.add('perfect-match');
            createHeartBurst();
        } else if (compatibility > 70) {
            message = " - Almost There! 💕";
        } else {
            message = " - Keep Practicing! 💝";
        }

        scoreDisplay.innerHTML = `Compatibility: ${compatibility.toFixed(1)}%<br>${message}`;
        
        setTimeout(() => {
            scoreDisplay.classList.remove('perfect-match');
        }, 1000);
    }
});

function createHeartBurst() {
    const container = document.querySelector('.game-container');
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤️';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 0.5}s`;
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 3000);
    }
}

retryButton.addEventListener("click", initGame);

// Initialize game when switching to stats tab
document.querySelector('[data-tab="stats"]').addEventListener('click', initGame);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeUserData();
    if (thinkingBtn) {
        thinkingBtn.addEventListener('click', handleClick);
    }

    // Initialize tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.animation = '';
            });
            
            btn.classList.add('active');
            const activeContent = document.getElementById(tabId);
            activeContent.classList.add('active');
            activeContent.style.animation = 'fadeInScale 0.3s ease-out';
        });
    });
}); 