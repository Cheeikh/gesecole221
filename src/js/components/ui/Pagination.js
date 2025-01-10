export class Pagination {
    constructor(options = {}) {
        this.currentPage = options.currentPage || 1;
        this.totalPages = options.totalPages || 1;
        this.limit = options.limit || 5;
        this.total = options.total || 0;
        this.onPageChange = options.onPageChange || (() => {});
        this.onLimitChange = options.onLimitChange || (() => {});
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const paginationWrapper = document.createElement('div');
        paginationWrapper.className = 'flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-4 py-3 bg-white border-t border-gray-200';

        paginationWrapper.innerHTML = `
            <div class="flex flex-col sm:flex-row items-center gap-4 w-full justify-between">
                <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <!-- Sélecteur de nombre d'éléments par page -->
                    <div class="flex items-center space-x-2 text-sm text-gray-600 order-2 sm:order-1">
                        <span class="hidden sm:inline">Afficher</span>
                        <select 
                            class="pagination-limit px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                            data-action="changeLimit">
                            ${[5, 10, 15, 20].map(size => `
                                <option value="${size}" ${this.limit === size ? 'selected' : ''}>
                                    ${size}${window.innerWidth < 640 ? ' par page' : ''}
                                </option>
                            `).join('')}
                        </select>
                        <span class="hidden sm:inline">par page</span>
                    </div>

                    <!-- Information sur les éléments -->
                    <div class="text-sm text-gray-700 flex items-center gap-1 order-1 sm:order-2">
                        <span class="font-medium">${(this.currentPage - 1) * this.limit + 1}</span>
                        <span>-</span>
                        <span class="font-medium">${Math.min(this.currentPage * this.limit, this.total)}</span>
                        <span>sur</span>
                        <span class="font-medium">${this.total}</span>
                    </div>
                </div>

                <!-- Boutons de navigation -->
                <div class="inline-flex rounded-md shadow-sm order-3">
                    <button 
                        data-action="previousPage"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                            this.currentPage <= 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-300'
                        }"
                        ${this.currentPage <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left text-sm"></i>
                    </button>
                    <span class="relative inline-flex items-center px-4 py-2 border-t border-b bg-white text-sm font-medium text-gray-700">
                        ${window.innerWidth < 640 ? this.currentPage : `Page ${this.currentPage} sur ${this.totalPages}`}
                    </span>
                    <button 
                        data-action="nextPage"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                            this.currentPage >= this.totalPages 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-300'
                        }"
                        ${this.currentPage >= this.totalPages ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right text-sm"></i>
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = '';
        container.appendChild(paginationWrapper);
        this.attachEventListeners(container);
    }

    attachEventListeners(container) {
        // Gestion du changement de limite
        const limitSelect = container.querySelector('[data-action="changeLimit"]');
        if (limitSelect) {
            limitSelect.addEventListener('change', (e) => {
                const newLimit = parseInt(e.target.value);
                this.limit = newLimit;
                this.onLimitChange(newLimit);
            });
        }

        // Gestion de la navigation
        const previousButton = container.querySelector('[data-action="previousPage"]');
        const nextButton = container.querySelector('[data-action="nextPage"]');

        if (previousButton) {
            previousButton.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.onPageChange(this.currentPage);
                }
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.onPageChange(this.currentPage);
                }
            });
        }
    }

    update(options = {}) {
        this.currentPage = options.currentPage || this.currentPage;
        this.totalPages = options.totalPages || this.totalPages;
        this.limit = options.limit || this.limit;
        this.total = options.total || this.total;
    }
} 