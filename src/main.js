import './assets/css/main.css';
import { App } from './js/app.js';

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Créer une instance globale de l'application
    window.app = new App();
    console.log('Application initialisée');
});
