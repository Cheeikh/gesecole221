import { Pagination } from '../components/ui/Pagination.js';

export class SeanceTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentPage = 1;
        this.limit = 5;
        this.tableHeight = 'calc(100vh - 350px)';
        
        // Initialiser la pagination
        this.pagination = new Pagination({
            currentPage: this.currentPage,
            limit: this.limit,
            onPageChange: (page) => this.changePage(page),
            onLimitChange: (limit) => this.changePageSize(limit)
        });
    }

    async render(params = {}) {
        if (!this.container) return;

        // Nettoyer les éléments précédents
        this.cleanupPreviousElements();

        const { seances, total, currentPage, totalPages } = await app.seanceService.getSeances({
            page: this.currentPage,
            limit: this.limit,
            ...params
        });

        // Mettre à jour la pagination
        this.pagination.update({
            currentPage,
            totalPages,
            total,
            limit: this.limit
        });

        // Ajouter une div avec hauteur fixe et scroll
        const tableWrapper = this.container.closest('.overflow-x-auto');
        if (tableWrapper) {
            tableWrapper.style.height = this.tableHeight;
            tableWrapper.style.overflowY = 'auto';
        }

        if (!seances || seances.length === 0) {
            this.container.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-8">
                        <div class="flex flex-col items-center justify-center text-gray-500">
                            <i class="fas fa-calendar-times text-5xl mb-4"></i>
                            <p class="text-lg font-medium">Aucune séance trouvée</p>
                            <p class="text-sm mt-1">Ajoutez une nouvelle séance pour commencer</p>
                        </div>
                    </td>
                </tr>
            `;
            this.pagination.render('pagination-container');
            return;
        }

        this.container.innerHTML = seances.map(seance => `
            <tr class="hover:bg-gray-50 cursor-pointer transition-colors duration-150 block md:table-row border-b md:border-none"
                onclick="app.viewSeanceDetails(${seance.id})">
                <td class="px-4 py-3 md:px-6 md:py-4 block md:table-cell">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-[#E67D23] bg-opacity-10 rounded-lg flex items-center justify-center">
                            <i class="fas fa-chalkboard-teacher text-[#E67D23]"></i>
                        </div>
                        <div class="ml-4 flex-grow">
                            <div class="text-sm font-medium text-gray-900">
                                ${seance.cours?.libelle || 'Non défini'}
                            </div>
                            <div class="text-xs text-gray-500">
                                Salle: ${seance.salle || 'Non définie'}
                            </div>
                        </div>
                    </div>
                </td>
                
                <td class="px-4 py-2 md:px-6 md:py-4 block md:table-cell">
                    <div class="md:hidden text-xs font-medium text-gray-500 uppercase mb-1">Professeur</div>
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <i class="fas fa-user-tie text-gray-500"></i>
                        </div>
                        <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">
                                ${seance.cours?.professeur ? `${seance.cours.professeur.nom} ${seance.cours.professeur.prenom}` : 'Non défini'}
                            </div>
                        </div>
                    </div>
                </td>
                
                <td class="px-4 py-2 md:px-6 md:py-4 block md:table-cell">
                    <div class="md:hidden text-xs font-medium text-gray-500 uppercase mb-1">Date</div>
                    <div class="text-sm text-gray-900">
                        ${seance.date ? new Date(seance.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                        }) : 'Non défini'}
                    </div>
                    <div class="text-xs text-gray-500">
                        ${seance.heureDebut || ''} - ${seance.heureFin || ''}
                    </div>
                </td>
                
                <td class="px-4 py-2 md:px-6 md:py-4 block md:table-cell">
                    <div class="md:hidden text-xs font-medium text-gray-500 uppercase mb-1">Statut</div>
                    <span class="px-3 py-1 text-xs font-medium rounded-full inline-flex items-center
                        ${this.getStatusColor(seance.statut)}">
                        <span class="w-2 h-2 rounded-full ${this.getStatusDotColor(seance.statut)} mr-2"></span>
                        ${this.formatStatus(seance.statut)}
                    </span>
                </td>
                
                <td class="px-4 py-2 md:px-6 md:py-4 block md:table-cell">
                    <div class="flex items-center justify-end space-x-3">
                        <button 
                            type="button"
                            onclick="event.stopPropagation(); app.editSeance(${seance.id})" 
                            class="text-blue-600 hover:text-blue-900 transition-colors duration-150">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button 
                            type="button"
                            onclick="event.stopPropagation(); app.deleteSeance(${seance.id})" 
                            class="text-red-600 hover:text-red-900 transition-colors duration-150">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Rendre la pagination dans son conteneur dédié
        this.pagination.render('pagination-container');
    }

    cleanupPreviousElements() {
        const existingPagination = this.container.parentNode.querySelector('.pagination-container');
        if (existingPagination) existingPagination.remove();
    }

    getStatusColor(statut) {
        switch (statut) {
            case 'en_cours':
                return 'bg-green-100 text-green-800';
            case 'planifié':
                return 'bg-yellow-100 text-yellow-800';
            case 'terminé':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    getStatusDotColor(statut) {
        switch (statut) {
            case 'en_cours':
                return 'bg-green-400';
            case 'planifié':
                return 'bg-yellow-400';
            case 'terminé':
                return 'bg-gray-400';
            default:
                return 'bg-gray-400';
        }
    }

    formatStatus(statut) {
        switch (statut) {
            case 'en_cours':
                return 'En cours';
            case 'planifié':
                return 'Planifié';
            case 'terminé':
                return 'Terminé';
            default:
                return statut || 'Non défini';
        }
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