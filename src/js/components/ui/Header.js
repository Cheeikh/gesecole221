export class Header {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentTitle = 'Tableau de bord';
    }

    

    renderPageSpecificControls() {
        if (this.getCurrentPage() === 'dashboard') {
            return `
                <div class="flex gap-2">
                    <button id="dailyBtn" class="btn-secondary">Jour</button>
                    <button id="weeklyBtn" class="btn-secondary">Semaine</button>
                    <button id="monthlyBtn" class="btn-secondary">Mois</button>
                </div>
            `;
        }
        return '';
    }

    getCurrentPage() {
        // Cette méthode devrait être mise à jour pour refléter la page actuelle
        // Pour l'instant, on utilise une valeur par défaut
        return this.currentPage || 'cours';
    }

    setTitle(title) {
        this.currentTitle = title;
        this.currentPage = this.getTitlePageId(title);
        this.render();
    }

    getTitlePageId(title) {
        const titleToPageId = {
            'Tableau de bord': 'dashboard',
            'Gestion des Cours': 'cours',
            'Gestion des Séances': 'seances',
            'Gestion des Professeurs': 'professeurs',
            'Gestion des Étudiants': 'etudiants',
            'Gestion des Présences': 'absences'
        };
        return titleToPageId[title] || 'cours';
    }

    setupEventListeners() {
        const openBtn = document.getElementById('openSidebar');
        const refreshBtn = document.getElementById('refreshBtn');
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        const downloadReportBtn = document.getElementById('downloadReportBtn');
        const dailyBtn = document.getElementById('dailyBtn');
        const weeklyBtn = document.getElementById('weeklyBtn');
        const monthlyBtn = document.getElementById('monthlyBtn');

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                document.getElementById('sidebar').classList.remove('-translate-x-full');
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.onRefresh && this.onRefresh();
            });
        }

        // Gestion des boutons spécifiques aux pages
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.onExport && this.onExport();
            });
        }

        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.onImport && this.onImport();
            });
        }

        if (downloadReportBtn) {
            downloadReportBtn.addEventListener('click', () => {
                this.onDownloadReport && this.onDownloadReport();
            });
        }

        if (dailyBtn) {
            dailyBtn.addEventListener('click', () => {
                this.onPeriodChange && this.onPeriodChange('daily');
            });
        }

        if (weeklyBtn) {
            weeklyBtn.addEventListener('click', () => {
                this.onPeriodChange && this.onPeriodChange('weekly');
            });
        }

        if (monthlyBtn) {
            monthlyBtn.addEventListener('click', () => {
                this.onPeriodChange && this.onPeriodChange('monthly');
            });
        }
    }

    onRefresh(callback) {
        this.onRefresh = callback;
    }

    onExport(callback) {
        this.onExport = callback;
    }

    onImport(callback) {
        this.onImport = callback;
    }

    onDownloadReport(callback) {
        this.onDownloadReport = callback;
    }

    onPeriodChange(callback) {
        this.onPeriodChange = callback;
    }
} 