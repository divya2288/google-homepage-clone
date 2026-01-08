// Search functionality
const searchInput = document.querySelector('.search-input');
const searchWrapper = document.querySelector('.search-wrapper');
const googleSearchBtn = document.querySelector('.buttons .btn:first-child');
const luckyBtn = document.querySelector('.buttons .btn:last-child');
const voiceIcon = document.querySelector('.voice-icon');
const lensIcon = document.querySelector('.lens-icon');

// Create suggestions dropdown
const suggestionsBox = document.createElement('div');
suggestionsBox.className = 'suggestions-dropdown';
document.querySelector('.search-box').appendChild(suggestionsBox);

// Sample suggestions database
const suggestionsData = {
    'g': ['google', 'gmail', 'github', 'google drive', 'google maps', 'google translate'],
    'f': ['facebook', 'firefox', 'free games', 'figma', 'flipkart', 'fonts'],
    'y': ['youtube', 'yahoo', 'youtube music', 'yoga', 'yellow pages'],
    'a': ['amazon', 'apple', 'amazon prime', 'adobe', 'anime', 'artificial intelligence'],
    'i': ['instagram', 'iphone', 'india', 'instagram login', 'imdb', 'internet speed test'],
    'w': ['weather', 'whatsapp', 'wikipedia', 'weather today', 'walmart', 'word to pdf'],
    'h': ['hotmail', 'how to', 'html', 'hindustan times', 'hotel booking', 'health'],
    'p': ['python', 'pinterest', 'pizza near me', 'pdf converter', 'paytm', 'photoshop'],
    'c': ['chatgpt', 'cricket', 'calendar', 'covid', 'chrome', 'calculator'],
    't': ['twitter', 'translate', 'temperature', 'time', 'tiktok', 'trains'],
    'n': ['netflix', 'news', 'nasa', 'nearby restaurants', 'naukri', 'nike'],
    's': ['speed test', 'spotify', 'stock market', 'shopping', 'samsung', 'snapchat'],
    'm': ['maps', 'mail', 'movies', 'music', 'meaning', 'mobile'],
    'r': ['reddit', 'restaurant near me', 'railway', 'recipes', 'resume', 'result'],
    'e': ['email', 'ebay', 'excel', 'education', 'entertainment', 'english to hindi'],
    'd': ['drive', 'dictionary', 'download', 'disney plus', 'doctor near me', 'date today'],
    'l': ['linkedin', 'language translator', 'laptop', 'live cricket score', 'login', 'location'],
    'b': ['bing', 'bank', 'booking', 'bitcoin', 'best mobile', 'browser'],
    'o': ['online shopping', 'outlook', 'ola', 'online games', 'office 365', 'ott'],
    'u': ['uber', 'upsc', 'university', 'udemy', 'url shortener', 'upi'],
    'v': ['visa', 'video editor', 'vaccine', 'vocabulary', 'vpn', 'video download'],
    'j': ['javascript', 'jobs', 'jio', 'java', 'jee', 'jquery'],
    'k': ['kfc', 'kohls', 'kindle', 'kitchen', 'korean drama', 'keyboard'],
    'q': ['quora', 'quiz', 'quotes', 'qr code generator', 'quick heal', 'qualcomm'],
    'z': ['zoom', 'zomato', 'zee5', 'zip code', 'zerodha', 'zodiac signs']
};

// Generate contextual suggestions based on input
function generateSuggestions(query) {
    const lowerQuery = query.toLowerCase();
    const firstChar = lowerQuery[0];
    let suggestions = [];
    
    if (suggestionsData[firstChar]) {
        suggestions = suggestionsData[firstChar].filter(item => 
            item.toLowerCase().startsWith(lowerQuery)
        );
    }
    
    const allSuggestions = Object.values(suggestionsData).flat();
    const moreSuggestions = allSuggestions.filter(item => 
        item.toLowerCase().includes(lowerQuery) && !suggestions.includes(item)
    );
    
    suggestions = [...suggestions, ...moreSuggestions].slice(0, 8);
    
    if (lowerQuery.length === 1) {
        suggestions.push(`${lowerQuery} in hindi`);
        suggestions.push(`${lowerQuery} meaning`);
    }
    
    if (lowerQuery.length > 2) {
        suggestions.push(`${query} meaning`);
        suggestions.push(`${query} near me`);
        suggestions.push(`how to ${query}`);
        suggestions.push(`what is ${query}`);
    }
    
    return suggestions.slice(0, 8);
}

