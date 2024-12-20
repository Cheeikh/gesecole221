import { CoursService } from './services/CoursService.js';
import { CoursTable } from './components/CoursTable.js';
import { ToastManager } from './utils/ToastManager.js';
import { dateFormatter } from './utils/dateFormatter.js';
import { Sidebar } from './components/ui/Sidebar.js';
import { Header } from './components/ui/Header.js';
import { Filters } from './components/ui/Filters.js';
import { TopBar } from './components/ui/TopBar.js';
import { ProfesseurList } from './components/ui/ProfesseurList.js';
import { EtudiantList } from './components/ui/EtudiantList.js';
import { SeanceList } from './components/ui/SeanceList.js';
import { AbsenceList } from './components/ui/AbsenceList.js';
import { ProfesseurService } from './services/ProfesseurService.js';
import { EtudiantService } from './services/EtudiantService.js';
import { SeanceService } from './services/SeanceService.js';
import { AbsenceService } from './services/AbsenceService.js';

// Ajout des imports des tables
import { ProfesseurTable } from './components/ProfesseurTable.js';
import { EtudiantTable } from './components/EtudiantTable.js';
import { SeanceTable } from './components/SeanceTable.js';
import { AbsenceTable } from './components/AbsenceTable.js';

export class App {
    constructor() {
        try {
            // Initialiser les services
            this.initializeServices();
            
            // Initialiser les composants UI
            this.initializeComponents();
            
            // Charger le dashboard par défaut
            this.loadDashboardPage().catch(error => {
                console.error('Erreur lors du chargement du dashboard:', error);
                this.toast.show('Erreur lors du chargement du dashboard', 'error');
            });
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de l\'application:', error);
            // Afficher une erreur visuelle
            document.body.innerHTML = `
                <div class="fixed inset-0 flex items-center justify-center bg-gray-100">
                    <div class="text-center p-8 bg-white rounded-lg shadow-xl">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                        <h1 class="text-xl font-bold mb-2">Erreur d'initialisation</h1>
                        <p class="text-gray-600 mb-4">Une erreur est survenue lors du démarrage de l'application.</p>
                        <button onclick="location.reload()" class="btn-primary">
                            <i class="fas fa-sync-alt mr-2"></i>Redémarrer l'application
                        </button>
                    </div>
                </div>
            `;
        }
    }

    initializeComponents() {
        // Initialize UI Components
        this.sidebar = new Sidebar('sidebar');
        this.topbar = new TopBar('topbar');
        this.header = new Header('header');
        this.filters = new Filters('filters');
        
        // Initialize List Components
        this.professeurList = new ProfesseurList('professeurs-list');
        this.etudiantList = new EtudiantList('etudiants-list');
        this.seanceList = new SeanceList('seances-list');
        this.absenceList = new AbsenceList('absences-list');

        // Initialize Table Components
        this.coursTable = new CoursTable('cours-table-body');
        this.professeurTable = new ProfesseurTable('professeurs-table-body');
        this.etudiantTable = new EtudiantTable('etudiants-table-body');
        this.seanceTable = new SeanceTable('seances-table-body');
        this.absenceTable = new AbsenceTable('absences-table-body');
        
        // Render components
        this.sidebar.render();
        this.topbar.render();
        this.header.render();
        this.filters.render();

        // Setup TopBar search callback
        this.topbar.onSearch((query) => {
            this.filters.updateSearchValue(query);
            this.handleSearch(query);
        });

        // Setup component callbacks
        this.header.onRefresh(() => this.loadData());
        this.filters.on('onSearch', (query) => {
            this.handleSearch(query);
        });
        this.filters.on('onDateFilter', date => this.handleDateFilter(date));
        this.filters.on('onStatusFilter', status => this.handleStatusFilter(status));
        this.filters.on('onAdd', () => this.openModal());

        // Setup Sidebar navigation
        this.sidebar.onPageChange((pageId) => {
            this.handlePageChange(pageId);
        });

        // Setup Header callbacks
        this.header.onExport(() => {
            this.exportData();
        });

        this.header.onImport(() => {
            this.importData();
        });

        this.header.onDownloadReport(() => {
            this.downloadReport();
        });

        this.header.onPeriodChange((period) => {
            this.changePeriod(period);
        });
    }

    setupEventListeners() {
        // Sidebar mobile
        this.openSidebarBtn.addEventListener('click', () => {
            this.sidebar.classList.remove('-translate-x-full');
        });

        this.closeSidebarBtn.addEventListener('click', () => {
            this.sidebar.classList.add('-translate-x-full');
        });

        // Filters
        this.searchInput.addEventListener('input', this.debounce(() => this.loadData(), 300));
        this.dateFilter.addEventListener('change', () => this.loadData());
        this.statusFilter.addEventListener('change', () => this.loadData());

        // Modal
        this.addCourseBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.cancelModalBtn.addEventListener('click', () => this.closeModal());
        this.modalForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Pagination
        this.prevPageBtn.addEventListener('click', () => this.changePage(-1));
        this.nextPageBtn.addEventListener('click', () => this.changePage(1));

        // Refresh
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadData());
    }

    async loadData() {
        try {
            const searchInput = document.getElementById('searchInput');
            const dateFilter = document.getElementById('dateFilter');
            const statusFilter = document.getElementById('statusFilter');

            const params = {
                q: searchInput?.value || '',
                date: dateFilter?.value || '',
                statut: statusFilter?.value || ''
            };

            const cours = await this.coursService.getCours(params);
            
            if (this.coursTable && cours) {
                this.coursTable.render(cours);
            } else {
                console.error('coursTable non initialisé ou données de cours invalides');
            }
            
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            this.toast.show('Erreur lors du chargement des données: ' + error.message, 'error');
            
            // Afficher un message d'erreur dans le tableau
            const tableBody = document.getElementById('cours-table-body');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center py-4 text-red-500">
                            <i class="fas fa-exclamation-circle mr-2"></i>
                            Erreur lors du chargement des données
                        </td>
                    </tr>
                `;
            }
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const coursData = {
            libelle: formData.get('libelle'),
            dateCours: formData.get('dateCours'),
            heureDebut: formData.get('heureDebut'),
            heureFin: formData.get('heureFin'),
            statut: 'planifié'
        };

        try {
            await this.coursService.createCours(coursData);
            this.toast.show('Cours ajouté avec succès', 'success');
            this.closeModal();
            this.loadData();
        } catch (error) {
            this.toast.show('Erreur lors de l\'ajout du cours', 'error');
        }
    }

    openModal(cours = null) {
        this.modal.classList.remove('hidden');
        if (cours) {
            // Remplir le formulaire pour l'édition
            this.modalForm.elements['libelle'].value = cours.libelle;
            this.modalForm.elements['dateCours'].value = dateFormatter.toInputDate(new Date(cours.dateCours));
            this.modalForm.elements['heureDebut'].value = cours.heureDebut;
            this.modalForm.elements['heureFin'].value = cours.heureFin;
        }
    }

    closeModal() {
        this.modal.classList.add('hidden');
        this.modalForm.reset();
    }

    changePage(delta) {
        this.currentPage += delta;
        this.currentPageSpan.textContent = this.currentPage;
        this.loadData();
    }

    updatePagination(totalItems) {
        this.totalCountSpan.textContent = totalItems;
        this.prevPageBtn.disabled = this.currentPage === 1;
        this.nextPageBtn.disabled = totalItems < this.itemsPerPage;
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    async editCours(id) {
        try {
            const cours = await this.coursService.getCours(id);
            this.openModal(cours);
        } catch (error) {
            this.toast.show('Erreur lors de la récupération du cours', 'error');
        }
    }

    async deleteCours(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;
        
        try {
            await this.coursService.deleteCours(id);
            this.toast.show('Cours supprimé avec succès', 'success');
            this.loadData();
        } catch (error) {
            this.toast.show('Erreur lors de la suppression du cours', 'error');
        }
    }

    async viewDetails(id) {
        try {
            const cours = await this.coursService.getCours(id);
            // Implémenter l'affichage des détails (modal ou nouvelle page)
            console.log('Détails du cours:', cours);
        } catch (error) {
            this.toast.show('Erreur lors de la récupération des détails', 'error');
        }
    }

    async handlePageChange(pageId) {
        this.filters.setCurrentPage(pageId);
        try {
            // Mettre à jour le titre
            this.header.setTitle(this.getPageTitle(pageId));
            
            // Vider le contenu actuel
            const contentContainer = document.getElementById('content');
            if (!contentContainer) {
                throw new Error('Container de contenu non trouvé');
            }
            
            // Afficher un indicateur de chargement
            contentContainer.innerHTML = `
                <div class="flex justify-center items-center h-64">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E67D23]"></div>
                </div>
            `;
            
            // Charger le nouveau contenu en fonction de la page
            switch (pageId) {
                case 'dashboard':
                    await this.loadDashboardPage();
                    break;
                
                case 'cours':
                    await this.loadCoursPage();
                    break;
                
                case 'seances':
                    await this.loadSeancesPage();
                    break;
                
                case 'professeurs':
                    await this.loadProfesseursPage();
                    break;
                
                case 'etudiants':
                    await this.loadEtudiantsPage();
                    break;
                
                case 'absences':
                    await this.loadAbsencesPage();
                    break;
                    
                default:
                    contentContainer.innerHTML = `
                        <div class="text-center text-gray-500 mt-8">
                            Page non trouvée
                        </div>
                    `;
            }

            // Masquer les filtres pour toutes les pages sauf 'cours'
            const filtersContainer = document.getElementById('filters-container');
            if (filtersContainer) {
                filtersContainer.style.display = pageId === 'cours' ? 'block' : 'none';
            }

        } catch (error) {
            console.error('Erreur lors du changement de page:', error);
            this.toast.show('Erreur lors du chargement de la page: ' + error.message, 'error');
            
            const contentContainer = document.getElementById('content');
            if (contentContainer) {
                contentContainer.innerHTML = `
                    <div class="text-center text-red-500 mt-8">
                        <i class="fas fa-exclamation-circle text-3xl mb-2"></i>
                        <p>Une erreur est survenue lors du chargement de la page.</p>
                        <button onclick="location.reload()" class="btn-primary mt-4">
                            <i class="fas fa-sync-alt mr-2"></i>Recharger la page
                        </button>
                    </div>
                `;
            }
        }
    }

    getPageTitle(pageId) {
        const titles = {
            dashboard: 'Tableau de bord',
            cours: 'Gestion des Cours',
            seances: 'Gestion des Séances',
            professeurs: 'Gestion des Professeurs',
            etudiants: 'Gestion des Étudiants',
            absences: 'Gestion des Présences'
        };
        return titles[pageId] || 'Sonatel Academy';
    }

    async loadCoursPage() {
        try {
            const contentContainer = document.getElementById('content');
            if (!contentContainer) {
                throw new Error('Container de contenu non trouvé');
            }

            // Créer la structure de base
            contentContainer.innerHTML = `
                <div class="space-y-6">
                    <div id="filters-container"></div>
                    <div class="bg-white rounded-lg shadow-lg p-4">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="bg-gray-50">
                                        <th class="p-4 text-left">Cours</th>
                                        <th class="p-4 text-left">Date</th>
                                        <th class="p-4 text-left">Horaires</th>
                                        <th class="p-4 text-left">Coefficient</th>
                                        <th class="p-4 text-left">Statut</th>
                                        <th class="p-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="cours-table-body">
                                    <tr>
                                        <td colspan="6" class="text-center py-4">
                                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

            // Initialiser les filtres
            const filters = new Filters('filters-container');
            filters.render();

            // Attendre que le DOM soit mis à jour
            await new Promise(resolve => setTimeout(resolve, 0));

            // Initialiser la table des cours
            const coursTableBody = document.getElementById('cours-table-body');
            if (!coursTableBody) {
                throw new Error('Container de table des cours non trouvé');
            }

            this.coursTable = new CoursTable('cours-table-body');
            
            // Charger les données
            const cours = await this.coursService.getCours();
            console.log('Cours chargés:', cours); // Pour le débogage
            
            // Vérifier que coursTable est bien initialisé avant de render
            if (this.coursTable) {
                this.coursTable.render(cours);
            } else {
                console.error('coursTable non initialisé');
                throw new Error('Table des cours non initialisée');
            }

            // Setup des écouteurs d'événements des filtres
            filters.on('onSearch', async (query) => {
                const filteredCours = await this.coursService.getCours({ q: query });
                this.coursTable.render(filteredCours);
            });

            filters.on('onDateFilter', async (date) => {
                const filteredCours = await this.coursService.getCoursParDate(date);
                this.coursTable.render(filteredCours);
            });

            filters.on('onStatusFilter', async (status) => {
                const filteredCours = await this.coursService.getCours({ statut: status });
                this.coursTable.render(filteredCours);
            });

            filters.on('onAdd', () => {
                // Implémenter l'ouverture du modal d'ajout
                console.log('Ajouter un cours');
            });

        } catch (error) {
            console.error('Erreur lors du chargement de la page cours:', error);
            this.toast.show('Erreur lors du chargement de la page: ' + error.message, 'error');
            
            // Afficher un message d'erreur dans le contenu
            const contentContainer = document.getElementById('content');
            if (contentContainer) {
                contentContainer.innerHTML = `
                    <div class="bg-red-50 text-red-600 p-4 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-exclamation-circle mr-2"></i>
                            <span>Une erreur est survenue lors du chargement des cours.</span>
                        </div>
                        <div class="mt-2 text-sm">
                            ${error.message}
                        </div>
                    </div>
                `;
            }
        }
    }

    async loadProfesseursPage() {
        const contentContainer = document.getElementById('content');
        contentContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6">
                <div class="mb-4 flex justify-between items-center">
                    <h2 class="text-xl font-semibold">Liste des Professeurs</h2>
                    <button class="btn-primary" onclick="this.openProfesseurModal()">
                        <i class="fas fa-plus mr-2"></i>Ajouter un professeur
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spécialité</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="professeurs-table-body">
                            <tr>
                                <td colspan="4" class="text-center py-4">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        try {
            const professeurs = await this.professeurService.getProfesseurs();
            this.professeurTable.render(professeurs);
        } catch (error) {
            this.toast.show('Erreur lors du chargement des professeurs', 'error');
        }
    }

    async loadEtudiantsPage() {
        const contentContainer = document.getElementById('content');
        contentContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6">
                <div class="mb-4 flex justify-between items-center">
                    <h2 class="text-xl font-semibold">Liste des Étudiants</h2>
                    <button class="btn-primary" onclick="this.openEtudiantModal()">
                        <i class="fas fa-plus mr-2"></i>Ajouter un étudiant
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matricule</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom Complet</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="etudiants-table-body">
                            <tr>
                                <td colspan="4" class="text-center py-4">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        try {
            const etudiants = await this.etudiantService.getEtudiants();
            this.etudiantTable.render(etudiants);
        } catch (error) {
            this.toast.show('Erreur lors du chargement des étudiants', 'error');
        }
    }

    async loadSeancesPage() {
        const contentContainer = document.getElementById('content');
        contentContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6">
                <div class="mb-4 flex justify-between items-center">
                    <h2 class="text-xl font-semibold">Liste des Séances</h2>
                    <button class="btn-primary" onclick="this.openSeanceModal()">
                        <i class="fas fa-plus mr-2"></i>Ajouter une séance
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cours</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horaires</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Professeur</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="seances-table-body">
                            <tr>
                                <td colspan="5" class="text-center py-4">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        try {
            const seances = await this.seanceService.getSeances();
            this.seanceTable.render(seances);
        } catch (error) {
            this.toast.show('Erreur lors du chargement des séances', 'error');
        }
    }

    async loadAbsencesPage() {
        const contentContainer = document.getElementById('content');
        contentContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6">
                <div class="mb-4 flex justify-between items-center">
                    <h2 class="text-xl font-semibold">Gestion des Présences</h2>
                    <button class="btn-primary" onclick="this.openAbsenceModal()">
                        <i class="fas fa-plus mr-2"></i>Marquer une absence
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cours</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="absences-table-body">
                            <tr>
                                <td colspan="5" class="text-center py-4">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        try {
            const absences = await this.absenceService.getAbsences();
            this.absenceTable.render(absences);
        } catch (error) {
            this.toast.show('Erreur lors du chargement des absences', 'error');
        }
    }

    async loadDashboardPage() {
        const contentContainer = document.getElementById('content');
        
        try {
            // Formater la date d'aujourd'hui au format YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0];
            
            // Charger les données depuis l'API
            const [etudiants, professeurs, coursAujourdhui, absences] = await Promise.all([
                this.etudiantService.getEtudiants(),
                this.professeurService.getProfesseurs(),
                this.coursService.getCoursParDate(today),
                this.absenceService.getAbsences()
            ]);

            contentContainer.innerHTML = `
                <div class="space-y-6">
                    <!-- Statistiques -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="bg-white p-6 rounded-lg shadow-lg">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-semibold mb-2">Total Étudiants</h3>
                                    <p id="totalEtudiants" class="text-3xl font-bold text-[#E67D23]">...</p>
                                </div>
                                <div class="text-[#E67D23] text-3xl">
                                    <i class="fas fa-user-graduate"></i>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-lg">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-semibold mb-2">Total Professeurs</h3>
                                    <p id="totalProfesseurs" class="text-3xl font-bold text-[#E67D23]">...</p>
                                </div>
                                <div class="text-[#E67D23] text-3xl">
                                    <i class="fas fa-chalkboard-teacher"></i>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-lg">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-semibold mb-2">Cours Aujourd'hui</h3>
                                    <p id="coursAujourdhui" class="text-3xl font-bold text-[#E67D23]">...</p>
                                </div>
                                <div class="text-[#E67D23] text-3xl">
                                    <i class="fas fa-book"></i>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-lg">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-semibold mb-2">Absences</h3>
                                    <p id="totalAbsences" class="text-3xl font-bold text-[#E67D23]">...</p>
                                </div>
                                <div class="text-[#E67D23] text-3xl">
                                    <i class="fas fa-user-clock"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Cours du jour -->
                    <div class="bg-white rounded-lg shadow-lg p-6">
                        <h2 class="text-xl font-semibold mb-4">Cours du jour</h2>
                        <div id="coursJourTable" class="overflow-x-auto">
                            <div class="animate-pulse flex justify-center py-8">
                                <div class="w-8 h-8 border-t-2 border-[#E67D23] rounded-full animate-spin"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Absences récentes -->
                    <div class="bg-white rounded-lg shadow-lg p-6">
                        <h2 class="text-xl font-semibold mb-4">Absences récentes</h2>
                        <div id="absencesRecentesTable" class="overflow-x-auto">
                            <div class="animate-pulse flex justify-center py-8">
                                <div class="w-8 h-8 border-t-2 border-[#E67D23] rounded-full animate-spin"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Mettre à jour les statistiques
            document.getElementById('totalEtudiants').textContent = etudiants.length;
            document.getElementById('totalProfesseurs').textContent = professeurs.length;
            document.getElementById('coursAujourdhui').textContent = coursAujourdhui.length;
            document.getElementById('totalAbsences').textContent = absences.length;

            // Afficher les cours du jour
            const coursJourTable = document.getElementById('coursJourTable');
            if (coursAujourdhui.length > 0) {
                coursJourTable.innerHTML = `
                    <table class="min-w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horaires</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professeur</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salle</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${coursAujourdhui.map(cours => `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="font-medium">${cours.libelle}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        ${cours.heureDebut} - ${cours.heureFin}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        ${cours.professeur?.nom} ${cours.professeur?.prenom}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        ${cours.salle || 'Non définie'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                coursJourTable.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-calendar-times text-4xl mb-4"></i>
                        <div>Aucun cours prévu aujourd'hui</div>
                    </div>
                `;
            }

            // Afficher les absences récentes
            const absencesRecentesTable = document.getElementById('absencesRecentesTable');
            const absencesRecentes = absences.slice(0, 5); // Prendre les 5 dernières absences
            
            if (absencesRecentes.length > 0) {
                absencesRecentesTable.innerHTML = `
                    <table class="min-w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${absencesRecentes.map(absence => `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        ${absence.etudiant?.nomComplet}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        ${absence.seance?.cours?.libelle}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        ${new Date(absence.dateAbs).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            absence.statut === 'justifié' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }">
                                            ${absence.statut}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                absencesRecentesTable.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-check-circle text-4xl mb-4"></i>
                        <div>Aucune absence récente</div>
                    </div>
                `;
            }

        } catch (error) {
            console.error('Erreur lors du chargement du dashboard:', error);
            contentContainer.innerHTML = `
                <div class="bg-red-50 text-red-600 p-4 rounded-lg">
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        <span>Une erreur est survenue lors du chargement du dashboard</span>
                    </div>
                    <div class="mt-2 text-sm">
                        ${error.message}
                    </div>
                </div>
            `;
        }
    }

    initializeServices() {
        this.coursService = new CoursService();
        this.professeurService = new ProfesseurService();
        this.etudiantService = new EtudiantService();
        this.seanceService = new SeanceService();
        this.absenceService = new AbsenceService();
    }

    async editProfesseur(id) {
        try {
            const professeur = await this.professeurService.getProfesseur(id);
            // Implémenter l'ouverture du modal d'édition
            console.log('Éditer professeur:', professeur);
        } catch (error) {
            this.toast.show('Erreur lors de la récupération du professeur', 'error');
        }
    }

    async deleteProfesseur(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) return;
        
        try {
            await this.professeurService.deleteProfesseur(id);
            this.toast.show('Professeur supprimé avec succès', 'success');
            this.loadProfesseursPage();
        } catch (error) {
            this.toast.show('Erreur lors de la suppression du professeur', 'error');
        }
    }

    async editEtudiant(id) {
        try {
            const etudiant = await this.etudiantService.getEtudiant(id);
            // Implémenter l'ouverture du modal d'édition
            console.log('Éditer étudiant:', etudiant);
        } catch (error) {
            this.toast.show('Erreur lors de la récupération de l\'étudiant', 'error');
        }
    }

    async deleteEtudiant(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) return;
        
        try {
            await this.etudiantService.deleteEtudiant(id);
            this.toast.show('Étudiant supprimé avec succès', 'success');
            this.loadEtudiantsPage();
        } catch (error) {
            this.toast.show('Erreur lors de la suppression de l\'étudiant', 'error');
        }
    }

    async editSeance(id) {
        try {
            const seance = await this.seanceService.getSeance(id);
            // Implémenter l'ouverture du modal d'édition
            console.log('Éditer séance:', seance);
        } catch (error) {
            this.toast.show('Erreur lors de la récupération de la séance', 'error');
        }
    }

    async deleteSeance(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) return;
        
        try {
            await this.seanceService.deleteSeance(id);
            this.toast.show('Séance supprimée avec succès', 'success');
            this.loadSeancesPage();
        } catch (error) {
            this.toast.show('Erreur lors de la suppression de la séance', 'error');
        }
    }

    async editAbsence(id) {
        try {
            const absence = await this.absenceService.getAbsence(id);
            // Implémenter l'ouverture du modal d'édition
            console.log('Éditer absence:', absence);
        } catch (error) {
            this.toast.show('Erreur lors de la récupération de l\'absence', 'error');
        }
    }

    async deleteAbsence(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette absence ?')) return;
        
        try {
            await this.absenceService.deleteAbsence(id);
            this.toast.show('Absence supprimée avec succès', 'success');
            this.loadAbsencesPage();
        } catch (error) {
            this.toast.show('Erreur lors de la suppression de l\'absence', 'error');
        }
    }
} 