export class SeanceDetailsModal {
    constructor() {
        this.modal = null;
    }

    async render(seanceId) {
        try {
            const seance = await app.seanceService.getSeanceById(seanceId);
            const absences = seance.absences || [];

            const modalHtml = `
                <div id="seanceDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div class="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full mx-4">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-semibold">Détails de la séance</h2>
                            <button id="closeDetailsModal" class="text-gray-600 hover:text-gray-800">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Informations de la séance -->
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h3 class="text-lg font-medium mb-4">Informations de la séance</h3>
                                <div class="space-y-2">
                                    <p><span class="font-medium">Cours:</span> ${seance.cours?.libelle || 'Non défini'}</p>
                                    <p><span class="font-medium">Professeur:</span> ${seance.cours?.professeur ? `${seance.cours.professeur.nom} ${seance.cours.professeur.prenom}` : 'Non défini'}</p>
                                    <p><span class="font-medium">Date:</span> ${new Date(seance.date).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}</p>
                                    <p><span class="font-medium">Horaires:</span> ${seance.heureDebut} - ${seance.heureFin}</p>
                                    <p><span class="font-medium">Salle:</span> ${seance.salle || 'Non définie'}</p>
                                    <p><span class="font-medium">Statut:</span> 
                                        <span class="px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${this.getStatusColor(seance.statut)}">
                                            <span class="w-2 h-2 rounded-full ${this.getStatusDotColor(seance.statut)} mr-2"></span>
                                            ${this.formatStatus(seance.statut)}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <!-- Statistiques -->
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h3 class="text-lg font-medium mb-4">Statistiques de présence</h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-white p-3 rounded-lg text-center">
                                        <div class="text-2xl font-bold text-red-600">${absences.length}</div>
                                        <div class="text-sm text-gray-500">Absences</div>
                                    </div>
                                    <div class="bg-white p-3 rounded-lg text-center">
                                        <div class="text-2xl font-bold text-green-600">
                                            ${absences.filter(a => a.statut === 'justifié').length}
                                        </div>
                                        <div class="text-sm text-gray-500">Justifiées</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Liste des absences -->
                            <div class="md:col-span-2">
                                <h3 class="text-lg font-medium mb-4">Liste des absences</h3>
                                <div class="overflow-y-auto max-h-64">
                                    ${this.renderAbsences(absences)}
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button id="marquerAbsence" class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">
                                <i class="fas fa-user-times mr-2"></i>Marquer une absence
                            </button>
                            <button id="closeDetailsBtn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            this.modal = document.getElementById('seanceDetailsModal');
            this.setupEventListeners(seanceId);

        } catch (error) {
            console.error('Erreur lors du chargement des détails de la séance:', error);
            app.toast.show('Erreur lors du chargement des détails de la séance', 'error');
        }
    }

    renderAbsences(absences) {
        if (!absences || absences.length === 0) {
            return `
                <div class="text-center py-4 text-gray-500">
                    <i class="fas fa-check-circle text-4xl mb-2"></i>
                    <p>Aucune absence enregistrée</p>
                </div>
            `;
        }

        return `
            <div class="bg-white rounded-lg divide-y divide-gray-200">
                ${absences.map(absence => `
                    <div class="p-4 hover:bg-gray-50">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-medium text-gray-900">
                                    ${absence.etudiant?.nomComplet || 'Étudiant non défini'}
                                </div>
                                <div class="text-sm text-gray-500">
                                    Justification: ${absence.justification || 'Non justifiée'}
                                </div>
                            </div>
                            <span class="px-2 py-1 text-xs font-medium rounded-full ${
                                absence.statut === 'justifié' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }">
                                ${absence.statut === 'justifié' ? 'Justifiée' : 'Non justifiée'}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getStatusColor(statut) {
        switch (statut) {
            case 'en_cours': return 'bg-green-100 text-green-800';
            case 'planifié': return 'bg-yellow-100 text-yellow-800';
            case 'terminé': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    getStatusDotColor(statut) {
        switch (statut) {
            case 'en_cours': return 'bg-green-400';
            case 'planifié': return 'bg-yellow-400';
            case 'terminé': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    }

    formatStatus(statut) {
        switch (statut) {
            case 'en_cours': return 'En cours';
            case 'planifié': return 'Planifié';
            case 'terminé': return 'Terminé';
            default: return statut || 'Non défini';
        }
    }

    setupEventListeners(seanceId) {
        const closeButtons = ['closeDetailsModal', 'closeDetailsBtn'];
        closeButtons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                    this.modal.remove();
                });
            }
        });

        const marquerAbsenceBtn = document.getElementById('marquerAbsence');
        if (marquerAbsenceBtn) {
            marquerAbsenceBtn.addEventListener('click', () => {
                this.modal.remove();
                app.openAbsenceModal(seanceId);
            });
        }
    }
} 