// Show suggestions
function showSuggestions(query) {
    if (!query) {
        hideSuggestions();
        return;
    }
    
    const suggestions = generateSuggestions(query);
    
    if (suggestions.length === 0) {
        hideSuggestions();
        return;
    }
    
    suggestionsBox.innerHTML = '';
    
    suggestions.forEach((suggestion, index) => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        
        const matchIndex = suggestion.toLowerCase().indexOf(query.toLowerCase());
        const beforeMatch = suggestion.substring(0, matchIndex);
        const match = suggestion.substring(matchIndex, matchIndex + query.length);
        const afterMatch = suggestion.substring(matchIndex + query.length);
        
        suggestionItem.innerHTML = `
            <svg class="suggestion-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#9aa0a6" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
            <span class="suggestion-text">
                ${beforeMatch}<strong>${match}</strong>${afterMatch}
            </span>
        `;
        
        suggestionItem.addEventListener('click', () => {
            searchInput.value = suggestion;
            hideSuggestions();
            googleSearchBtn.click();
        });
        
        suggestionItem.addEventListener('mouseenter', () => {
            document.querySelectorAll('.suggestion-item').forEach(item => {
                item.classList.remove('active');
            });
            suggestionItem.classList.add('active');
        });
        
        suggestionsBox.appendChild(suggestionItem);
    });
    
    suggestionsBox.style.display = 'block';
}

// Hide suggestions
function hideSuggestions() {
    suggestionsBox.style.display = 'none';
}

// Search input events
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    showSuggestions(query);
});

// Keyboard navigation for suggestions
let selectedIndex = -1;

searchInput.addEventListener('keydown', (e) => {
    const suggestions = document.querySelectorAll('.suggestion-item');
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
        updateSelectedSuggestion(suggestions);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateSelectedSuggestion(suggestions);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            suggestions[selectedIndex].click();
        } else {
            googleSearchBtn.click();
        }
    } else if (e.key === 'Escape') {
        hideSuggestions();
        selectedIndex = -1;
    }
});

function updateSelectedSuggestion(suggestions) {
    suggestions.forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add('active');
            searchInput.value = item.querySelector('.suggestion-text').textContent;
        } else {
            item.classList.remove('active');
        }
    });
}

searchInput.addEventListener('focus', () => {
    searchWrapper.style.boxShadow = '0 1px 6px rgba(32, 33, 36, 0.28)';
    searchWrapper.style.borderColor = 'rgba(223, 225, 229, 0)';
    
    if (searchInput.value.trim()) {
        showSuggestions(searchInput.value.trim());
    }
});

searchInput.addEventListener('blur', () => {
    setTimeout(() => {
        hideSuggestions();
        if (!searchInput.value) {
            searchWrapper.style.boxShadow = 'none';
            searchWrapper.style.borderColor = '#dfe1e5';
        }
        selectedIndex = -1;
    }, 200);
});

// Google Search button
googleSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    
    if (query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        hideSuggestions();
    } else {
        searchWrapper.style.animation = 'shake 0.5s';
        setTimeout(() => {
            searchWrapper.style.animation = '';
        }, 500);
        searchInput.focus();
    }
});

