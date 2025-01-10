export class Sidebar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentPage = 'dashboard';
        this.menuItems = [
            { id: 'dashboard', text: 'Dashboard', icon: 'home' },
            { id: 'cours', text: 'Gestion des Cours', icon: 'graduation-cap' },
            { id: 'classes', text: 'Gestion des Classes', icon: 'school' },
            { id: 'seances', text: 'Gestion Séances', icon: 'clock' },
            { id: 'professeurs', text: 'Gestion Professeurs', icon: 'chalkboard-teacher' },
            { id: 'etudiants', text: 'Gestion Étudiants', icon: 'user-graduate' },
            { id: 'absences', text: 'Gestion Présences', icon: 'calendar-check' }
        ];
        this.isMobile = window.innerWidth < 768;
        this.isExpanded = window.innerWidth >= 768;
    }

    render() {
        const baseClasses = `
            fixed md:static left-0 top-0 h-screen bg-white shadow-lg z-50
            w-64 transition-transform duration-300
        `;

        const transformClass = this.isMobile ? '-translate-x-full' : '';

        this.container.className = `${baseClasses} ${transformClass}`;

        this.container.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-8">
                        <img src="src/assets/images/logo.png" alt="Sonatel Academy" class="h-16 md:h-24">
                        <button id="closeSidebar" class="md:hidden text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <nav class="space-y-2">
                        ${this.menuItems.map(item => this.renderMenuItem(item)).join('')}
                    </nav>
                </div>
            </div>
        `;

        if (!this.miniSidebar) {
            this.miniSidebar = document.createElement('div');
            this.miniSidebar.id = 'miniSidebar';
            this.miniSidebar.className = `
                fixed left-0 top-0 w-16 bg-white shadow-lg h-screen 
                hidden md:flex flex-col items-center py-6 
                transition-transform duration-300 translate-x-[-100%] z-20
            `;
            this.miniSidebar.innerHTML = `
                <div class="mb-8 flex justify-center items-center">
                    <img src="src/assets/images/logo.png" alt="Sonatel Academy" class="w-10 h-10 object-contain">
                </div>
                <nav class="space-y-1 w-full px-2">
                    ${this.menuItems.map(item => this.renderMiniMenuItem(item)).join('')}
                </nav>
            `;
            document.body.appendChild(this.miniSidebar);
        } else {
            const miniNav = this.miniSidebar.querySelector('nav');
            if (miniNav) {
                miniNav.innerHTML = this.menuItems.map(item => this.renderMiniMenuItem(item)).join('');
            }
        }
        
        this.setupEventListeners();
    }

    renderMenuItem(item) {
        const isActive = this.currentPage === item.id;
        const baseClasses = "flex items-center p-3 rounded-lg transition-colors cursor-pointer";
        const activeClasses = isActive 
            ? "bg-[#E67D23] text-white" 
            : "bg-[#C9151B] text-white hover:bg-[#E67D23]";
        
        return `
            <div class="${baseClasses} ${activeClasses}" data-page="${item.id}">
                <i class="fas fa-${item.icon} w-6"></i>
                <span class="ml-3">${item.text}</span>
            </div>
        `;
    }

    renderMiniMenuItem(item) {
        const isActive = this.currentPage === item.id;
        const baseClasses = "flex items-center justify-center p-3 rounded-lg relative group transition-all duration-200";
        const activeClasses = isActive 
            ? "bg-[#E67D23] text-white shadow-lg" 
            : "text-[#C9151B] hover:bg-[#C9151B] hover:text-white";
        
        return `
            <div class="${baseClasses} ${activeClasses}" data-mini-page="${item.id}">
                <i class="fas fa-${item.icon} text-lg"></i>
                <div class="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md 
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                    transition-all duration-200 transform translate-x-[-10px] 
                    group-hover:translate-x-0 whitespace-nowrap z-50 shadow-lg">
                    ${item.text}
                    <div class="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 
                        border-8 border-transparent border-r-gray-800"></div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const closeBtn = document.getElementById('closeSidebar');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.container.classList.add('-translate-x-full');
                const overlay = document.getElementById('sidebarOverlay');
                if (overlay) {
                    overlay.remove();
                }
            });
        }

        this.menuItems.forEach(item => {
            const element = this.container.querySelector(`[data-page="${item.id}"]`);
            if (element) {
                element.addEventListener('click', () => {
                    this.setActivePage(item.id, false);
                });
            }
        });

        if (this.miniSidebar) {
            this.menuItems.forEach(item => {
                const element = this.miniSidebar.querySelector(`[data-mini-page="${item.id}"]`);
                if (element) {
                    element.addEventListener('click', () => {
                        this.setActivePage(item.id, true);
                    });
                }
            });
        }

        window.addEventListener('resize', () => {
            const wasDesktop = !this.isMobile;
            this.isMobile = window.innerWidth < 768;
            
            if (!wasDesktop && !this.isMobile) {
                this.isExpanded = true;
            }
            
            this.render();
        });
    }

    setActivePage(pageId, fromMiniSidebar = false) {
        if (this.currentPage === pageId) return;
        
        this.currentPage = pageId;
        
        if (!fromMiniSidebar || this.isMobile) {
            this.render();
        }
        
        if (this.miniSidebar) {
            const allMiniItems = this.miniSidebar.querySelectorAll('[data-mini-page]');
            allMiniItems.forEach(item => {
                const itemId = item.getAttribute('data-mini-page');
                if (itemId === pageId) {
                    item.classList.remove('text-[#C9151B]', 'hover:bg-[#C9151B]');
                    item.classList.add('bg-[#E67D23]', 'text-white', 'shadow-lg');
                } else {
                    item.classList.remove('bg-[#E67D23]', 'text-white', 'shadow-lg');
                    item.classList.add('text-[#C9151B]', 'hover:bg-[#C9151B]');
                }
            });
        }
        
        if (this.onPageChangeCallback) {
            this.onPageChangeCallback(pageId);
        }
        
        if (this.isMobile) {
            this.container.classList.add('-translate-x-full');
            const overlay = document.getElementById('sidebarOverlay');
            if (overlay) {
                overlay.remove();
            }
        }
    }

    onPageChange(callback) {
        this.onPageChangeCallback = callback;
    }

    toggleSidebar(isOpen) {
        this.isExpanded = isOpen;
        if (window.innerWidth >= 768) {
            if (isOpen) {
                this.container.classList.remove('w-0', 'overflow-hidden');
                this.container.classList.add('w-64');
                this.miniSidebar.classList.add('translate-x-[-100%]');
            } else {
                this.container.classList.remove('w-64');
                this.container.classList.add('w-0', 'overflow-hidden');
                this.miniSidebar.classList.remove('translate-x-[-100%]');
            }
        }
    }
} 