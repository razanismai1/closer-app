// Remove Firebase-related imports for now since we're focusing on UI
// import { database } from './firebase.js';

// DOM Elements
const thinkingBtn = document.getElementById('thinking-btn');
const heartFill = document.querySelector('.heart-fill');
const loveLevelElement = document.querySelector('.love-level');
const loveMessage = document.querySelector('.love-message');

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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
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