// I'm Feeling Lucky button
luckyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    
    if (query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`, '_blank');
        hideSuggestions();
    } else {
        alert("Please enter a search query first!");
        searchInput.focus();
    }
});

// Voice search button
voiceIcon.addEventListener('click', () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.start();
        
        voiceIcon.style.opacity = '0.5';
        searchInput.placeholder = 'Listening...';
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            voiceIcon.style.opacity = '1';
            searchInput.placeholder = 'Search';
            showSuggestions(transcript);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            voiceIcon.style.opacity = '1';
            searchInput.placeholder = 'Search';
            alert('Voice search failed. Please try again or type your query.');
        };
        
        recognition.onend = () => {
            voiceIcon.style.opacity = '1';
            searchInput.placeholder = 'Search';
        };
    } else {
        alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
    }
});

// Google Lens button
lensIcon.addEventListener('click', () => {
    alert('Google Lens feature: Upload an image to search\n\n(This is a demo - real Google Lens requires Google\'s API)');
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            alert(`Image selected: ${file.name}\n\nIn a real implementation, this would search for similar images.`);
        }
    });
    
    fileInput.click();
});

// Apps icon menu
const appsIcon = document.querySelector('.apps-icon');
let appsMenuOpen = false;

appsIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (!appsMenuOpen) {
        showAppsMenu();
    } else {
        hideAppsMenu();
    }
});

function showAppsMenu() {
    let appsMenu = document.querySelector('.apps-menu-dropdown');
    
    if (!appsMenu) {
        appsMenu = document.createElement('div');
        appsMenu.className = 'apps-menu-dropdown';
        appsMenu.innerHTML = `
            <div class="apps-menu-grid">
                <a href="https://accounts.google.com" target="_blank" class="app-item">
                    <div class="app-icon" style="background: #4285f4;">📧</div>
                    <span>Account</span>
                </a>
                <a href="https://www.google.com/search" target="_blank" class="app-item">
                    <div class="app-icon" style="background: #ea4335;">🔍</div>
                    <span>Search</span>
                </a>
                <a href="https://maps.google.com" target="_blank" class="app-item">
                    <div class="app-icon" style="background: #34a853;">🗺️</div>
                    <span>Maps</span>
                </a>
                <a href="https://www.youtube.com" target="_blank" class="app-item">
                    <div class="app-icon" style="background: #ff0000;">▶️</div>
                    <span>YouTube</span>
                </a>
                <a href="https://play.google.com" target="_blank" class="app-item">
                    <div class="app-icon" style="background: #01875f;">▶</div>
                    <span>Play</span>
                </a>
                <a href="https://news.google.com" target="_blank" class="app-item">
                    <div class="app-icon" style="background: #1a73e8;">📰</div>
                    <span>News</span>
                </a>
                <a href="https://mail.google.com" target="_blank" class="app-item">
                    <div class="app-icon" style="background: #d93025;">✉️</div>
                    <span>Gmail</span>
                </a>
                <a href="https://drive.google.com" target="_blank" class="app-item">
                    <div class="app-icon" style="background: #fbbc04;">📁</div>
                    <span>Drive</span>
                </a>
                <a href="https://calendar.google.com" target="_blank" class="app-item">
                    <div class="app-icon" style="background: #1a73e8;">📅</div>
                    <span>Calendar</span>
                </a>
            </div>
        `;
        document.body.appendChild(appsMenu);
    }
    
    appsMenu.style.display = 'block';
    appsMenuOpen = true;
}

function hideAppsMenu() {
    const appsMenu = document.querySelector('.apps-menu-dropdown');
    if (appsMenu) {
        appsMenu.style.display = 'none';
    }
    appsMenuOpen = false;
}

document.addEventListener('click', (e) => {
    if (appsMenuOpen && !e.target.closest('.apps-icon')) {
        hideAppsMenu();
    }
});

// GMAIL AND IMAGES BUTTON FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            const text = link.textContent.trim().toLowerCase();
            if (text === 'gmail') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const user = localStorage.getItem('googleUser');
                    if (user) {
                        window.open('https://mail.google.com/mail/u/0/', '_blank');
                        showNotification('Opening Gmail...', 'success');
                    } else {
                        const shouldSignIn = confirm('Please sign in to access Gmail.\n\nWould you like to sign in now?');
                        if (shouldSignIn) {
                            showSignInModal();
                        }
                    }
                });
                console.log('Gmail button activated!');
            } else if (text === 'images') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open('https://www.google.com/imghp', '_blank');
                    showNotification('Opening Google Images...', 'success');
                });
                console.log('Images button activated!');
            }
        });
    }, 500);
});

// Sign in button functionality
const signInBtn = document.querySelector('.sign-in');

signInBtn.addEventListener('click', () => {
    const user = localStorage.getItem('googleUser');
    if (user) {
        const confirmLogout = confirm(`Sign out of ${user}?`);
        if (confirmLogout) {
            localStorage.removeItem('googleUser');
            signInBtn.textContent = 'Sign in';
            signInBtn.style.backgroundColor = '#1a73e8';
            signInBtn.style.color = '#fff';
            signInBtn.style.border = 'none';
            showNotification('Signed out successfully', 'success');
            location.reload();
        }
    } else {
        showSignInModal();
    }
});

function showSignInModal() {
    let modal = document.querySelector('.signin-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'signin-modal';
        modal.innerHTML = `
            <div class="signin-overlay"></div>
            <div class="signin-container">
                <div class="signin-header">
                    <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Google" class="signin-logo">
                    <button class="close-modal">&times;</button>
                </div>
                
                <h2 class="signin-title">Sign in</h2>
                <p class="signin-subtitle">Use your Google Account</p>
                
                <form class="signin-form" id="signinForm">
                    <div class="form-group">
                        <input type="email" id="signin-email" class="form-input" placeholder=" " required>
                        <label for="signin-email" class="form-label">Email or phone</label>
                        <span class="form-error" id="email-error"></span>
                    </div>
                    
                    <div class="form-actions">
                        <a href="#" class="forgot-email">Forgot email?</a>
                    </div>
                    
                    <p class="guest-mode">
                        Not your computer? Use Guest mode to sign in privately.
                        <a href="#">Learn more</a>
                    </p>
                    
                    <div class="form-buttons">
                        <button type="button" class="btn-secondary" id="createAccount">Create account</button>
                        <button type="submit" class="btn-primary">Next</button>
                    </div>
                </form>
                
                <div class="password-step" id="passwordStep" style="display: none;">
                    <div class="user-info">
                        <div class="user-avatar">
                            <svg viewBox="0 0 24 24" width="40" height="40">
                                <path fill="#5f6368" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
                            </svg>
                        </div>
                        <div class="user-email" id="displayEmail"></div>
                        <button class="change-account" id="changeAccount">Change account</button>
                    </div>
                    
                    <form class="password-form" id="passwordForm">
                        <div class="form-group">
                            <input type="password" id="signin-password" class="form-input" placeholder=" " required>
                            <label for="signin-password" class="form-label">Enter your password</label>
                            <span class="form-error" id="password-error"></span>
                        </div>
                        
                        <div class="form-checkbox">
                            <input type="checkbox" id="show-password">
                            <label for="show-password">Show password</label>
                        </div>
                        
                        <div class="form-buttons">
                            <a href="#" class="forgot-password-link">Forgot password?</a>
                            <button type="submit" class="btn-primary">Sign in</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        setupSignInModalEvents(modal);
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    document.getElementById('signinForm').style.display = 'block';
    document.getElementById('passwordStep').style.display = 'none';
    document.getElementById('signin-email').value = '';
}

