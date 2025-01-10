export class ProfesseurDetailsModal {
    constructor() {
        this.modal = null;
    }

    async render(professeurId) {
        try {
            const professeur = await app.professeurService.getProfesseurById(professeurId);
            const coursResponse = await app.coursService.getCours({ professeurId });
            const cours = coursResponse.cours || [];

            const modalHtml = `
                <div id="professeurDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start justify-center z-50">
                    <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-6 md:my-12 transform transition-all">
                        <!-- Barre de défilement personnalisée -->
                        <div class="max-h-[85vh] overflow-y-auto custom-scrollbar">
                            <!-- En-tête fixe -->
                            <div class="sticky top-0 bg-white px-8 py-6 border-b border-gray-200 rounded-t-lg">
                                <div class="flex justify-between items-start">
                                    <div class="flex items-center space-x-4">
                                        <div class="h-16 w-16 md:h-20 md:w-20 rounded-full bg-[#E67D23] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                                            <i class="fas fa-user-tie text-[#E67D23] text-2xl md:text-3xl"></i>
                                        </div>
                                        <div>
                                            <h2 class="text-xl md:text-2xl font-bold text-gray-900">${professeur.nom} ${professeur.prenom}</h2>
                                            <p class="text-gray-600">${professeur.grade || 'Grade non défini'}</p>
                                        </div>
                                    </div>
                                    <button id="closeDetailsModal" class="text-gray-500 hover:text-gray-700 transition-colors p-2">
                                        <i class="fas fa-times text-xl"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Contenu scrollable -->
                            <div class="px-8 py-6">
                                <!-- Contenu principal -->
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <!-- Informations de contact -->
                                    <div class="col-span-1 bg-gray-50 rounded-lg p-6">
                                        <h3 class="text-lg font-semibold mb-4 flex items-center">
                                            <i class="fas fa-address-card text-[#E67D23] mr-2"></i>
                                            Informations de contact
                                        </h3>
                                        <div class="space-y-3">
                                            <div class="flex items-center text-gray-600">
                                                <i class="fas fa-envelope w-6 text-[#E67D23]"></i>
                                                <span class="ml-2">${professeur.email || 'Non défini'}</span>
                                            </div>
                                            <div class="flex items-center text-gray-600">
                                                <i class="fas fa-phone w-6 text-[#E67D23]"></i>
                                                <span class="ml-2">${professeur.telephone || 'Non défini'}</span>
                                            </div>
                                            <div class="flex items-center text-gray-600">
                                                <i class="fas fa-graduation-cap w-6 text-[#E67D23]"></i>
                                                <span class="ml-2">${professeur.specialite || 'Non définie'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Liste des cours -->
                                    <div class="col-span-2 bg-gray-50 rounded-lg p-6">
                                        <h3 class="text-lg font-semibold mb-4 flex items-center">
                                            <i class="fas fa-book text-[#E67D23] mr-2"></i>
                                            Cours enseignés
                                        </h3>
                                        ${cours.length > 0 ? `
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                ${cours.map(cours => `
                                                    <div class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                                        <div class="flex items-center justify-between">
                                                            <div class="flex-1">
                                                                <h4 class="font-medium text-gray-900">${cours.libelle}</h4>
                                                                <p class="text-sm text-gray-500 mt-1">
                                                                    ${cours.heuresTotal}h - Coefficient ${cours.coefficient}
                                                                </p>
                                                            </div>
                                                            <span class="px-3 py-1 text-xs font-medium rounded-full ${this.getStatusColor(cours.statut)}">
                                                                ${this.formatStatus(cours.statut)}
                                                            </span>
                                                        </div>
                                                        <div class="mt-3 text-sm text-gray-600">
                                                            <div class="flex items-center">
                                                                <i class="fas fa-calendar-alt w-5 text-[#E67D23]"></i>
                                                                <span class="ml-2">${new Date(cours.dateCours).toLocaleDateString('fr-FR', {
                                                                    weekday: 'long',
                                                                    day: 'numeric',
                                                                    month: 'long'
                                                                })}</span>
                                                            </div>
                                                            <div class="flex items-center mt-1">
                                                                <i class="fas fa-clock w-5 text-[#E67D23]"></i>
                                                                <span class="ml-2">${cours.heureDebut} - ${cours.heureFin}</span>
                                                            </div>
                                                            <div class="flex items-center mt-1">
                                                                <i class="fas fa-door-open w-5 text-[#E67D23]"></i>
                                                                <span class="ml-2">${cours.salle}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        ` : `
                                            <div class="text-center py-8 bg-white rounded-lg">
                                                <i class="fas fa-book-open text-gray-400 text-4xl mb-3"></i>
                                                <p class="text-gray-500">Aucun cours assigné à ce professeur</p>
                                            </div>
                                        `}
                                    </div>
                                </div>

                                <!-- Footer avec statistiques -->
                                <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                                        <div class="text-2xl font-bold text-[#E67D23]">${cours.length}</div>
                                        <div class="text-sm text-gray-600">Cours</div>
                                    </div>
                                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                                        <div class="text-2xl font-bold text-[#E67D23]">
                                            ${cours.reduce((acc, curr) => acc + (curr.heuresTotal || 0), 0)}
                                        </div>
                                        <div class="text-sm text-gray-600">Heures totales</div>
                                    </div>
                                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                                        <div class="text-2xl font-bold text-[#E67D23]">
                                            ${cours.filter(c => c.statut === 'en_cours').length}
                                        </div>
                                        <div class="text-sm text-gray-600">Cours en cours</div>
                                    </div>
                                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                                        <div class="text-2xl font-bold text-[#E67D23]">
                                            ${cours.filter(c => c.statut === 'planifié').length}
                                        </div>
                                        <div class="text-sm text-gray-600">Cours planifiés</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            this.modal = document.getElementById('professeurDetailsModal');
            this.setupEventListeners();

            // Empêcher le défilement du body quand le modal est ouvert
            document.body.style.overflow = 'hidden';

        } catch (error) {
            console.error('Erreur lors du chargement des détails:', error);
            app.toast.show('Erreur lors du chargement des détails', 'error');
        }
    }

    setupEventListeners() {
        const closeBtn = document.getElementById('closeDetailsModal');
        closeBtn.addEventListener('click', () => this.close());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Ajouter un gestionnaire pour la touche Echap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal) {
                this.close();
            }
        });
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

    close() {
        if (this.modal) {
            // Restaurer le défilement du body
            document.body.style.overflow = 'auto';
            this.modal.remove();
            this.modal = null;
        }
    }
} 