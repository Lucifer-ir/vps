// Authentication Module
class AuthModule {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.init();
    }

    init() {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Check if logged in
        if (!this.isLoggedIn() && !window.location.pathname.includes('login')) {
            window.location.href = '/login';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            this.showError('لطفاً نام کاربری و رمز عبور را وارد کنید');
            return;
        }

        try {
            const result = await api.loginAdmin(username, password);
            
            if (result.success && result.token) {
                api.setToken(result.token);
                window.location.href = '/admin';
            }
        } catch (error) {
            this.showError('نام کاربری یا رمز عبور نادرست است');
        }
    }

    isLoggedIn() {
        return !!localStorage.getItem('admin_token');
    }

    showError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }
}

const auth = new AuthModule();
