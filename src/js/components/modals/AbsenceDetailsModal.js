export class AbsenceDetailsModal {
    constructor() {
        this.modal = null;
    }

    async render(absenceId) {
        try {
            const absence = await app.absenceService.getAbsenceById(absenceId);

            const modalHtml = `
                <div id="absenceDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-semibold">Détails de l'absence</h2>
                            <button id="closeDetailsModal" class="text-gray-600 hover:text-gray-800">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <div class="space-y-6">
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h3 class="text-lg font-medium mb-4">Informations de l'absence</h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-600">Étudiant</p>
                                        <p class="font-medium">${absence.etudiant?.nomComplet || 'Non défini'}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-600">Date</p>
                                        <p class="font-medium">${new Date(absence.dateAbs).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-600">Cours</p>
                                        <p class="font-medium">${absence.seance?.cours?.libelle || 'Non défini'}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-600">Statut</p>
                                        <span class="px-2 py-1 text-xs font-medium rounded-full ${
                                            absence.statut === 'justifié' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }">
                                            ${absence.statut}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            ${absence.justification ? `
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <h3 class="text-lg font-medium mb-4">Justification</h3>
                                    <p class="text-gray-700">${absence.justification}</p>
                                    ${absence.fichierJustificatif ? `
                                        <div class="mt-4">
                                            <a href="${absence.fichierJustificatif}" 
                                               class="text-[#E67D23] hover:text-[#D66D13] flex items-center">
                                                <i class="fas fa-file-alt mr-2"></i>
                                                Voir le justificatif
                                            </a>
                                        </div>
                                    ` : ''}
                                </div>
                            ` : ''}

                            <div class="flex justify-end space-x-3">
                                ${absence.statut !== 'justifié' ? `
                                    <button id="justifierBtn" 
                                        class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">
                                        <i class="fas fa-check mr-2"></i>Justifier
                                    </button>
                                ` : ''}
                                <button id="closeBtn" 
                                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            this.modal = document.getElementById('absenceDetailsModal');
            this.setupEventListeners(absenceId);

        } catch (error) {
            console.error('Erreur lors du chargement des détails:', error);
            app.toast.show('Erreur lors du chargement des détails', 'error');
        }
    }

    setupEventListeners(absenceId) {
        const closeButtons = ['closeDetailsModal', 'closeBtn'];
        closeButtons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => this.close());
            }
        });

        const justifierBtn = document.getElementById('justifierBtn');
        if (justifierBtn) {
            justifierBtn.addEventListener('click', () => {
                this.close();
                app.justifierAbsence(absenceId);
            });
        }
    }

    close() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
} 