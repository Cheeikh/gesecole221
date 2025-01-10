export class ClasseDetailsModal {
    constructor() {
        this.modal = null;
    }

    async render(classeId) {
        try {
            const classe = await app.classeService.getClasseById(classeId);
            const etudiants = await app.etudiantService.getEtudiantsParClasse(classeId);

            const modalHtml = `
                <div id="classeDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start justify-center z-50">
                    <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-6 md:my-12">
                        <div class="max-h-[85vh] overflow-y-auto custom-scrollbar">
                            <!-- En-tête -->
                            <div class="sticky top-0 bg-white px-8 py-6 border-b border-gray-200">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h2 class="text-2xl font-bold text-gray-900">${classe.nom}</h2>
                                        <p class="text-gray-600">${classe.niveau || 'Niveau non défini'}</p>
                                    </div>
                                    <button id="closeDetailsModal" class="text-gray-500 hover:text-gray-700 transition-colors">
                                        <i class="fas fa-times text-xl"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Contenu -->
                            <div class="p-8">
                                <!-- Description -->
                                <div class="bg-gray-50 p-6 rounded-lg mb-8">
                                    <h3 class="text-lg font-semibold mb-4">Description</h3>
                                    <p class="text-gray-700">${classe.description || 'Aucune description disponible'}</p>
                                </div>

                                <!-- Liste des étudiants -->
                                <div class="bg-white rounded-lg shadow">
                                    <div class="flex justify-between items-center p-6 border-b">
                                        <h3 class="text-lg font-semibold">Étudiants inscrits</h3>
                                        <button id="addEtudiantBtn" class="btn-primary">
                                            <i class="fas fa-plus mr-2"></i>Ajouter un étudiant
                                        </button>
                                    </div>
                                    
                                    ${etudiants.length > 0 ? `
                                        <div class="divide-y">
                                            ${etudiants.map(etudiant => `
                                                <div class="p-4 hover:bg-gray-50 flex items-center justify-between">
                                                    <div class="flex items-center">
                                                        <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <i class="fas fa-user-graduate text-gray-500"></i>
                                                        </div>
                                                        <div class="ml-4">
                                                            <div class="font-medium">${etudiant.nomComplet}</div>
                                                            <div class="text-sm text-gray-500">${etudiant.matricule}</div>
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center space-x-2">
                                                        <button onclick="app.viewEtudiantDetails(${etudiant.id})" 
                                                                class="text-blue-600 hover:text-blue-800">
                                                            <i class="fas fa-eye"></i>
                                                        </button>
                                                        <button onclick="app.removeEtudiantFromClasse(${etudiant.id}, ${classe.id})" 
                                                                class="text-red-600 hover:text-red-800">
                                                            <i class="fas fa-user-minus"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : `
                                        <div class="p-8 text-center text-gray-500">
                                            <i class="fas fa-users text-4xl mb-4"></i>
                                            <p>Aucun étudiant inscrit dans cette classe</p>
                                        </div>
                                    `}
                                </div>

                                <!-- Statistiques -->
                                <div class="grid grid-cols-3 gap-6 mt-8">
                                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                                        <div class="text-2xl font-bold text-[#E67D23]">${etudiants.length}</div>
                                        <div class="text-sm text-gray-600">Étudiants inscrits</div>
                                    </div>
                                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                                        <div class="text-2xl font-bold text-[#E67D23]">
                                            ${etudiants.filter(e => e.statut === 'actif').length}
                                        </div>
                                        <div class="text-sm text-gray-600">Étudiants actifs</div>
                                    </div>
                                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                                        <div class="text-2xl font-bold text-[#E67D23]">
                                            ${etudiants.filter(e => e.statut === 'inactif').length}
                                        </div>
                                        <div class="text-sm text-gray-600">Étudiants inactifs</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            this.modal = document.getElementById('classeDetailsModal');
            this.setupEventListeners(classeId);

        } catch (error) {
            console.error('Erreur lors du chargement des détails:', error);
            app.toast.show('Erreur lors du chargement des détails', 'error');
        }
    }

    setupEventListeners(classeId) {
        const closeBtn = document.getElementById('closeDetailsModal');
        const addEtudiantBtn = document.getElementById('addEtudiantBtn');

        closeBtn?.addEventListener('click', () => this.close());

        addEtudiantBtn?.addEventListener('click', () => {
            this.close();
            app.openAddEtudiantToClasseModal(classeId);
        });

        this.modal?.addEventListener('click', (e) => {
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