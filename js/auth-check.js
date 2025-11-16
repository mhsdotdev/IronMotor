// auth-check.js - Authentication check for all pages
function checkAuthentication() {
    const userData = localStorage.getItem('user');
    const currentPage = window.location.pathname;
    
    // If already on auth page, don't redirect
    if (currentPage.includes('auth.html')) {
        return;
    }
    
    // Check if user is properly logged in
    if (!userData) {
        // Store the current page to redirect back after login
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = 'auth.html';
        return;
    }
    
    const user = JSON.parse(userData);
    
    // Check if login session is valid (within 24 hours)
    if (!user.loggedIn || !user.loginTime || (Date.now() - user.loginTime) > (24 * 60 * 60 * 1000)) {
        // Session expired
        localStorage.removeItem('user');
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = 'auth.html';
        return;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
}

// Update user session time
function updateUserSession() {
    const userData = localStorage.getItem('user');
    if (userData) {
        const user = JSON.parse(userData);
        user.loginTime = Date.now();
        localStorage.setItem('user', JSON.stringify(user));
    }
}

// Run authentication check when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    updateUserSession(); // Update session time on each page load
});
