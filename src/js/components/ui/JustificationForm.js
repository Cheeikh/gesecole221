export class JustificationForm {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(absence) {
        const html = `
            <form id="justificationForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Motif de la justification
                    </label>
                    <textarea 
                        name="justification" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows="3"
                        required>${absence?.justification || ''}</textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Document justificatif
                    </label>
                    <input 
                        type="file" 
                        name="fichierJustificatif"
                        accept=".pdf,.jpg,.jpeg,.png"
                        class="w-full">
                    ${absence?.fichierJustificatif ? `
                        <div class="mt-2">
                            <a href="${absence.fichierJustificatif}" 
                               target="_blank"
                               class="text-blue-600 hover:text-blue-800">
                                Voir le document actuel
                            </a>
                        </div>
                    ` : ''}
                </div>

                <div class="flex justify-end space-x-3">
                    <button type="submit" 
                        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Valider la justification
                    </button>
                </div>
            </form>
        `;

        this.container.innerHTML = html;
        this.setupEventListeners(absence?.id);
    }

    setupEventListeners(absenceId) {
        const form = document.getElementById('justificationForm');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            try {
                await app.absenceService.justifierAbsence(absenceId, {
                    justification: formData.get('justification'),
                    fichierJustificatif: formData.get('fichierJustificatif'),
                    dateJustification: new Date().toISOString(),
                    statut: 'justifié'
                });

                app.toast.show('Justification enregistrée avec succès', 'success');
                app.loadAbsenceData();
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement de la justification:', error);
                app.toast.show('Erreur lors de l\'enregistrement de la justification', 'error');
            }
        });
    }
} 