function setupSignInModalEvents(modal) {
    const closeBtn = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.signin-overlay');
    const emailForm = modal.querySelector('#signinForm');
    const passwordForm = modal.querySelector('#passwordForm');
    const createAccountBtn = modal.querySelector('#createAccount');
    const changeAccountBtn = modal.querySelector('#changeAccount');
    const showPasswordCheckbox = modal.querySelector('#show-password');
    const passwordInput = modal.querySelector('#signin-password');
    const forgotEmailLink = modal.querySelector('.forgot-email');
    const forgotPasswordLink = modal.querySelector('.forgot-password-link');
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        emailForm.reset();
        passwordForm.reset();
        emailForm.style.display = 'block';
        document.getElementById('passwordStep').style.display = 'none';
    }
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value.trim();
        const emailError = document.getElementById('email-error');
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            emailError.textContent = 'Enter an email or phone number';
            document.getElementById('signin-email').classList.add('error');
            return;
        }
        
        if (!emailRegex.test(email) && !/^\d{10}$/.test(email)) {
            emailError.textContent = 'Enter a valid email or phone number';
            document.getElementById('signin-email').classList.add('error');
            return;
        }
        
        emailError.textContent = '';
        document.getElementById('signin-email').classList.remove('error');
        
        document.getElementById('displayEmail').textContent = email;
        emailForm.style.display = 'none';
        document.getElementById('passwordStep').style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('signin-password').focus();
        }, 100);
    });
    
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('displayEmail').textContent;
        const password = document.getElementById('signin-password').value;
        const passwordError = document.getElementById('password-error');
        
        if (!password) {
            passwordError.textContent = 'Enter a password';
            document.getElementById('signin-password').classList.add('error');
            return;
        }
        
        if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            document.getElementById('signin-password').classList.add('error');
            return;
        }
        
        passwordError.textContent = '';
        document.getElementById('signin-password').classList.remove('error');
        
        closeModal();
        
        const signInButton = document.querySelector('.sign-in');
        signInButton.textContent = email.split('@')[0];
        signInButton.style.backgroundColor = '#fff';
        signInButton.style.color = '#1a73e8';
        signInButton.style.border = '1px solid #dadce0';
        
        showNotification('Sign in successful!', 'success');
        
        localStorage.setItem('googleUser', email);
    });
    
    changeAccountBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('passwordStep').style.display = 'none';
        emailForm.style.display = 'block';
        document.getElementById('signin-email').value = '';
        document.getElementById('signin-email').focus();
    });
    
    showPasswordCheckbox.addEventListener('change', () => {
        passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
    });
    
    createAccountBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
        alert('Create Account\n\nThis would redirect to Google Account creation page.\n\nFor demo purposes, this is a simulation.');
    });
    
    forgotEmailLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Forgot email?\n\nYou would be redirected to account recovery.\n\nFor demo: Enter your recovery phone number or email.');
    });
    
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('displayEmail').textContent;
        alert(`Password recovery for ${email}\n\nYou would receive a password reset link via email.\n\nFor demo purposes, this is a simulation.`);
    });
    
    document.getElementById('signin-email').addEventListener('input', (e) => {
        document.getElementById('email-error').textContent = '';
        e.target.classList.remove('error');
    });
    
    document.getElementById('signin-password').addEventListener('input', (e) => {
        document.getElementById('password-error').textContent = '';
        e.target.classList.remove('error');
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Check if user is already logged in
window.addEventListener('load', () => {
    const user = localStorage.getItem('googleUser');
    if (user) {
        const signInButton = document.querySelector('.sign-in');
        const username = user.split('@')[0];
        signInButton.textContent = username;
        signInButton.style.backgroundColor = '#fff';
        signInButton.style.color = '#1a73e8';
        signInButton.style.border = '1px solid #dadce0';
    }
});

// Language links
const languageLinks = document.querySelectorAll('.language-section a');
languageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const language = e.target.textContent;
        alert(`Changing language to: ${language}\n\nThis would reload the page in the selected language.`);
    });
});

