export class SeanceModal {
    constructor() {
        this.modal = null;
    }

    async render(seance = null) {
        try {
            const coursResponse = await app.coursService.getAllCours();
            const cours = Array.isArray(coursResponse) ? coursResponse : [];
            const isEditing = !!seance;

            const modalHtml = `
                <div id="seanceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-semibold">${isEditing ? 'Modifier la séance' : 'Nouvelle séance'}</h2>
                            <button id="closeModal" class="text-gray-600 hover:text-gray-800">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <form id="seanceForm" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Cours</label>
                                    <select 
                                        name="coursId" 
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                        required>
                                        <option value="">Sélectionner un cours</option>
                                        ${cours.map(c => `
                                            <option value="${c.id}" ${seance?.coursId === c.id ? 'selected' : ''}>
                                                ${c.libelle}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input 
                                        type="date" 
                                        name="date"
                                        value="${seance?.date || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                        required
                                    >
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
                                    <input 
                                        type="time" 
                                        name="heureDebut"
                                        value="${seance?.heureDebut || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                        required
                                    >
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Heure de fin</label>
                                    <input 
                                        type="time" 
                                        name="heureFin"
                                        value="${seance?.heureFin || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                        required
                                    >
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Salle</label>
                                    <input 
                                        type="text" 
                                        name="salle"
                                        value="${seance?.salle || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                        required
                                    >
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                    <select 
                                        name="statut" 
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                        required>
                                        <option value="planifié" ${seance?.statut === 'planifié' ? 'selected' : ''}>Planifié</option>
                                        <option value="en_cours" ${seance?.statut === 'en_cours' ? 'selected' : ''}>En cours</option>
                                        <option value="terminé" ${seance?.statut === 'terminé' ? 'selected' : ''}>Terminé</option>
                                    </select>
                                </div>
                            </div>

                            <div class="flex justify-end space-x-3 mt-6">
                                <button type="button" id="cancelBtn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                                    Annuler
                                </button>
                                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-[#E67D23] hover:bg-[#D66D13] rounded-md">
                                    ${isEditing ? 'Modifier' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            this.modal = document.getElementById('seanceModal');
            this.setupEventListeners(seance?.id);

        } catch (error) {
            console.error('Erreur lors du rendu du modal:', error);
            app.toast.show('Erreur lors de l\'ouverture du formulaire', 'error');
        }
    }

    setupEventListeners(seanceId) {
        const form = document.getElementById('seanceForm');
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
                const seanceData = {
                    coursId: parseInt(formData.get('coursId')),
                    date: formData.get('date'),
                    heureDebut: formData.get('heureDebut'),
                    heureFin: formData.get('heureFin'),
                    salle: formData.get('salle'),
                    statut: formData.get('statut')
                };

                try {
                    if (seanceId) {
                        await app.seanceService.updateSeance(seanceId, seanceData);
                        app.toast.show('Séance modifiée avec succès', 'success');
                    } else {
                        await app.seanceService.createSeance(seanceData);
                        app.toast.show('Séance créée avec succès', 'success');
                    }
                    
                    this.modal.remove();
                    app.loadSeanceData();
                } catch (error) {
                    console.error('Erreur lors de la sauvegarde:', error);
                    app.toast.show('Erreur lors de la sauvegarde', 'error');
                }
            });
        }
    }
} 