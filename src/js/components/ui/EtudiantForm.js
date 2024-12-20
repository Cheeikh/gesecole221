export class EtudiantForm {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isEdit = false;
    }

    render(etudiant = null) {
        this.isEdit = !!etudiant;
        this.container.innerHTML = `
            <form id="etudiantForm" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Matricule</label>
                        <input type="text" name="matricule" 
                               value="${etudiant?.matricule || ''}"
                               class="input-primary w-full" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Nom Complet</label>
                        <input type="text" name="nomComplet" 
                               value="${etudiant?.nomComplet || ''}"
                               class="input-primary w-full" required>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Adresse</label>
                        <input type="text" name="adresse" 
                               value="${etudiant?.adresse || ''}"
                               class="input-primary w-full" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Classe</label>
                        <select name="classeId" class="input-primary w-full" required>
                            <option value="">Sélectionner une classe</option>
                            ${this.renderClasseOptions(etudiant?.classeId)}
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Login</label>
                        <input type="text" name="login" 
                               value="${etudiant?.login || ''}"
                               class="input-primary w-full" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input type="password" name="mdp" 
                               class="input-primary w-full"
                               ${this.isEdit ? '' : 'required'}>
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

    renderClasseOptions(selectedClasseId) {
        // Cette méthode devrait être mise à jour avec les vraies données des classes
        const classes = [
            { id: 1, nom: 'Classe A' },
            { id: 2, nom: 'Classe B' }
        ];

        return classes.map(classe => `
            <option value="${classe.id}" ${classe.id === selectedClasseId ? 'selected' : ''}>
                ${classe.nom}
            </option>
        `).join('');
    }

    setupEventListeners() {
        const form = document.getElementById('etudiantForm');
        const cancelBtn = document.getElementById('cancelBtn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const etudiantData = Object.fromEntries(formData.entries());
            this.onSubmit && this.onSubmit(etudiantData);
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