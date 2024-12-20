export class TopBar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.callbacks = {};
        this.isSidebarOpen = true;
    }

    render() {
        this.container.innerHTML = `
            <div class="bg-white w-full px-4 py-2 flex justify-between items-center border-b">
                <!-- Menu Burger toujours visible -->
                <button id="menuBurger" class="text-gray-600 hover:text-gray-800 transition-colors">
                    <i class="fas fa-bars text-xl"></i>
                </button>

                <div class="flex items-center gap-4 flex-1 ml-4">
                    <!-- Barre de recherche -->
                    <div class="relative flex-1 max-w-md">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                            <i class="fas fa-search"></i>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            class="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:border-[#E67D23]"
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

                    <!-- Profil -->
                    <div class="flex items-center gap-3">
                        <div class="hidden md:flex flex-col">
                            <span class="text-sm font-medium">Admin User</span>
                            <span class="text-xs text-gray-500">Super Admin</span>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-[#C9151B] flex items-center justify-center text-white">
                            <i class="fas fa-user"></i>
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
} 