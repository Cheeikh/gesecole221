export class ProfesseurModal {
    constructor() {
        this.modal = null;
    }

    async render(professeur = null) {
        const isEditing = !!professeur;

        const modalHtml = `
            <div id="professeurModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold">${isEditing ? 'Modifier le professeur' : 'Nouveau professeur'}</h2>
                        <button id="closeModal" class="text-gray-600 hover:text-gray-800">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <form id="professeurForm" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                <input 
                                    type="text" 
                                    name="nom"
                                    value="${professeur?.nom || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                    required
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                <input 
                                    type="text" 
                                    name="prenom"
                                    value="${professeur?.prenom || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                    required
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value="${professeur?.email || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                    required
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                <input 
                                    type="tel" 
                                    name="telephone"
                                    value="${professeur?.telephone || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                                <input 
                                    type="text" 
                                    name="specialite"
                                    value="${professeur?.specialite || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                    required
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                                <select 
                                    name="grade" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                    required>
                                    <option value="">Sélectionner un grade</option>
                                    <option value="Docteur" ${professeur?.grade === 'Docteur' ? 'selected' : ''}>Docteur</option>
                                    <option value="Professeur" ${professeur?.grade === 'Professeur' ? 'selected' : ''}>Professeur</option>
                                    <option value="Ingénieur" ${professeur?.grade === 'Ingénieur' ? 'selected' : ''}>Ingénieur</option>
                                </select>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" id="cancelBtn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                                Annuler
                            </button>
                            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-[#E67D23] hover:bg-[#D66D13] rounded-md">
                                ${isEditing ? 'Modifier' : 'Ajouter'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.modal = document.getElementById('professeurModal');
        this.setupEventListeners(professeur?.id);
    }

    setupEventListeners(professeurId = null) {
        const form = document.getElementById('professeurForm');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const professeurData = Object.fromEntries(formData.entries());

            try {
                if (professeurId) {
                    await app.professeurService.updateProfesseur(professeurId, professeurData);
                    app.toast.show('Professeur modifié avec succès', 'success');
                } else {
                    await app.professeurService.createProfesseur(professeurData);
                    app.toast.show('Professeur ajouté avec succès', 'success');
                }
                
                this.close();
                await app.loadProfesseurData();
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
                app.toast.show('Erreur lors de la sauvegarde', 'error');
            }
        });

        closeBtn.addEventListener('click', () => this.close());
        cancelBtn.addEventListener('click', () => this.close());

        // Fermer sur clic en dehors du modal
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
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