// Footer links
const footerLinks = document.querySelectorAll('footer a');
footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const linkText = e.target.textContent;
        alert(`Opening: ${linkText}\n\nThis would navigate to Google's ${linkText} page.`);
    });
});

// Add typing animation on load
window.addEventListener('load', () => {
    searchInput.placeholder = '';
    const text = 'Search';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            searchInput.placeholder += text.charAt(i);
            i++;
            setTimeout(typeWriter, 150);
        }
    }
    
    setTimeout(typeWriter, 500);
});

// Auto-focus search bar
window.addEventListener('load', () => {
    setTimeout(() => {
        searchInput.focus();
    }, 100);
});
// Profile Picture functionality
// Profile Picture functionality
const signInButton = document.getElementById('signInBtn');

function updateProfileUI() {
    const user = localStorage.getItem('googleUser');
    if (user) {
        const firstLetter = user.charAt(0).toUpperCase();
        const colors = [
            '#ea4335', '#4285f4', '#fbbc04', '#34a853', 
            '#ff6d00', '#46bdc6', '#7baaf7', '#f538a0'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        signInButton.classList.add('logged-in');
        signInButton.innerHTML = `
            <div class="profile-initial" style="background-color: ${randomColor};">
                ${firstLetter}
            </div>
        `;
    } else {
        signInButton.classList.remove('logged-in');
        signInButton.innerHTML = `
            <svg class="profile-icon" viewBox="0 0 24 24" width="32" height="32">
                <path fill="#5f6368" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
            </svg>
        `;
    }
}

// Update profile UI on load
updateProfileUI();

// Privacy Reminder (shows occasionally like real Google)
const privacyReminder = document.getElementById('privacyReminder');
const remindLaterBtn = document.querySelector('.remind-later');
const reviewNowBtn = document.querySelector('.review-now');
const privacyClose = document.querySelector('.privacy-close');

// Show privacy reminder randomly (30% chance)
function showPrivacyReminder() {
    const hasSeenReminder = localStorage.getItem('privacyReminderSeen');
    const randomChance = Math.random();
    
    if (!hasSeenReminder && randomChance < 0.3) {
        setTimeout(() => {
            privacyReminder.style.display = 'block';
        }, 3000);
    }
}

remindLaterBtn.addEventListener('click', () => {
    privacyReminder.style.display = 'none';
    localStorage.setItem('privacyReminderDismissed', Date.now());
});

reviewNowBtn.addEventListener('click', () => {
    privacyReminder.style.display = 'none';
    localStorage.setItem('privacyReminderSeen', 'true');
    window.open('https://policies.google.com/privacy', '_blank');
});

privacyClose.addEventListener('click', () => {
    privacyReminder.style.display = 'none';
});

// Show privacy reminder on load
showPrivacyReminder();

// More realistic search behavior
const searchInputElement = document.querySelector('.search-input');

searchInputElement.addEventListener('focus', function() {
    this.placeholder = '';
});

searchInputElement.addEventListener('blur', function() {
    if (!this.value) {
        this.placeholder = '';
    }
});

// Update sign-in modal to update profile picture after login
const originalPasswordFormSubmit = document.getElementById('passwordForm');
if (originalPasswordFormSubmit) {
    originalPasswordFormSubmit.addEventListener('submit', function() {
        setTimeout(updateProfileUI, 100);
    });
}

// Settings menu for profile icon
signInButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const user = localStorage.getItem('googleUser');
    
    if (user) {
        // Show account menu
        showAccountMenu();
    } else {
        // Show sign in modal
        showSignInModal();
    }
});

