import { ToastManager } from '../../utils/ToastManager.js';

export class CoursModal {
    constructor() {
        this.modal = null;
        this.isEdit = false;
        this.currentCours = null;
        this.toast = new ToastManager();
    }

    async render(cours = null) {
        this.isEdit = !!cours;
        this.currentCours = cours;

        // Récupérer les données nécessaires pour les select
        const professeurs = await app.professeurService.getProfesseurs();
        const classes = await app.classeService.getClasses();

        const modalHtml = `
            <div id="coursModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold">
                            ${this.isEdit ? 'Modifier le cours' : 'Ajouter un nouveau cours'}
                        </h2>
                        <button id="closeCoursModal" class="text-gray-600 hover:text-gray-800">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <form id="coursForm" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Libellé</label>
                                <input type="text" id="libelle" name="libelle" required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value="${cours?.libelle || ''}"
                                >
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Professeur</label>
                                <select id="professeurId" name="professeurId" required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                    <option value="">Sélectionner un professeur</option>
                                    ${professeurs.map(prof => `
                                        <option value="${prof.id}" ${cours?.professeurId === prof.id ? 'selected' : ''}>
                                            ${prof.nom} ${prof.prenom}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Classe</label>
                                <select id="classeId" name="classeId" required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                    <option value="">Sélectionner une classe</option>
                                    ${classes.map(classe => `
                                        <option value="${classe.id}" ${cours?.classeId === classe.id ? 'selected' : ''}>
                                            ${classe.nom}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Heures totales</label>
                                <input type="number" id="heuresTotal" name="heuresTotal" required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value="${cours?.heuresTotal || ''}"
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Coefficient</label>
                                <input type="number" id="coefficient" name="coefficient" required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value="${cours?.coefficient || '1'}"
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Description</label>
                                <textarea id="description" name="description" rows="3"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >${cours?.description || ''}</textarea>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" id="cancelCoursModal"
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                                Annuler
                            </button>
                            <button type="submit"
                                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                                ${this.isEdit ? 'Modifier' : 'Ajouter'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Ajouter le modal au DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.modal = document.getElementById('coursModal');
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('coursForm');
        const closeBtn = document.getElementById('closeCoursModal');
        const cancelBtn = document.getElementById('cancelCoursModal');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(e);
        });

        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });
    }

    async handleSubmit(e) {
        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            // Convertir les valeurs numériques
            data.heuresTotal = parseInt(data.heuresTotal);
            data.coefficient = parseInt(data.coefficient);
            data.professeurId = parseInt(data.professeurId);
            data.classeId = parseInt(data.classeId);

            if (this.isEdit) {
                await app.coursService.updateCours(this.currentCours.id, data);
                this.toast.show('Cours modifié avec succès', 'success');
            } else {
                await app.coursService.createCours(data);
                this.toast.show('Cours créé avec succès', 'success');
            }

            this.close();
            app.loadCoursPage();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du cours:', error);
            this.toast.show('Erreur lors de la sauvegarde du cours', 'error');
        }
    }

    close() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
} 