export class Filters {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.callbacks = {};
        this.currentPage = 'dashboard';
    }

    setCurrentPage(page) {
        this.currentPage = page;
        this.render();
    }

    render() {
        if (this.currentPage === 'dashboard') {
            this.container.innerHTML = '';
            return;
        }

        this.container.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1 flex flex-col md:flex-row gap-4">
                        ${this.renderPageSpecificFilters()}
                    </div>
                    ${this.renderPageSpecificButtons()}
                </div>
            </div>
        `;
        this.setupEventListeners();
    }

    renderPageSpecificFilters() {
        const commonSearchBar = `
            <div class="relative flex-1">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <i class="fas fa-search"></i>
                </span>
                <input type="text" 
                       id="filterSearchInput"
                       placeholder="Rechercher..." 
                       class="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:border-[#E67D23]">
            </div>
        `;

        const filters = {
            'cours': `
                ${commonSearchBar}
                <input type="date" 
                       id="dateFilter"
                       class="input-primary w-full md:w-auto">
                <select id="statusFilter" class="input-primary w-full md:w-auto">
                    <option value="">Tous les statuts</option>
                    <option value="planifié">Planifié</option>
                    <option value="en_cours">En cours</option>
                    <option value="terminé">Terminé</option>
                </select>
            `,
            'etudiants': `
                ${commonSearchBar}
                <select id="classeFilter" class="input-primary w-full md:w-auto">
                    <option value="">Toutes les classes</option>
                </select>
            `,
            'professeurs': `
                ${commonSearchBar}
                <select id="specialiteFilter" class="input-primary w-full md:w-auto">
                    <option value="">Toutes les spécialités</option>
                </select>
            `,
            'absences': `
                ${commonSearchBar}
                <input type="date" 
                       id="dateFilter"
                       class="input-primary w-full md:w-auto">
                <select id="justificationFilter" class="input-primary w-full md:w-auto">
                    <option value="">Tous les statuts</option>
                    <option value="justifié">Justifié</option>
                    <option value="non_justifié">Non justifié</option>
                </select>
            `
        };

        return filters[this.currentPage] || commonSearchBar;
    }

    renderPageSpecificButtons() {
        const buttons = {
            'cours': `
                <button id="addButton" class="btn-primary whitespace-nowrap">
                    <i class="fas fa-plus mr-2"></i>Ajouter un cours
                </button>
            `,
            'etudiants': `
                <div class="flex gap-2">
                    <button id="importButton" class="btn-secondary whitespace-nowrap">
                        <i class="fas fa-file-import mr-2"></i>Importer
                    </button>
                    <button id="addButton" class="btn-primary whitespace-nowrap">
                        <i class="fas fa-plus mr-2"></i>Ajouter
                    </button>
                </div>
            `,
            'professeurs': `
                <button id="addButton" class="btn-primary whitespace-nowrap">
                    <i class="fas fa-plus mr-2"></i>Ajouter
                </button>
            `,
            'absences': `
                <button id="downloadReportButton" class="btn-secondary whitespace-nowrap">
                    <i class="fas fa-download mr-2"></i>Rapport
                </button>
            `
        };

        return buttons[this.currentPage] || '';
    }

    setupEventListeners() {
        const searchInput = document.getElementById('filterSearchInput');
        const dateFilter = document.getElementById('dateFilter');
        const statusFilter = document.getElementById('statusFilter');
        const addButton = document.getElementById('addButton');

        searchInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const topBarSearch = document.querySelector('#topbar input[type="text"]');
            if (topBarSearch) {
                topBarSearch.value = value;
            }
            this.callbacks.onSearch && this.callbacks.onSearch(value);
        });

        dateFilter.addEventListener('change', (e) => {
            this.callbacks.onDateFilter && this.callbacks.onDateFilter(e.target.value);
        });

        statusFilter.addEventListener('change', (e) => {
            this.callbacks.onStatusFilter && this.callbacks.onStatusFilter(e.target.value);
        });

        addButton.addEventListener('click', () => {
            this.callbacks.onAdd && this.callbacks.onAdd();
        });
    }

    updateSearchValue(value) {
        const searchInput = document.getElementById('filterSearchInput');
        if (searchInput) {
            searchInput.value = value;
        }
    }

    on(event, callback) {
        this.callbacks[event] = callback;
    }
} 