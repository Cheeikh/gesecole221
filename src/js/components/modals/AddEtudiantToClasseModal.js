export class AddEtudiantToClasseModal {
    constructor() {
        this.modal = null;
    }

    async render(classeId, etudiants) {
        const modalHtml = `
            <div id="addEtudiantToClasseModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold">Ajouter des étudiants à la classe</h2>
                        <button id="closeModal" class="text-gray-600 hover:text-gray-800">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <form id="addEtudiantForm" class="space-y-4">
                        <div class="max-h-96 overflow-y-auto">
                            ${etudiants.map(etudiant => `
                                <div class="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg">
                                    <input type="checkbox" 
                                           id="etudiant_${etudiant.id}" 
                                           name="etudiants" 
                                           value="${etudiant.id}"
                                           class="h-4 w-4 text-[#E67D23] focus:ring-[#E67D23] border-gray-300 rounded">
                                    <label for="etudiant_${etudiant.id}" class="flex-1 cursor-pointer">
                                        <div class="font-medium">${etudiant.nomComplet}</div>
                                        <div class="text-sm text-gray-500">${etudiant.matricule}</div>
                                    </label>
                                </div>
                            `).join('')}
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" id="cancelBtn" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                                Annuler
                            </button>
                            <button type="submit" 
                                class="px-4 py-2 text-sm font-medium text-white bg-[#E67D23] hover:bg-[#D66D13] rounded-md">
                                Ajouter à la classe
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.modal = document.getElementById('addEtudiantToClasseModal');
        this.setupEventListeners(classeId);
    }

    setupEventListeners(classeId) {
        const form = document.getElementById('addEtudiantForm');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');

        const closeModal = () => this.close();

        closeBtn?.addEventListener('click', closeModal);
        cancelBtn?.addEventListener('click', closeModal);

        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) closeModal();
        });

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const selectedEtudiants = formData.getAll('etudiants').map(id => parseInt(id));

            try {
                // Mettre à jour chaque étudiant sélectionné
                await Promise.all(selectedEtudiants.map(etudiantId => 
                    app.etudiantService.updateEtudiant(etudiantId, { classeId })
                ));

                app.toast.show('Étudiants ajoutés avec succès', 'success');
                this.close();
                app.viewClasseDetails(classeId);
            } catch (error) {
                console.error('Erreur lors de l\'ajout des étudiants:', error);
                app.toast.show('Erreur lors de l\'ajout des étudiants', 'error');
            }
        });
    }

    close() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
} 