function showAccountMenu() {
    const existingMenu = document.querySelector('.account-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const user = localStorage.getItem('googleUser');
    const firstLetter = user.charAt(0).toUpperCase();
    const colors = [
        '#ea4335', '#4285f4', '#fbbc04', '#34a853', 
        '#ff6d00', '#46bdc6', '#7baaf7', '#f538a0'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const menu = document.createElement('div');
    menu.className = 'account-menu';
    menu.innerHTML = `
        <div class="account-menu-header">
            <div class="account-menu-avatar-initial" style="background-color: ${randomColor};">
                ${firstLetter}
            </div>
            <div class="account-menu-name">${user.split('@')[0]}</div>
            <div class="account-menu-email">${user}</div>
            <a href="#" class="manage-account">Manage your Google Account</a>
        </div>
        <div class="account-menu-divider"></div>
        <div class="account-menu-items">
            <a href="#" class="account-menu-item">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#5f6368" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
                </svg>
                Add another account
            </a>
            <a href="#" class="account-menu-item" id="signOutBtn">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#5f6368" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
                </svg>
                Sign out
            </a>
        </div>
        <div class="account-menu-divider"></div>
        <div class="account-menu-footer">
            <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a>
        </div>
    `;
    document.body.appendChild(menu);
    
    // Position menu
   const rect = signInButton.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = (rect.bottom + 10) + 'px';
    menu.style.right = '10px';
    
    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
    
    // Sign out functionality
    document.getElementById('signOutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('googleUser');
        updateProfileUI();
        menu.remove();
        showNotification('Signed out successfully', 'success');
    });
}
// ============================================
// DARK MODE FUNCTIONALITY
// ============================================

const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved dark mode preference
function initDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
    }
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Show notification
    showNotification(
        isDarkMode ? 'Dark mode enabled' : 'Light mode enabled',
        'success'
    );
});

