// DOM Elements
const authForm = document.getElementById('auth-form');
const generateCodeBtn = document.getElementById('generateCode');
const pairCodeDisplay = document.getElementById('pairCodeDisplay');
const usernameInput = document.getElementById('username');
const pairCodeInput = document.getElementById('pairCode');
const loginBtn = document.getElementById('connectBtn');

// Store users locally
const users = {};

class PairingService {
    generateUniqueCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const codeLength = 6;
        return Array.from(
            { length: codeLength }, 
            () => chars.charAt(Math.floor(Math.random() * chars.length))
        ).join('');
    }

    createUser(username) {
        const userCode = this.generateUniqueCode();
        const userData = {
            username,
            userCode,
            createdAt: new Date().toISOString()
        };
        
        // Store in local users object
        users[userCode] = userData;
        return { success: true, userCode };
    }

    getUserData(userCode) {
        return users[userCode] || null;
    }
}

const pairingService = new PairingService();

// Show code with animation
function displayCode(code) {
    const codeElement = pairCodeDisplay.querySelector('.code');
    codeElement.textContent = '';
    pairCodeDisplay.classList.remove('hidden');
    
    // Add typing effect
    for (let i = 0; i < code.length; i++) {
        setTimeout(() => {
            codeElement.textContent += code[i];
            createSparkle(codeElement);
        }, i * 150);
    }
}

// Create sparkle effect
function createSparkle(element) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    element.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

// Handle generate code button click
generateCodeBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    
    if (!username) {
        alert('Please enter your name first');
        return;
    }

    generateCodeBtn.disabled = true;
    generateCodeBtn.textContent = 'Generating...';

    try {
        const result = pairingService.createUser(username);
        
        // Store user data
        const userData = {
            username,
            userCode: result.userCode
        };
        sessionStorage.setItem('userData', JSON.stringify(userData));

        // Display code with animation
        displayCode(result.userCode);
        
        // Update button state
        generateCodeBtn.textContent = 'Code Generated!';
        
        // Redirect after showing code
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        alert('Failed to generate code. Please try again.');
        generateCodeBtn.textContent = 'Generate New Code';
        generateCodeBtn.disabled = false;
    }
});

// Handle form submission for login
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const userCode = pairCodeInput.value.trim().toUpperCase();

    if (!username || !userCode) {
        alert('Please fill in all fields');
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    try {
        const userData = pairingService.getUserData(userCode);
        if (!userData) {
            throw new Error('Invalid code. Please check and try again.');
        }

        // Store user data in session
        sessionStorage.setItem('userData', JSON.stringify({
            username,
            userCode
        }));
        
        // Redirect to main app
        window.location.href = 'index.html';
        
    } catch (error) {
        alert(error.message || 'Failed to log in. Please try again.');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
});

// Enable/disable buttons based on input
usernameInput.addEventListener('input', () => {
    const hasUsername = usernameInput.value.trim().length > 0;
    generateCodeBtn.disabled = !hasUsername;
    loginBtn.disabled = !hasUsername || pairCodeInput.value.length !== 6;
});

pairCodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
    if (e.target.value.length > 6) {
        e.target.value = e.target.value.slice(0, 6);
    }
    loginBtn.disabled = e.target.value.length !== 6 || !usernameInput.value.trim();
}); 