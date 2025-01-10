export class EtudiantDetailsModal {
    constructor() {
        this.modal = null;
    }

    async render(etudiantId) {
        try {
            const etudiant = await app.etudiantService.getEtudiantById(etudiantId);
            const absences = etudiant.absences || [];

            const modalHtml = `
                <div id="etudiantDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start justify-center z-50">
                    <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-6 md:my-12 transform transition-all">
                        <div class="max-h-[85vh] overflow-y-auto custom-scrollbar">
                            <!-- En-tête fixe -->
                            <div class="sticky top-0 bg-white px-8 py-6 border-b border-gray-200 rounded-t-lg">
                                <div class="flex justify-between items-start">
                                    <div class="flex items-center space-x-4">
                                        <div class="h-16 w-16 md:h-20 md:w-20 rounded-full bg-[#E67D23] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                                            <i class="fas fa-user-graduate text-[#E67D23] text-2xl md:text-3xl"></i>
                                        </div>
                                        <div>
                                            <h2 class="text-xl md:text-2xl font-bold text-gray-900">${etudiant.nomComplet}</h2>
                                            <p class="text-gray-600">Matricule: ${etudiant.matricule}</p>
                                        </div>
                                    </div>
                                    <button id="closeDetailsModal" class="text-gray-500 hover:text-gray-700 transition-colors p-2">
                                        <i class="fas fa-times text-xl"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Contenu scrollable -->
                            <div class="px-8 py-6">
                                <!-- Informations principales -->
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <!-- Informations personnelles -->
                                    <div class="col-span-1 bg-gray-50 rounded-lg p-6">
                                        <h3 class="text-lg font-semibold mb-4 flex items-center">
                                            <i class="fas fa-user text-[#E67D23] mr-2"></i>
                                            Informations personnelles
                                        </h3>
                                        <div class="space-y-3">
                                            <div class="flex items-center text-gray-600">
                                                <i class="fas fa-calendar w-6 text-[#E67D23]"></i>
                                                <span class="ml-2">Né(e) le ${new Date(etudiant.dateNaissance).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            <div class="flex items-center text-gray-600">
                                                <i class="fas fa-map-marker-alt w-6 text-[#E67D23]"></i>
                                                <span class="ml-2">${etudiant.lieuNaissance}</span>
                                            </div>
                                            <div class="flex items-center text-gray-600">
                                                <i class="fas fa-home w-6 text-[#E67D23]"></i>
                                                <span class="ml-2">${etudiant.adresse}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Informations de contact -->
                                    <div class="col-span-1 bg-gray-50 rounded-lg p-6">
                                        <h3 class="text-lg font-semibold mb-4 flex items-center">
                                            <i class="fas fa-address-card text-[#E67D23] mr-2"></i>
                                            Contact
                                        </h3>
                                        <div class="space-y-3">
                                            <div class="flex items-center text-gray-600">
                                                <i class="fas fa-envelope w-6 text-[#E67D23]"></i>
                                                <span class="ml-2">${etudiant.email}</span>
                                            </div>
                                            <div class="flex items-center text-gray-600">
                                                <i class="fas fa-phone w-6 text-[#E67D23]"></i>
                                                <span class="ml-2">${etudiant.telephone}</span>
                                            </div>
                                            <div class="flex items-center text-gray-600">
                                                <i class="fas fa-graduation-cap w-6 text-[#E67D23]"></i>
                                                <span class="ml-2">${etudiant.classe?.nom || 'Non définie'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Statistiques -->
                                    <div class="col-span-1 bg-gray-50 rounded-lg p-6">
                                        <h3 class="text-lg font-semibold mb-4 flex items-center">
                                            <i class="fas fa-chart-bar text-[#E67D23] mr-2"></i>
                                            Statistiques
                                        </h3>
                                        <div class="grid grid-cols-2 gap-4">
                                            <div class="bg-white p-4 rounded-lg text-center">
                                                <div class="text-2xl font-bold text-[#E67D23]">
                                                    ${absences.length}
                                                </div>
                                                <div class="text-sm text-gray-600">Absences totales</div>
                                            </div>
                                            <div class="bg-white p-4 rounded-lg text-center">
                                                <div class="text-2xl font-bold text-[#E67D23]">
                                                    ${absences.filter(a => a.statut === 'justifié').length}
                                                </div>
                                                <div class="text-sm text-gray-600">Absences justifiées</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Liste des absences -->
                                <div class="mt-6">
                                    <h3 class="text-lg font-semibold mb-4 flex items-center">
                                        <i class="fas fa-clock text-[#E67D23] mr-2"></i>
                                        Historique des absences
                                    </h3>
                                    ${absences.length > 0 ? `
                                        <div class="bg-gray-50 rounded-lg overflow-hidden">
                                            <div class="overflow-x-auto">
                                                <table class="min-w-full divide-y divide-gray-200">
                                                    <thead class="bg-gray-100">
                                                        <tr>
                                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cours</th>
                                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Justification</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="bg-white divide-y divide-gray-200">
                                                        ${absences.map(absence => `
                                                            <tr>
                                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    ${new Date(absence.dateAbs).toLocaleDateString('fr-FR')}
                                                                </td>
                                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    ${absence.seance?.cours?.libelle || 'Non défini'}
                                                                </td>
                                                                <td class="px-6 py-4 whitespace-nowrap">
                                                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                        ${absence.statut === 'justifié' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                                        ${absence.statut}
                                                                    </span>
                                                                </td>
                                                                <td class="px-6 py-4 text-sm text-gray-500">
                                                                    ${absence.justification || 'Aucune justification'}
                                                                </td>
                                                            </tr>
                                                        `).join('')}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ` : `
                                        <div class="text-center py-8 bg-gray-50 rounded-lg">
                                            <i class="fas fa-check-circle text-gray-400 text-4xl mb-3"></i>
                                            <p class="text-gray-500">Aucune absence enregistrée</p>
                                        </div>
                                    `}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            this.modal = document.getElementById('etudiantDetailsModal');
            this.setupEventListeners();

            document.body.style.overflow = 'hidden';

        } catch (error) {
            console.error('Erreur lors du chargement des détails:', error);
            app.toast.show('Erreur lors du chargement des détails', 'error');
        }
    }

    setupEventListeners() {
        const closeBtn = document.getElementById('closeDetailsModal');
        closeBtn.addEventListener('click', () => this.close());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal) {
                this.close();
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