// Initialize dark mode on page load
initDarkMode();

// Keyboard shortcut for dark mode (Ctrl+Shift+D)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        darkModeToggle.click();
    }
});

// ============================================
// SEARCH HISTORY FUNCTIONALITY
// ============================================

const searchHistoryPanel = document.getElementById('searchHistoryPanel');
const searchHistoryList = document.getElementById('searchHistoryList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Get search history from localStorage
function getSearchHistory() {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
}

// Save search history to localStorage
function saveSearchHistory(history) {
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

// Add search to history
function addToSearchHistory(query) {
    if (!query || query.trim() === '') return;
    
    let history = getSearchHistory();
    
    // Remove duplicate if exists
    history = history.filter(item => item.query !== query);
    
    // Add new search at the beginning
    history.unshift({
        query: query,
        timestamp: Date.now()
    });
    
    // Keep only last 20 searches
    history = history.slice(0, 20);
    
    saveSearchHistory(history);
    renderSearchHistory();
}

// Format timestamp to relative time
function getRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
}

// Render search history
function renderSearchHistory() {
    const history = getSearchHistory();
    
    if (history.length === 0) {
        searchHistoryList.innerHTML = `
            <div class="empty-history">
                <svg viewBox="0 0 24 24" width="48" height="48" style="opacity: 0.3; margin-bottom: 12px;">
                    <path fill="currentColor" d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path>
                </svg>
                <p>No search history yet</p>
            </div>
        `;
        return;
    }
    
    searchHistoryList.innerHTML = history.map(item => `
        <div class="search-history-item" data-query="${item.query}">
            <div class="search-history-content">
                <svg class="history-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#5f6368" d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path>
                </svg>
                <span class="history-text">${item.query}</span>
                <span class="history-time">${getRelativeTime(item.timestamp)}</span>
            </div>
            <button class="delete-history-item" data-query="${item.query}" title="Remove">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
            </button>
        </div>
    `).join('');
    
    // Add click event listeners
    document.querySelectorAll('.search-history-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-history-item')) {
                const query = item.dataset.query;
                searchInput.value = query;
                googleSearchBtn.click();
                searchHistoryPanel.classList.remove('show');
            }
        });
    });
    
    // Add delete event listeners
    document.querySelectorAll('.delete-history-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const query = btn.dataset.query;
            deleteHistoryItem(query);
        });
    });
}

// Delete single history item
function deleteHistoryItem(query) {
    let history = getSearchHistory();
    history = history.filter(item => item.query !== query);
    saveSearchHistory(history);
    renderSearchHistory();
    showNotification('Removed from history', 'success');
}

// Clear all history
clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Clear all search history?')) {
        localStorage.removeItem('searchHistory');
        renderSearchHistory();
        showNotification('Search history cleared', 'success');
    }
});

// Toggle search history panel
let historyPanelVisible = false;

function toggleSearchHistory() {
    historyPanelVisible = !historyPanelVisible;
    if (historyPanelVisible) {
        searchHistoryPanel.classList.add('show');
        renderSearchHistory();
    } else {
        searchHistoryPanel.classList.remove('show');
    }
}

// Show history when clicking on search input
searchInput.addEventListener('click', () => {
    if (!historyPanelVisible) {
        toggleSearchHistory();
    }
});

// Close history when clicking outside
document.addEventListener('click', (e) => {
    if (historyPanelVisible && 
        !searchHistoryPanel.contains(e.target) && 
        !searchInput.contains(e.target)) {
        searchHistoryPanel.classList.remove('show');
        historyPanelVisible = false;
    }
});

// Update the Google Search button to save history
const originalGoogleSearchClick = googleSearchBtn.onclick;
googleSearchBtn.addEventListener('click', (e) => {
    const query = searchInput.value.trim();
    if (query) {
        addToSearchHistory(query);
    }
});

// Also save history when pressing Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            addToSearchHistory(query);
        }
    }
});

// Initialize search history on page load
renderSearchHistory();

// Keyboard shortcut to toggle search history (Ctrl+H)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        toggleSearchHistory();
    }
});
