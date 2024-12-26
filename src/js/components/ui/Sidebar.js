export class Sidebar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentPage = 'dashboard';
        this.menuItems = [
            { id: 'dashboard', text: 'Dashboard', icon: 'home' },
            { id: 'cours', text: 'Gestion des Cours', icon: 'graduation-cap' },
            { id: 'seances', text: 'Gestion Séances', icon: 'clock' },
            { id: 'professeurs', text: 'Gestion Professeurs', icon: 'chalkboard-teacher' },
            { id: 'etudiants', text: 'Gestion Étudiants', icon: 'user-graduate' },
            { id: 'absences', text: 'Gestion Présences', icon: 'calendar-check' }
        ];
    }

    render() {
        this.container.innerHTML = `
            <div class="  p-6 h-full">
                <div class="flex justify-center items-center mb-8">
                    <img src="src/assets/images/logo.png" alt="Sonatel Academy" class="h-24">
                    <button id="closeSidebar" class="md:hidden text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <nav class="space-y-2">
                    ${this.menuItems.map(item => this.renderMenuItem(item)).join('')}
                </nav>
            </div>
        `;
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

    setupEventListeners() {
        const closeBtn = document.getElementById('closeSidebar');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.container.classList.add('-translate-x-full');
            });
        }

        this.menuItems.forEach(item => {
            const element = this.container.querySelector(`[data-page="${item.id}"]`);
            if (element) {
                element.addEventListener('click', () => {
                    this.setActivePage(item.id);
                });
            }
        });
    }

    setActivePage(pageId) {
        if (this.currentPage === pageId) return;
        
        this.currentPage = pageId;
        this.render();
        
        if (this.onPageChange) {
            this.onPageChange(pageId);
        }
        
        if (window.innerWidth < 768) {
            this.container.classList.add('-translate-x-full');
        }
    }

    onPageChange(callback) {
        this.onPageChange = callback;
    }
} 