import { dateFormatter } from '../../utils/dateFormatter.js';

export class AbsenceModal {
    constructor() {
        this.modal = null;
    }

    async render(absence = null, seanceId = null) {
        try {
            const etudiants = await app.etudiantService.getEtudiants();

            const modalHtml = `
                <div id="absenceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-semibold">
                                ${absence ? 'Modifier l\'absence' : 'Marquer une absence'}
                            </h2>
                            <button id="closeModal" class="text-gray-600 hover:text-gray-800">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <form id="absenceForm" class="space-y-4">
                            <input type="hidden" name="seanceId" value="${seanceId || absence?.seanceId || ''}">
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Étudiant</label>
                                <select name="etudiantId" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                                    <option value="">Sélectionner un étudiant</option>
                                    ${etudiants.etudiants.map(etudiant => `
                                        <option value="${etudiant.id}" ${absence?.etudiantId === etudiant.id ? 'selected' : ''}>
                                            ${etudiant.nomComplet}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input type="date" name="dateAbs" 
                                    value="${absence?.dateAbs || dateFormatter.toInputDate(new Date())}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Justification</label>
                                <textarea name="justification" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="3">${absence?.justification || ''}</textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                <select name="statut" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                                    <option value="non_justifié" ${absence?.statut === 'non_justifié' ? 'selected' : ''}>
                                        Non justifiée
                                    </option>
                                    <option value="justifié" ${absence?.statut === 'justifié' ? 'selected' : ''}>
                                        Justifiée
                                    </option>
                                </select>
                            </div>

                            <div class="flex justify-end space-x-3 mt-6">
                                <button type="button" id="cancelBtn" 
                                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                                    Annuler
                                </button>
                                <button type="submit" 
                                    class="px-4 py-2 text-sm font-medium text-white bg-[#E67D23] hover:bg-[#D66D13] rounded-md">
                                    ${absence ? 'Modifier' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            this.modal = document.getElementById('absenceModal');
            this.setupEventListeners(absence?.id);

        } catch (error) {
            console.error('Erreur lors du rendu du modal:', error);
            app.toast.show('Erreur lors de l\'ouverture du formulaire', 'error');
        }
    }

    setupEventListeners(absenceId) {
        const form = document.getElementById('absenceForm');
        const closeButtons = ['closeModal', 'cancelBtn'];

        closeButtons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                    this.modal.remove();
                });
            }
        });

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const absenceData = Object.fromEntries(formData.entries());

                try {
                    if (absenceId) {
                        await app.absenceService.updateAbsence(absenceId, absenceData);
                        app.toast.show('Absence modifiée avec succès', 'success');
                    } else {
                        await app.absenceService.createAbsence(absenceData);
                        app.toast.show('Absence enregistrée avec succès', 'success');
                    }
                    
                    this.modal.remove();
                    app.loadAbsenceData();
                } catch (error) {
                    console.error('Erreur lors de la sauvegarde:', error);
                    app.toast.show('Erreur lors de la sauvegarde', 'error');
                }
            });
        }
    }
} 