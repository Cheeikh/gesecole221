export class ClasseModal {
    constructor() {
        this.modal = null;
    }

    async render(classe = null) {
        const isEditing = !!classe;

        const modalHtml = `
            <div id="classeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold">${isEditing ? 'Modifier la classe' : 'Nouvelle classe'}</h2>
                        <button id="closeModal" class="text-gray-600 hover:text-gray-800">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <form id="classeForm" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                <input 
                                    type="text" 
                                    name="nom"
                                    value="${classe?.nom || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                    required
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                                <select 
                                    name="niveau" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                    required>
                                    <option value="">Sélectionner un niveau</option>
                                    <option value="Niveau 1" ${classe?.niveau === 'Niveau 1' ? 'selected' : ''}>Niveau 1</option>
                                    <option value="Niveau 2" ${classe?.niveau === 'Niveau 2' ? 'selected' : ''}>Niveau 2</option>
                                    <option value="Niveau 3" ${classe?.niveau === 'Niveau 3' ? 'selected' : ''}>Niveau 3</option>
                                </select>
                            </div>

                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea 
                                    name="description"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50"
                                    rows="3">${classe?.description || ''}</textarea>
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
        this.modal = document.getElementById('classeModal');
        this.setupEventListeners(classe?.id);
    }

    setupEventListeners(classeId) {
        const form = document.getElementById('classeForm');
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
                const classeData = Object.fromEntries(formData.entries());

                try {
                    if (classeId) {
                        await app.classeService.updateClasse(classeId, classeData);
                        app.toast.show('Classe modifiée avec succès', 'success');
                    } else {
                        await app.classeService.createClasse(classeData);
                        app.toast.show('Classe créée avec succès', 'success');
                    }
                    
                    this.modal.remove();
                    app.loadClasseData();
                } catch (error) {
                    console.error('Erreur lors de la sauvegarde:', error);
                    app.toast.show('Erreur lors de la sauvegarde', 'error');
                }
            });
        }
    }
} 