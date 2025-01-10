import { dateFormatter } from '../../utils/dateFormatter.js';

export class JustificationModal {
    constructor() {
        this.modal = null;
    }

    async render(absenceId) {
        const modalHtml = `
            <div id="justificationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold">Justifier l'absence</h2>
                        <button id="closeModal" class="text-gray-600 hover:text-gray-800">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <form id="justificationForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Motif de la justification</label>
                            <textarea name="justification" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                rows="3"
                                required></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Document justificatif</label>
                            <input type="file" name="fichierJustificatif" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                accept=".pdf,.jpg,.jpeg,.png">
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" id="cancelBtn" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                                Annuler
                            </button>
                            <button type="submit" 
                                class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">
                                Valider la justification
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.modal = document.getElementById('justificationModal');
        this.setupEventListeners(absenceId);
    }

    setupEventListeners(absenceId) {
        const form = document.getElementById('justificationForm');
        const closeButtons = ['closeModal', 'cancelBtn'];

        closeButtons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => this.close());
            }
        });

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);

                try {
                    await app.absenceService.justifierAbsence(absenceId, {
                        justification: formData.get('justification'),
                        fichierJustificatif: formData.get('fichierJustificatif'),
                        dateJustification: dateFormatter.toInputDate(new Date()),
                        statut: 'justifié'
                    });
                    
                    app.toast.show('Absence justifiée avec succès', 'success');
                    this.close();
                    app.loadAbsenceData();
                } catch (error) {
                    console.error('Erreur lors de la justification:', error);
                    app.toast.show('Erreur lors de la justification', 'error');
                }
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