import { AuthService } from '../../services/AuthService.js';

export class TopBar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.callbacks = {};
        this.isSidebarOpen = true;
        this.isProfileDrawerOpen = false;
        this.authService = new AuthService();
        this.user = this.authService.getUser();
    }

    render() {
        this.container.innerHTML = `
            <div class="bg-white w-full px-4 py-2 flex justify-between items-center border-b">
                <!-- Menu Burger toujours visible -->
                <button id="menuBurger" class="text-gray-600 hover:text-gray-800 transition-colors">
                    <i class="fas fa-bars text-xl"></i>
                </button>

                <div class="flex items-center gap-4 flex-1 ml-4">
                    <!-- Barre de recherche améliorée -->
                    <div class="relative flex-1 max-w-md">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                            <i class="fas fa-search"></i>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            class="pl-10 pr-4 py-2.5 w-full border rounded-lg focus:outline-none focus:border-[#E67D23] focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-20 transition-all"
                        >
                    </div>
                </div>

                <!-- Date et profil -->
                <div class="flex items-center gap-6">
                    <!-- Date -->
                    <div class="hidden md:flex items-center gap-2">
                        <span class="text-gray-600">Année-scolaire:</span>
                        <span class="text-[#E67D23] font-medium">
                            ${new Date().toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>

                    <!-- Séparateur -->
                    <div class="hidden md:block h-8 w-px bg-gray-300"></div>

                    <!-- Profil avec hover effect -->
                    <div class="flex items-center gap-3">
                        <div class="hidden md:flex flex-col">
                            <span class="text-sm font-medium">${this.user?.name || 'Utilisateur'}</span>
                            <span class="text-xs text-gray-500">${this.user?.roles?.[0] || 'Rôle'}</span>
                        </div>
                        <button id="profileButton" class="w-10 h-10 rounded-full bg-[#C9151B] flex items-center justify-center text-white hover:bg-[#d41920] transition-colors cursor-pointer">
                            <i class="fas fa-user"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Profile Drawer -->
            <div id="profileDrawer" class="fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out z-50">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold">Profil</h3>
                        <button id="closeProfileDrawer" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="space-y-6">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 rounded-full bg-[#C9151B] flex items-center justify-center text-white">
                                <i class="fas fa-user text-2xl"></i>
                            </div>
                            <div>
                                <h4 class="font-medium">${this.user?.name || 'Utilisateur'}</h4>
                                <p class="text-sm text-gray-500">${this.user?.roles?.[0] || 'Rôle'}</p>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <button class="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors">
                                <i class="fas fa-user-circle"></i>
                                Mon Profil
                            </button>
                            <button class="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors">
                                <i class="fas fa-cog"></i>
                                Paramètres
                            </button>
                            <button id="logoutButton" class="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <i class="fas fa-sign-out-alt"></i>
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const searchInput = this.container.querySelector('input[type="text"]');
        const menuBurger = this.container.querySelector('#menuBurger');
        const sidebar = document.getElementById('sidebar');
        
        // Gestion du menu burger
        menuBurger.addEventListener('click', () => {
            this.isSidebarOpen = !this.isSidebarOpen;
            
            if (window.innerWidth >= 768) {
                // Sur desktop
                if (this.isSidebarOpen) {
                    sidebar.classList.remove('w-0', 'overflow-hidden');
                    sidebar.classList.add('w-64');
                } else {
                    sidebar.classList.remove('w-64');
                    sidebar.classList.add('w-0', 'overflow-hidden');
                }
            } else {
                // Sur mobile
                if (this.isSidebarOpen) {
                    sidebar.classList.remove('-translate-x-full');
                    this.addOverlay();
                } else {
                    sidebar.classList.add('-translate-x-full');
                    const overlay = document.getElementById('sidebarOverlay');
                    if (overlay) {
                        overlay.remove();
                    }
                }
            }
        });

        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                const overlay = document.getElementById('sidebarOverlay');
                if (overlay) {
                    overlay.remove();
                }
                // Rétablir l'état par défaut sur desktop
                if (this.isSidebarOpen) {
                    sidebar.classList.remove('w-0', 'overflow-hidden', '-translate-x-full');
                    sidebar.classList.add('w-64');
                }
            }
        });

        searchInput.addEventListener('input', (e) => {
            this.callbacks.onSearch && this.callbacks.onSearch(e.target.value);
        });

        // Ajout des nouveaux event listeners pour le drawer
        const profileButton = this.container.querySelector('#profileButton');
        const profileDrawer = this.container.querySelector('#profileDrawer');
        const closeProfileDrawer = this.container.querySelector('#closeProfileDrawer');

        profileButton.addEventListener('click', () => {
            this.toggleProfileDrawer();
        });

        closeProfileDrawer.addEventListener('click', () => {
            this.closeProfileDrawer();
        });

        // Fermer le drawer en cliquant en dehors
        document.addEventListener('click', (e) => {
            if (this.isProfileDrawerOpen && 
                !profileDrawer.contains(e.target) && 
                !profileButton.contains(e.target)) {
                this.closeProfileDrawer();
            }
        });

        const logoutButton = this.container.querySelector('#logoutButton');
        logoutButton.addEventListener('click', () => {
            this.handleLogout();
        });
    }

    addOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'sidebarOverlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            this.isSidebarOpen = false;
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.add('-translate-x-full');
            overlay.remove();
        });
    }

    onSearch(callback) {
        this.callbacks.onSearch = callback;
    }

    toggleProfileDrawer() {
        const profileDrawer = this.container.querySelector('#profileDrawer');
        this.isProfileDrawerOpen = !this.isProfileDrawerOpen;
        
        if (this.isProfileDrawerOpen) {
            profileDrawer.classList.remove('translate-x-full');
            this.addDrawerOverlay();
        } else {
            this.closeProfileDrawer();
        }
    }

    closeProfileDrawer() {
        const profileDrawer = this.container.querySelector('#profileDrawer');
        this.isProfileDrawerOpen = false;
        profileDrawer.classList.add('translate-x-full');
        
        const overlay = document.getElementById('drawerOverlay');
        if (overlay) {
            overlay.remove();
        }
    }

    addDrawerOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'drawerOverlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            this.closeProfileDrawer();
        });
    }

    handleLogout() {
        try {
            this.authService.logout();
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    }
} 