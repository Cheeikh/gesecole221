import { AuthService } from './services/AuthService.js';
import { ToastManager } from './utils/ToastManager.js';

class LoginPage {
    constructor() {
        this.authService = new AuthService();
        this.toast = new ToastManager();
        this.form = document.getElementById('loginForm');
        this.setupEventListeners();
        this.checkAuthentication();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(e);
        });
    }

    async handleLogin(e) {
        try {
            const formData = new FormData(e.target);
            const credentials = {
                email: formData.get('email'),
                password: formData.get('password'),
                remember: formData.get('remember-me') === 'on'
            };

            await this.authService.login(credentials);
            this.toast.show('Connexion réussie', 'success');
            window.location.href = '/index.html';
        } catch (error) {
            console.error('Erreur de connexion:', error);
            this.toast.show('Identifiants invalides', 'error');
        }
    }

    checkAuthentication() {
        if (this.authService.isAuthenticated()) {
            window.location.href = '/index.html';
        }
    }
}

// Initialiser la page de connexion
const loginPage = new LoginPage(); 