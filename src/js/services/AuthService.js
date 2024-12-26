import { dataProvider } from '../providers/DataProvider.js';

export class AuthService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user'));
    }

    async login(credentials) {
        try {
            // Récupérer l'utilisateur par email et mot de passe
            const users = await fetch(`http://localhost:3000/api/users?email=${credentials.email}`);
            const userData = await users.json();

            if (!userData || userData.length === 0 || userData[0].password !== credentials.password) {
                throw new Error('Identifiants invalides');
            }

            const user = userData[0];
            
            // Simuler un token JWT (dans un vrai projet, ceci serait géré côté serveur)
            const token = btoa(JSON.stringify({
                id: user.id,
                email: user.email,
                roles: user.roles,
                exp: Date.now() + (24 * 60 * 60 * 1000) // Expire dans 24h
            }));

            // Nettoyer les données sensibles avant de stocker
            delete user.password;

            const authData = {
                token,
                user
            };

            this.setSession(authData);
            return authData;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    }

    setSession(authData) {
        if (authData.token) {
            localStorage.setItem('token', authData.token);
            localStorage.setItem('user', JSON.stringify(authData.user));
            this.token = authData.token;
            this.user = authData.user;
            dataProvider.setAuthToken(authData.token);
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.token = null;
        this.user = null;
        dataProvider.setAuthToken(null);
        window.location.href = '/login.html';
    }

    isAuthenticated() {
        if (!this.token) return false;

        try {
            const tokenData = JSON.parse(atob(this.token));
            return tokenData.exp > Date.now();
        } catch {
            return false;
        }
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return this.token;
    }

    hasRole(role) {
        return this.user?.roles?.includes(role);
    }

    // Nouvelle méthode pour vérifier les permissions
    hasPermission(permission) {
        const rolePermissions = {
            admin: ['all'],
            professeur: ['view_cours', 'edit_cours', 'view_seances', 'edit_seances', 'view_absences'],
            etudiant: ['view_cours', 'view_seances', 'view_absences']
        };

        return this.user?.roles?.some(role => 
            rolePermissions[role]?.includes('all') || 
            rolePermissions[role]?.includes(permission)
        );
    }
} 