import { Pagination } from './ui/Pagination.js';

export class ProfesseurTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentPage = 1;
        this.limit = 5;
        this.tableHeight = 'calc(100vh - 350px)';
        
        this.pagination = new Pagination({
            currentPage: this.currentPage,
            limit: this.limit,
            onPageChange: (page) => this.changePage(page),
            onLimitChange: (limit) => this.changePageSize(limit)
        });
    }

    async render(params = {}) {
        if (!this.container) return;

        this.cleanupPreviousElements();

        const { professeurs, total, currentPage, totalPages } = await app.professeurService.getProfesseurs({
            page: this.currentPage,
            limit: this.limit,
            ...params
        });

        this.pagination.update({
            currentPage,
            totalPages,
            total,
            limit: this.limit
        });

        const tableWrapper = this.container.closest('.overflow-x-auto');
        if (tableWrapper) {
            tableWrapper.style.height = this.tableHeight;
            tableWrapper.style.overflowY = 'auto';
        }

        if (!professeurs || professeurs.length === 0) {
            this.container.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-8">
                        <div class="flex flex-col items-center justify-center text-gray-500">
                            <i class="fas fa-user-tie text-5xl mb-4"></i>
                            <p class="text-lg font-medium">Aucun professeur trouvé</p>
                            <p class="text-sm mt-1">Ajoutez un nouveau professeur pour commencer</p>
                        </div>
                    </td>
                </tr>
            `;
            this.pagination.render('pagination-container');
            return;
        }

        this.container.innerHTML = professeurs.map(professeur => `
            <tr class="hover:bg-gray-50 cursor-pointer transition-colors duration-150" 
                onclick="app.viewProfesseurDetails(${professeur.id})">
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <i class="fas fa-user-tie text-gray-500"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">
                                ${professeur.nom} ${professeur.prenom}
                            </div>
                            <div class="text-sm text-gray-500">
                                ${professeur.email || 'Email non défini'}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${professeur.specialite || 'Non définie'}</div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        ${professeur.grade || 'Non défini'}
                    </span>
                </td>
                <td class="px-6 py-4 text-right text-sm font-medium">
                    <button onclick="event.stopPropagation(); app.editProfesseur(${professeur.id})" 
                            class="text-indigo-600 hover:text-indigo-900 mr-3">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="event.stopPropagation(); app.deleteProfesseur(${professeur.id})" 
                            class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        this.pagination.render('pagination-container');
    }

    cleanupPreviousElements() {
        const existingPagination = this.container.parentNode.querySelector('.pagination-container');
        const existingSelector = this.container.parentNode.querySelector('.page-size-selector');
        
        if (existingPagination) existingPagination.remove();
        if (existingSelector) existingSelector.remove();
    }

    async changePage(page) {
        this.currentPage = page;
        await this.render();
    }

    async changePageSize(newSize) {
        this.limit = parseInt(newSize);
        this.currentPage = 1;
        await this.render();
    }
} 