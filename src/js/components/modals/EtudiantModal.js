export class EtudiantModal {
    constructor() {
        this.modal = null;
        this.isEdit = false;
    }

    async render(etudiant = null) {
        try {
            this.isEdit = !!etudiant;
            const classesResponse = await app.classeService.getClasses();
            const classes = classesResponse.data || [];

            const modalHtml = `
                <div id="etudiantModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start justify-center z-50">
                    <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-6 md:my-12">
                        <div class="max-h-[85vh] overflow-y-auto custom-scrollbar">
                            <!-- En-tête -->
                            <div class="sticky top-0 bg-white px-8 py-6 border-b border-gray-200">
                                <div class="flex justify-between items-center">
                                    <h2 class="text-2xl font-bold text-gray-900">
                                        ${this.isEdit ? 'Modifier l\'étudiant' : 'Nouvel étudiant'}
                                    </h2>
                                    <button id="closeModal" class="text-gray-500 hover:text-gray-700 transition-colors">
                                        <i class="fas fa-times text-xl"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Formulaire -->
                            <form id="etudiantForm" class="p-8">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <!-- Informations personnelles -->
                                    <div class="space-y-4">
                                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                                            Informations personnelles
                                        </h3>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                                Matricule
                                            </label>
                                            <input type="text" name="matricule" 
                                                value="${etudiant?.matricule || ''}"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:border-transparent"
                                                required>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                                Nom complet
                                            </label>
                                            <input type="text" name="nomComplet" 
                                                value="${etudiant?.nomComplet || ''}"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:border-transparent"
                                                required>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                                Date de naissance
                                            </label>
                                            <input type="date" name="dateNaissance" 
                                                value="${etudiant?.dateNaissance || ''}"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:border-transparent"
                                                required>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                                Lieu de naissance
                                            </label>
                                            <input type="text" name="lieuNaissance" 
                                                value="${etudiant?.lieuNaissance || ''}"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:border-transparent"
                                                required>
                                        </div>
                                    </div>

                                    <!-- Contact et autres informations -->
                                    <div class="space-y-4">
                                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                                            Contact et scolarité
                                        </h3>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input type="email" name="email" 
                                                value="${etudiant?.email || ''}"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:border-transparent"
                                                required>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                                Téléphone
                                            </label>
                                            <input type="tel" name="telephone" 
                                                value="${etudiant?.telephone || ''}"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:border-transparent"
                                                required>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                                Adresse
                                            </label>
                                            <input type="text" name="adresse" 
                                                value="${etudiant?.adresse || ''}"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:border-transparent"
                                                required>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                                Classe
                                            </label>
                                            <select name="classeId" 
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:border-transparent"
                                                required>
                                                <option value="">Sélectionner une classe</option>
                                                ${classes.map(classe => `
                                                    <option value="${classe.id}" ${etudiant?.classeId === classe.id ? 'selected' : ''}>
                                                        ${classe.nom}
                                                    </option>
                                                `).join('')}
                                            </select>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                                Statut
                                            </label>
                                            <select name="statut" 
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:border-transparent"
                                                required>
                                                <option value="actif" ${etudiant?.statut === 'actif' ? 'selected' : ''}>Actif</option>
                                                <option value="inactif" ${etudiant?.statut === 'inactif' ? 'selected' : ''}>Inactif</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <!-- Boutons d'action -->
                                <div class="mt-8 flex justify-end space-x-4">
                                    <button type="button" id="cancelBtn"
                                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E67D23]">
                                        Annuler
                                    </button>
                                    <button type="submit"
                                        class="px-4 py-2 text-sm font-medium text-white bg-[#E67D23] border border-transparent rounded-md hover:bg-[#E67D23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E67D23]">
                                        ${this.isEdit ? 'Modifier' : 'Ajouter'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            this.modal = document.getElementById('etudiantModal');
            this.setupEventListeners(etudiant?.id);

            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error('Erreur lors du rendu du modal:', error);
            app.toast.show('Erreur lors de l\'ouverture du formulaire', 'error');
        }
    }

    setupEventListeners(etudiantId) {
        const form = document.getElementById('etudiantForm');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const etudiantData = Object.fromEntries(formData.entries());

            try {
                if (this.isEdit) {
                    await app.etudiantService.updateEtudiant(etudiantId, etudiantData);
                    app.toast.show('Étudiant modifié avec succès', 'success');
                } else {
                    await app.etudiantService.createEtudiant(etudiantData);
                    app.toast.show('Étudiant ajouté avec succès', 'success');
                }
                
                this.close();
                if (app.etudiantTable) {
                    app.etudiantTable.render();
                }
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
                app.toast.show('Erreur lors de la sauvegarde', 'error');
            }
        });

        const closeModal = () => this.close();
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal) {
                closeModal();
            }
        });
    }

    close() {
        if (this.modal) {
            document.body.style.overflow = 'auto';
            this.modal.remove();
            this.modal = null;
        }
    }
} 