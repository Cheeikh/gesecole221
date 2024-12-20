export class ProfesseurForm {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isEdit = false;
    }

    render(professeur = null) {
        this.isEdit = !!professeur;
        this.container.innerHTML = `
            <form id="professeurForm" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Nom</label>
                        <input type="text" name="nom" 
                               value="${professeur?.nom || ''}"
                               class="input-primary w-full" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Prénom</label>
                        <input type="text" name="prenom" 
                               value="${professeur?.prenom || ''}"
                               class="input-primary w-full" required>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Grade</label>
                        <select name="grade" class="input-primary w-full" required>
                            <option value="">Sélectionner un grade</option>
                            <option value="Docteur" ${professeur?.grade === 'Docteur' ? 'selected' : ''}>Docteur</option>
                            <option value="Professeur" ${professeur?.grade === 'Professeur' ? 'selected' : ''}>Professeur</option>
                            <option value="Ingénieur" ${professeur?.grade === 'Ingénieur' ? 'selected' : ''}>Ingénieur</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Spécialité</label>
                        <input type="text" name="specialite" 
                               value="${professeur?.specialite || ''}"
                               class="input-primary w-full" required>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Photo</label>
                    <input type="file" name="photo" 
                           accept="image/*"
                           class="input-primary w-full">
                </div>

                <div class="flex justify-end gap-4">
                    <button type="button" id="cancelBtn" class="btn-secondary">
                        Annuler
                    </button>
                    <button type="submit" class="btn-primary">
                        ${this.isEdit ? 'Modifier' : 'Ajouter'}
                    </button>
                </div>
            </form>
        `;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('professeurForm');
        const cancelBtn = document.getElementById('cancelBtn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const professeurData = Object.fromEntries(formData.entries());
            this.onSubmit && this.onSubmit(professeurData);
        });

        cancelBtn.addEventListener('click', () => {
            this.onCancel && this.onCancel();
        });
    }

    onSubmit(callback) {
        this.onSubmit = callback;
    }

    onCancel(callback) {
        this.onCancel = callback;
    }
} 