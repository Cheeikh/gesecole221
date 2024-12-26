export class CoursDetailsModal {
    constructor() {
        this.modal = null;
    }

    async render(coursId) {
        try {
            const cours = await app.coursService.getCoursById(coursId);
            const seances = await app.seanceService.getSeancesByCours(coursId);

            const modalHtml = `
                <div id="coursDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div class="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full mx-4">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-semibold">${cours.libelle}</h2>
                            <button id="closeDetailsModal" class="text-gray-600 hover:text-gray-800">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Informations du cours -->
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h3 class="text-lg font-medium mb-4">Informations du cours</h3>
                                <div class="space-y-2">
                                    <p><span class="font-medium">Professeur:</span> ${cours.professeur?.nom} ${cours.professeur?.prenom}</p>
                                    <p><span class="font-medium">Spécialité:</span> ${cours.professeur?.specialite || 'Non définie'}</p>
                                    <p><span class="font-medium">Heures totales:</span> ${cours.heuresTotal}h</p>
                                    <p><span class="font-medium">Coefficient:</span> ${cours.coefficient}</p>
                                    <p><span class="font-medium">Description:</span> ${cours.description || 'Aucune description'}</p>
                                </div>
                            </div>

                            <!-- Statistiques -->
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h3 class="text-lg font-medium mb-4">Statistiques</h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-white p-3 rounded-lg text-center">
                                        <div class="text-2xl font-bold text-indigo-600">${seances.length}</div>
                                        <div class="text-sm text-gray-500">Séances planifiées</div>
                                    </div>
                                    <div class="bg-white p-3 rounded-lg text-center">
                                        <div class="text-2xl font-bold text-green-600">
                                            ${seances.filter(s => s.statut === 'terminé').length}
                                        </div>
                                        <div class="text-sm text-gray-500">Séances terminées</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Liste des séances -->
                            <div class="md:col-span-2">
                                <h3 class="text-lg font-medium mb-4">Séances</h3>
                                <div class="overflow-y-auto max-h-64">
                                    ${this.renderSeances(seances)}
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button id="planifierSeance" class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">
                                <i class="fas fa-plus mr-2"></i>Planifier une séance
                            </button>
                            <button id="closeDetailsBtn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            this.modal = document.getElementById('coursDetailsModal');
            this.setupEventListeners(coursId);

        } catch (error) {
            console.error('Erreur lors du chargement des détails du cours:', error);
            app.toast.show('Erreur lors du chargement des détails du cours', 'error');
        }
    }

    renderSeances(seances) {
        if (!seances || seances.length === 0) {
            return `
                <div class="text-center py-4 text-gray-500">
                    <i class="fas fa-calendar-times text-4xl mb-2"></i>
                    <p>Aucune séance planifiée</p>
                </div>
            `;
        }

        return `
            <div class="space-y-2">
                ${seances.map(seance => `
                    <div class="bg-white p-4 rounded-lg shadow border border-gray-100">
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-medium">
                                    ${new Date(seance.date).toLocaleDateString('fr-FR')}
                                </div>
                                <div class="text-sm text-gray-600">
                                    ${seance.heureDebut} - ${seance.heureFin}
                                </div>
                                <div class="text-sm text-gray-500">
                                    Salle: ${seance.salle || 'Non définie'}
                                </div>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getSeanceStatusColor(seance.statut)}">
                                    ${this.formatSeanceStatus(seance.statut)}
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getSeanceStatusColor(statut) {
        switch (statut) {
            case 'terminé':
                return 'bg-gray-100 text-gray-800';
            case 'en_cours':
                return 'bg-green-100 text-green-800';
            case 'planifié':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    formatSeanceStatus(statut) {
        switch (statut) {
            case 'terminé':
                return 'Terminée';
            case 'en_cours':
                return 'En cours';
            case 'planifié':
                return 'Planifiée';
            default:
                return statut || 'Non défini';
        }
    }

    setupEventListeners(coursId) {
        const closeBtn = document.getElementById('closeDetailsModal');
        const closeBtnAlt = document.getElementById('closeDetailsBtn');
        const planifierBtn = document.getElementById('planifierSeance');

        [closeBtn, closeBtnAlt].forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        planifierBtn.addEventListener('click', () => {
            this.close();
            app.planifierSeance(coursId);
        });
    }

    close() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
} 