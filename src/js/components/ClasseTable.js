import { Pagination } from './ui/Pagination.js';

export class ClasseTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentPage = 1;
        this.limit = 6;
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

        const { classes, total, currentPage, totalPages } = await app.classeService.getClasses({
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

        this.container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6';

        if (!classes || classes.length === 0) {
            this.container.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
                    <i class="fas fa-school text-5xl text-gray-400 mb-4"></i>
                    <p class="text-lg font-medium text-gray-900">Aucune classe trouvée</p>
                    <p class="text-sm text-gray-500 mt-1">Ajoutez une nouvelle classe pour commencer</p>
                </div>
            `;
            this.pagination.render('pagination-container');
            return;
        }

        this.container.innerHTML = classes.map(classe => `
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
                 onclick="app.viewClasseDetails(${classe.id})">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <div class="h-12 w-12 bg-[#E67D23] bg-opacity-10 rounded-lg flex items-center justify-center">
                                <i class="fas fa-school text-[#E67D23] text-xl"></i>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-900">${classe.nom}</h3>
                                <p class="text-sm text-gray-500">${classe.niveau || 'Niveau non défini'}</p>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="event.stopPropagation(); app.editClasse(${classe.id})" 
                                    class="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="event.stopPropagation(); app.deleteClasse(${classe.id})" 
                                    class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <p class="text-sm text-gray-600 line-clamp-2">${classe.description || 'Aucune description'}</p>
                    </div>
                    
                    <div class="mt-6 flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="flex -space-x-2">
                                ${Array(Math.min(3, classe.nbEtudiants)).fill(0).map(() => `
                                    <div class="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                        <i class="fas fa-user-graduate text-gray-500 text-xs"></i>
                                    </div>
                                `).join('')}
                            </div>
                            <p class="ml-4 text-sm text-gray-600">
                                <span class="font-medium">${classe.nbEtudiants}</span> étudiants
                            </p>
                        </div>
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Actif
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        this.pagination.render('pagination-container');
    }

    cleanupPreviousElements() {
        const existingPagination = this.container.parentNode.querySelector('.pagination-container');
        if (existingPagination) existingPagination.remove();
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