import { 
    ref, 
    set, 
    get,
    update,
    onValue 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase.js';

// DOM Elements
const authForm = document.getElementById('auth-form');
const generateCodeBtn = document.getElementById('generateCode');
const pairCodeDisplay = document.getElementById('pairCodeDisplay');
const usernameInput = document.getElementById('username');
const pairCodeInput = document.getElementById('pairCode');

class PairingService {
    constructor() {
        this.database = database;
    }

    // Generate a unique code
    generateUniqueCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const codeLength = 6;
        return Array.from(
            { length: codeLength }, 
            () => chars.charAt(Math.floor(Math.random() * chars.length))
        ).join('');
    }

    // Create a new user with a unique code
    async createUser(username) {
        try {
            let userCode;
            let codeExists = true;
            let attempts = 0;
            const maxAttempts = 10;

            // Keep generating until we get a unique code
            while (codeExists && attempts < maxAttempts) {
                userCode = this.generateUniqueCode();
                const snapshot = await get(ref(this.database, `users/${userCode}`));
                codeExists = snapshot.exists();
                attempts++;
            }

            if (attempts >= maxAttempts) {
                throw new Error('Failed to generate unique code after multiple attempts');
            }

            const userData = {
                username,
                userCode,
                createdAt: new Date().toISOString(),
                pairedWith: null,
                status: 'active'
            };

            // Save to Firebase
            await set(ref(this.database, `users/${userCode}`), userData);
            
            console.log('User created successfully:', userData); // Debug log
            return { success: true, userCode, userData };
        } catch (error) {
            console.error('Error creating user:', error);
            return { success: false, error: error.message };
        }
    }

    // Check if a user code exists
    async checkUserCode(code) {
        try {
            const snapshot = await get(ref(this.database, `users/${code}`));
            return snapshot.exists() && !snapshot.val().pairedWith;
        } catch (error) {
            console.error('Error checking user code:', error);
            return false;
        }
    }

    // Create a pair between two users
    async createPair(userCode1, userCode2) {
        try {
            const pairId = `${userCode1}_${userCode2}`;
            const updates = {};

            // Update both users
            updates[`users/${userCode1}/pairedWith`] = userCode2;
            updates[`users/${userCode2}/pairedWith`] = userCode1;

            // Create pair entry
            updates[`pairs/${pairId}`] = {
                users: {
                    [userCode1]: true,
                    [userCode2]: true
                },
                createdAt: new Date().toISOString(),
                status: 'active',
                thoughts: {
                    [userCode1]: 0,
                    [userCode2]: 0
                }
            };

            // Perform atomic update
            await update(ref(this.database), updates);
            return { success: true, pairId };
        } catch (error) {
            console.error('Error creating pair:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user data
    async getUserData(userCode) {
        try {
            const snapshot = await get(ref(this.database, `users/${userCode}`));
            return snapshot.exists() ? snapshot.val() : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }

    // Listen for pair status changes
    onPairStatusChange(userCode, callback) {
        const userRef = ref(this.database, `users/${userCode}`);
        return onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val());
            }
        });
    }
}

// Initialize the pairing service
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
            // Add sparkle effect on each character
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

    // Disable button during animation
    generateCodeBtn.disabled = true;
    generateCodeBtn.textContent = 'Generating...';

    try {
        // Generate code
        const code = pairingService.generateUniqueCode();
        
        // Store user data
        sessionStorage.setItem('userData', JSON.stringify({
            username,
            userCode: code
        }));

        // Display code with animation
        displayCode(code);

        // Add copy functionality
        const codeElement = pairCodeDisplay.querySelector('.code');
        codeElement.addEventListener('click', () => {
            navigator.clipboard.writeText(code)
                .then(() => {
                    codeElement.setAttribute('data-tooltip', 'Copied!');
                    // Add success animation
                    codeElement.classList.add('copied');
                    setTimeout(() => {
                        codeElement.removeAttribute('data-tooltip');
                        codeElement.classList.remove('copied');
                    }, 2000);
                });
        });

        // Disable pair code input
        pairCodeInput.value = '';
        pairCodeInput.disabled = true;

        // Update button state
        generateCodeBtn.textContent = 'Code Generated!';
        generateCodeBtn.disabled = true;

    } catch (error) {
        console.error('Error generating code:', error);
        alert('Failed to generate code. Please try again.');
        generateCodeBtn.textContent = 'Generate New Pair Code';
        generateCodeBtn.disabled = false;
    }
});

// Handle input changes
usernameInput.addEventListener('input', () => {
    const hasUsername = usernameInput.value.trim().length > 0;
    generateCodeBtn.disabled = !hasUsername;
    if (hasUsername) {
        generateCodeBtn.textContent = 'Generate New Pair Code';
    }
});

// Format pair code input
pairCodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
    if (e.target.value.length > 6) {
        e.target.value = e.target.value.slice(0, 6);
    }
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const partnerCode = pairCodeInput.value.trim().toUpperCase();

    if (!username || !partnerCode) {
        alert('Please fill in all fields');
        return;
    }

    // First check if partner code exists
    const partnerExists = await pairingService.checkUserCode(partnerCode);
    if (!partnerExists) {
        alert('Invalid partner code. Please check and try again.');
        return;
    }

    // Create user and pair them
    const userResult = await pairingService.createUser(username);
    if (userResult.success) {
        const pairResult = await pairingService.createPair(userResult.userCode, partnerCode);
        
        if (pairResult.success) {
            // Store connection data
            sessionStorage.setItem('userData', JSON.stringify({
                username,
                userCode: userResult.userCode,
                pairedWith: partnerCode
            }));
            
            // Redirect to main app
            window.location.href = `index.html?code=${userResult.userCode}&paired=${partnerCode}&user=${encodeURIComponent(username)}`;
        } else {
            alert('Failed to connect with partner. Please try again.');
        }
    } else {
        alert('Failed to create user. Please try again.');
    }
}); 