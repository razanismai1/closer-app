import { initializeApp } from 'firebase/app';
import { 
    getDatabase, 
    ref, 
    set, 
    get,
    update,
    onValue 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { firebaseConfig } from './firebase.js';
import { database } from './firebase.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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

// Event Listeners
generateCodeBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (!username) {
        alert('Please enter your name first');
        return;
    }

    try {
        // Create new user with unique code
        const result = await pairingService.createUser(username);
        
        if (result.success) {
            // Show the generated code
            const codeElement = pairCodeDisplay.querySelector('.code');
            codeElement.textContent = result.userCode;
            pairCodeDisplay.classList.remove('hidden');
            
            // Store user data in sessionStorage
            sessionStorage.setItem('userData', JSON.stringify({
                username,
                userCode: result.userCode
            }));
            
            // Add copy button functionality
            codeElement.addEventListener('click', () => {
                navigator.clipboard.writeText(result.userCode)
                    .then(() => {
                        codeElement.setAttribute('data-tooltip', 'Copied!');
                        setTimeout(() => {
                            codeElement.removeAttribute('data-tooltip');
                        }, 2000);
                    })
                    .catch(() => {
                        alert('Failed to copy code. Please copy manually.');
                    });
            });

            // Disable the generate button after successful code generation
            generateCodeBtn.disabled = true;
            
            // Clear the pair code input since this user is initiating
            pairCodeInput.value = '';
            pairCodeInput.disabled = true;
        } else {
            throw new Error(result.error || 'Failed to generate code');
        }
    } catch (error) {
        console.error('Error generating code:', error);
        alert('Failed to generate code. Please try again.');
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

// Update the input handler to enable/disable buttons appropriately
usernameInput.addEventListener('input', () => {
    const hasUsername = usernameInput.value.trim().length > 0;
    generateCodeBtn.disabled = !hasUsername;
});

pairCodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
    if (e.target.value.length > 6) {
        e.target.value = e.target.value.slice(0, 6);
    }
}); 