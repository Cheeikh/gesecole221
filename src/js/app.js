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
import { ClasseService } from './services/ClasseService.js';
import { AuthService } from './services/AuthService.js';

// Ajout des imports des tables
import { ProfesseurTable } from './components/ProfesseurTable.js';
import { EtudiantTable } from './components/EtudiantTable.js';
import { SeanceTable } from './components/SeanceTable.js';
import { AbsenceTable } from './components/AbsenceTable.js';
import { CoursModal } from './components/modals/CoursModal.js';
import { CoursDetails } from './components/CoursDetails.js';
import { CoursDetailsModal } from './components/modals/CoursDetailsModal.js';
import { SeanceDetailsModal } from './components/modals/SeanceDetailsModal.js';
import { SeanceModal } from './components/modals/SeanceModal.js';
import { ConfirmModal } from './components/ui/ConfirmModal.js';
import { ProfesseurModal } from './components/modals/ProfesseurModal.js';
import { ProfesseurDetailsModal } from './components/modals/ProfesseurDetailsModal.js';
import { EtudiantModal } from './components/modals/EtudiantModal.js';
import { EtudiantDetailsModal } from './components/modals/EtudiantDetailsModal.js';
import { AbsenceModal } from './components/modals/AbsenceModal.js';
import { AbsenceDetailsModal } from './components/modals/AbsenceDetailsModal.js';import { JustificationModal } from './components/modals/JustificationModal.js';
import { ClasseTable } from './components/ClasseTable.js';
import { ClasseModal } from './components/modals/ClasseModal.js';
import { AddEtudiantToClasseModal } from './components/modals/AddEtudiantToClasseModal.js';
import { ClasseDetailsModal } from './components/modals/ClasseDetailsModal.js';

export class App {
    constructor() {
        try {
            this.authService = new AuthService();
            this.toast = new ToastManager();
            
            // Initialiser les services
            this.initializeServices();

            // Créer d'abord la structure du layout
            document.body.innerHTML = `
                <div class="flex min-h-screen bg-gray-100">
                    <!-- Sidebar -->
                    <div id="sidebar"></div>
                    
                    <!-- Mini sidebar spacer -->
                    <div id="miniSidebarSpace" class="w-0 transition-all duration-500"></div>
                    
                    <!-- Main content -->
                    <div class="flex-1 flex flex-col min-w-0">
                        <!-- Topbar -->
                        <div id="topbar"></div>
                        
                        <!-- Main container -->
                        <main class="flex-1 p-4 overflow-x-hidden">
                            <div id="header"></div>
                            <div id="filters"></div>
                            <div id="content" class="mt-4"></div>
                        </main>
                    </div>
                </div>
            `;

            // Initialiser les composants UI
            this.initializeComponents();
            
            // Charger le dashboard
            this.loadDashboardPage().catch(error => {
                console.error('Erreur lors du chargement du dashboard:', error);
                this.toast.show('Erreur lors du chargement du dashboard', 'error');
            });
            
            this.classeService = new ClasseService();
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
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

    checkPermission(permission) {
        if (!this.authService.hasPermission(permission)) {
            this.toast.show('Vous n\'avez pas les permissions nécessaires', 'error');
            return false;
        }
        return true;
    }

    initializeComponents() {
        // Vérifier l'existence des éléments DOM avant l'initialisation
        const sidebarElement = document.getElementById('sidebar');
        const topbarElement = document.getElementById('topbar');
        const headerElement = document.getElementById('header');
        const filtersElement = document.getElementById('filters');

        if (!sidebarElement || !topbarElement || !headerElement || !filtersElement) {
            throw new Error('Éléments DOM requis non trouvés');
        }

        // Initialize UI Components
        this.sidebar = new Sidebar('sidebar');
        this.topbar = new TopBar('topbar');
        this.header = new Header('header');
        this.filters = new Filters('filters');
        
        // Initialize List Components with null checks
        this.professeurList = document.getElementById('professeurs-list') ? 
            new ProfesseurList('professeurs-list') : null;
        this.etudiantList = document.getElementById('etudiants-list') ? 
            new EtudiantList('etudiants-list') : null;
        this.seanceList = document.getElementById('seances-list') ? 
            new SeanceList('seances-list') : null;
        this.absenceList = document.getElementById('absences-list') ? 
            new AbsenceList('absences-list') : null;

        // Initialize Table Components with null checks
        this.coursTable = document.getElementById('cours-table-body') ? 
            new CoursTable('cours-table-body') : null;
        this.professeurTable = document.getElementById('professeurs-table-body') ? 
            new ProfesseurTable('professeurs-table-body') : null;
        this.etudiantTable = document.getElementById('etudiants-table-body') ? 
            new EtudiantTable('etudiants-table-body') : null;
        this.seanceTable = document.getElementById('seances-table-body') ? 
            new SeanceTable('seances-table-body') : null;
        this.absenceTable = document.getElementById('absences-table-body') ? 
            new AbsenceTable('absences-table-body') : null;
        
        // Render components
        this.sidebar.render();
        this.topbar.render();
        this.header.render();
        this.filters.render();

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Vérifier l'existence des éléments avant d'ajouter les écouteurs
        
        // Sidebar mobile
        const openSidebarBtn = document.getElementById('openSidebar');
        const closeSidebarBtn = document.getElementById('closeSidebar');
        
        if (openSidebarBtn) {
            openSidebarBtn.addEventListener('click', () => {
                this.sidebar.container.classList.remove('-translate-x-full');
            });
        }

        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', () => {
                this.sidebar.container.classList.add('-translate-x-full');
            });
        }

        // Filters
        const searchInput = document.getElementById('searchInput');
        const dateFilter = document.getElementById('dateFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => this.loadData(), 300));
        }
        
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.loadData());
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.loadData());
        }

        // Modal
        const addCourseBtn = document.getElementById('addCourseBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const cancelModalBtn = document.getElementById('cancelModalBtn');
        const modalForm = document.getElementById('modalForm');
        
        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', () => this.openModal());
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (cancelModalBtn) {
            cancelModalBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (modalForm) {
            modalForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Pagination
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.changePage(-1));
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.changePage(1));
        }

        // Refresh
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadData());
        }

        // Setup TopBar search callback
        if (this.topbar) {
            this.topbar.onSearch((query) => {
                if (this.filters) {
                    this.filters.updateSearchValue(query);
                    this.handleSearch(query);
                }
            });
        }

        // Setup component callbacks
        if (this.header) {
            this.header.onRefresh(() => this.loadData());
        }

        if (this.filters) {
            this.filters.on('onSearch', (query) => {
                this.handleSearch(query);
            });
            this.filters.on('onDateFilter', date => this.handleDateFilter(date));
            this.filters.on('onStatusFilter', status => this.handleStatusFilter(status));
            this.filters.on('onAdd', () => this.openModal());
        }

        // Setup Sidebar navigation
        if (this.sidebar) {
            this.sidebar.onPageChange((pageId) => {
                this.handlePageChange(pageId);
            });
        }

        // Setup Header callbacks
        if (this.header) {
            this.header.onExport(() => this.exportData());
            this.header.onImport(() => this.importData());
            this.header.onDownloadReport(() => this.downloadReport());
            this.header.onPeriodChange((period) => this.changePeriod(period));
        }

        // Toggle des filtres sur mobile
        const toggleFiltersBtn = document.getElementById('toggleFilters');
        const filtersContainer = document.getElementById('filtersContainer');
        
        if (toggleFiltersBtn && filtersContainer) {
            toggleFiltersBtn.addEventListener('click', () => {
                filtersContainer.classList.toggle('hidden');
                // Changer l'icône
                const icon = toggleFiltersBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-filter');
                    icon.classList.toggle('fa-times');
                }
            });
        }
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

            // Vérifier si coursTable existe, sinon l'initialiser
            if (!this.coursTable) {
                const tableBody = document.getElementById('cours-table-body');
                if (tableBody) {
                    this.coursTable = new CoursTable('cours-table-body');
                } else {
                    console.error('Élément cours-table-body non trouvé');
                    return;
                }
            }

            const coursResponse = await this.coursService.getCours(params);
            
            if (this.coursTable) {
                await this.coursTable.render(coursResponse);
            } else {
                console.error('coursTable non initialisé');
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
        if (!this.checkPermission('delete_cours')) return;
        
        const confirmModal = new ConfirmModal();
        const confirmed = await confirmModal.render({
            title: 'Supprimer le cours',
            message: 'Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            type: 'danger'
        });
        
        if (confirmed) {
            try {
                await this.coursService.deleteCours(id);
                this.toast.show('Cours supprimé avec succès', 'success');
                await this.loadCoursData();
            } catch (error) {
                console.error('Erreur lors de la suppression du cours:', error);
                this.toast.show('Erreur lors de la suppression du cours', 'error');
            }
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
        try {
            // Mettre à jour le titre de la page
            document.title = this.getPageTitle(pageId);
            
            // Réinitialiser les composants
            this.resetComponents();
            
            switch (pageId) {
                case 'dashboard':
                    await this.loadDashboardPage();
                    break;
                case 'cours':
                    await this.loadCoursPage();
                    break;
                case 'classes':  // Ajouter ce cas
                    await this.loadClassesPage();
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
                    throw new Error('Page non trouvée');
            }
        } catch (error) {
            console.error('Erreur lors du changement de page:', error);
            this.toast.show('Erreur lors du chargement de la page: ' + error.message, 'error');
        }
    }

    // Mettre à jour aussi la méthode getPageTitle pour inclure les classes
    getPageTitle(pageId) {
        const titles = {
            dashboard: 'Tableau de bord',
            cours: 'Gestion des Cours',
            classes: 'Gestion des Classes', // Ajouter ce titre
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

            contentContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-4 md:p-6 h-full">
                    <div class="mb-6">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div class="flex justify-between items-center w-full md:w-auto">
                                <h2 class="text-xl font-semibold">Liste des Cours</h2>
                                <!-- Bouton pour afficher/masquer les filtres sur mobile -->
                                <button id="toggleFilters" class="md:hidden text-gray-600 hover:text-gray-900">
                                    <i class="fas fa-filter"></i>
                                </button>
                            </div>
                            
                            <!-- Conteneur des filtres avec état masqué par défaut sur mobile -->
                            <div id="filtersContainer" class="hidden md:flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <div class="flex flex-wrap gap-2 items-center w-full md:w-auto">
                                    <input type="text" 
                                        id="searchCours" 
                                        placeholder="Rechercher un cours..."
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm"
                                    >
                                    <select id="filterClasse" 
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm">
                                        <option value="">Toutes les classes</option>
                                    </select>
                                    <select id="filterProfesseur" 
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm">
                                        <option value="">Tous les professeurs</option>
                                    </select>
                                    <select id="filterStatut" 
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm">
                                        <option value="">Tous les statuts</option>
                                        <option value="en_cours">En cours</option>
                                        <option value="planifié">Planifié</option>
                                        <option value="terminé">Terminé</option>
                                    </select>
                                </div>
                                <button id="addCoursBtn" class="w-full md:w-auto btn-primary whitespace-nowrap">
                                    <i class="fas fa-plus mr-2"></i>Ajouter un cours
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-x-auto -mx-4 md:mx-0">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50 hidden md:table-header-group">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cours</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Professeur</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coefficient</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="cours-table-body" class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colspan="7" class="text-center py-4">
                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="pagination-container"></div>
                </div>
            `;

            // Initialiser la table des cours
            this.coursTable = new CoursTable('cours-table-body');
            
            // Charger les données initiales
            await this.loadData();
            
            // Configurer les événements
            this.setupCoursEventListeners();

        } catch (error) {
            console.error('Erreur lors du chargement de la page des cours:', error);
            this.toast.show('Erreur lors du chargement de la page des cours', 'error');
        }
    }

    async loadCoursData(filters = {}) {
        try {
            // Récupérer tous les filtres actifs
            const searchValue = document.getElementById('searchCours')?.value;
            const classeId = document.getElementById('filterClasse')?.value;
            const professeurId = document.getElementById('filterProfesseur')?.value;
            const statut = document.getElementById('filterStatut')?.value;

            // Combiner les filtres existants avec les nouveaux
            const combinedFilters = {
                ...filters,
                ...(searchValue && { q: searchValue }),
                ...(classeId && { classeId }),
                ...(professeurId && { professeurId }),
                ...(statut && { statut })
            };

            // Appliquer les filtres
            await this.coursTable.render(combinedFilters);
        } catch (error) {
            console.error('Erreur lors du chargement des cours:', error);
            this.toast.show('Erreur lors du chargement des cours', 'error');
        }
    }

    async setupCoursFilters() {
        try {
            // Charger les classes pour le filtre
            const classes = await this.classeService.getClasses();
            const filterClasse = document.getElementById('filterClasse');
            if (filterClasse && classes) {
                classes.forEach(classe => {
                    const option = document.createElement('option');
                    option.value = classe.id;
                    option.textContent = classe.nom;
                    filterClasse.appendChild(option);
                });
            }

            // Charger les professeurs pour le filtre
            const professeurs = await this.professeurService.getProfesseurs();
            const filterProfesseur = document.getElementById('filterProfesseur');
            if (filterProfesseur && professeurs) {
                professeurs.forEach(prof => {
                    const option = document.createElement('option');
                    option.value = prof.id;
                    option.textContent = `${prof.nom} ${prof.prenom}`;
                    filterProfesseur.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Erreur lors de la configuration des filtres:', error);
            this.toast.show('Erreur lors du chargement des filtres', 'error');
        }
    }

    setupCoursEventListeners() {
        // Recherche avec debounce
        const searchInput = document.getElementById('searchCours');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.loadCoursData();
            }, 300));
        }

        // Filtre par classe
        const filterClasse = document.getElementById('filterClasse');
        if (filterClasse) {
            filterClasse.addEventListener('change', () => this.loadCoursData());
        }

        // Filtre par professeur
        const filterProfesseur = document.getElementById('filterProfesseur');
        if (filterProfesseur) {
            filterProfesseur.addEventListener('change', () => this.loadCoursData());
        }

        // Filtre par statut
        const filterStatut = document.getElementById('filterStatut');
        if (filterStatut) {
            filterStatut.addEventListener('change', () => this.loadCoursData());
        }

        // Bouton d'ajout
        const addBtn = document.getElementById('addCoursBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openCoursModal());
        }

        // Toggle des filtres sur mobile
        const toggleFiltersBtn = document.getElementById('toggleFilters');
        const filtersContainer = document.getElementById('filtersContainer');
        
        if (toggleFiltersBtn && filtersContainer) {
            toggleFiltersBtn.addEventListener('click', () => {
                filtersContainer.classList.toggle('hidden');
                // Changer l'icône
                const icon = toggleFiltersBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-filter');
                    icon.classList.toggle('fa-times');
                }
            });
        }
    }

    async openCoursModal(coursId = null) {
        try {
            if (!this.classeService) {
                throw new Error('ClasseService n\'est pas initialisé');
            }

            const coursModal = new CoursModal();
            if (coursId) {
                const cours = await this.coursService.getCoursById(coursId);
                if (!cours) {
                    throw new Error('Cours non trouvé');
                }
                await coursModal.render(cours);
            } else {
                await coursModal.render();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ouverture du modal:', error);
            this.toast.show('Erreur lors de l\'ouverture du formulaire: ' + error.message, 'error');
        }
    }

    async viewCoursDetails(coursId) {
        try {
            const detailsModal = new CoursDetailsModal();
            await detailsModal.render(coursId);
        } catch (error) {
            console.error('Erreur lors de l\'affichage des détails du cours:', error);
            this.toast.show('Erreur lors de l\'affichage des détails du cours', 'error');
        }
    }

    async editSeance(id) {
        if (!this.checkPermission('edit_seance')) return;
        await this.openSeanceModal(id);
    }

    async deleteSeance(id) {
        if (!this.checkPermission('delete_seance')) return;
        
        const confirmModal = new ConfirmModal();
        const confirmed = await confirmModal.render({
            title: 'Supprimer la séance',
            message: 'Êtes-vous sûr de vouloir supprimer cette séance ? Cette action est irréversible.',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            type: 'danger'
        });
        
        if (confirmed) {
            try {
                await this.seanceService.deleteSeance(id);
                this.toast.show('Séance supprimée avec succès', 'success');
                await this.loadSeanceData();
            } catch (error) {
                console.error('Erreur lors de la suppression de la séance:', error);
                this.toast.show('Erreur lors de la suppression de la séance', 'error');
            }
        }
    }

    async loadAbsencesPage() {
        try {
            const contentContainer = document.getElementById('content');
            if (!contentContainer) {
                throw new Error('Container de contenu non trouvé');
            }

            contentContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <div class="mb-4 flex justify-between items-center">
                        <h2 class="text-xl font-semibold">Gestion des Présences</h2>
                        <button class="btn-primary" id="addAbsenceBtn">
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
                    <div id="pagination-container"></div>
                </div>
            `;

            // Initialiser la table des absences
            this.absenceTable = new AbsenceTable('absences-table-body');
            
            // Configurer les filtres
            await this.setupAbsenceFilters();
            
            // Charger les données initiales
            await this.loadAbsenceData();

            // Configurer les événements
            const addAbsenceBtn = document.getElementById('addAbsenceBtn');
            if (addAbsenceBtn) {
                addAbsenceBtn.addEventListener('click', () => this.openAbsenceModal());
            }

        } catch (error) {
            console.error('Erreur lors du chargement des absences:', error);
            contentContainer.innerHTML = `
                <div class="bg-red-50 text-red-600 p-4 rounded-lg">
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        <span>Une erreur est survenue lors du chargement des absences</span>
                    </div>
                    <div class="mt-2 text-sm">
                        ${error.message}
                    </div>
                </div>
            `;
        }
    }

    async loadAbsenceData(filters = {}) {
        try {
            console.log('Chargement des absences avec filtres:', filters); // Debug
            
            const response = await this.absenceService.getAbsences(filters);
            console.log('Réponse du service:', response); // Debug
            
            if (this.absenceTable) {
                await this.absenceTable.render(response);
            } else {
                console.error('absenceTable n\'est pas initialisé');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des absences:', error);
            this.toast.show('Erreur lors du chargement des absences', 'error');
        }
    }

    async setupAbsenceFilters() {
        try {
            // Récupérer les étudiants pour le filtre
            const etudiantsResponse = await this.etudiantService.getEtudiants();
            const filterEtudiant = document.getElementById('filterEtudiant');
            
            if (filterEtudiant && etudiantsResponse.etudiants) {
                filterEtudiant.innerHTML = '<option value="">Tous les étudiants</option>';
                etudiantsResponse.etudiants.forEach(etudiant => {
                    const option = document.createElement('option');
                    option.value = etudiant.id;
                    option.textContent = etudiant.nomComplet;
                    filterEtudiant.appendChild(option);
                });
            }

            // Récupérer les cours pour le filtre
            const coursResponse = await this.coursService.getAllCours();
            const filterCours = document.getElementById('filterCours');
            
            if (filterCours && coursResponse) {
                filterCours.innerHTML = '<option value="">Tous les cours</option>';
                coursResponse.forEach(cours => {
                    const option = document.createElement('option');
                    option.value = cours.id;
                    option.textContent = cours.libelle;
                    filterCours.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Erreur lors de la configuration des filtres:', error);
            this.toast.show('Erreur lors du chargement des filtres', 'error');
        }
    }

    async loadDashboardPage() {
        const contentContainer = document.getElementById('content');
        if (!contentContainer) {
            throw new Error('Container de contenu non trouvé');
        }
        
        try {
            // Afficher un loader pendant le chargement
            contentContainer.innerHTML = `
                <div class="flex justify-center items-center h-64">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E67D23]"></div>
                </div>
            `;

            // Formater la date d'aujourd'hui au format YYYY-MM-DD
            const today = dateFormatter.toInputDate(new Date());
            
            // Charger les données depuis l'API
            const [etudiantsResponse, professeursResponse, coursResponse, absencesResponse] = await Promise.all([
                this.etudiantService.getEtudiants(),
                this.professeurService.getProfesseurs(),
                this.coursService.getCoursParDate(today),
                this.absenceService.getAbsences()
            ]);

            // S'assurer que nous avons des tableaux valides
            const etudiants = etudiantsResponse?.etudiants || [];
            const professeurs = professeursResponse?.professeurs || [];
            const cours = Array.isArray(coursResponse) ? coursResponse : [];
            const absences = absencesResponse?.absences || [];

            // Une fois les données chargées, mettre à jour le contenu
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
            document.getElementById('coursAujourdhui').textContent = cours.length;
            document.getElementById('totalAbsences').textContent = absences.length;

            // Afficher les cours du jour
            const coursJourTable = document.getElementById('coursJourTable');
            if (cours && cours.length > 0) {
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
                            ${cours.map(cours => `
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
            // Prendre les 5 dernières absences en triant d'abord par date
            const absencesRecentes = absences
                .sort((a, b) => new Date(b.dateAbs) - new Date(a.dateAbs))
                .slice(0, 5);
            
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
                                        ${absence.etudiant?.nomComplet || 'Non défini'}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        ${absence.seance?.cours?.libelle || 'Non défini'}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        ${new Date(absence.dateAbs).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            absence.statut === 'justifié' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }">
                                            ${absence.statut || 'Non défini'}
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
        this.classeService = new ClasseService();
    }

    async editProfesseur(id) {
        if (!this.checkPermission('edit_professeur')) return;
        
        try {
            const professeur = await this.professeurService.getProfesseurById(id);
            if (!professeur) throw new Error('Professeur non trouvé');
            
            await this.openProfesseurModal(id);
        } catch (error) {
            console.error('Erreur lors de l\'édition du professeur:', error);
            this.toast.show('Erreur lors de l\'édition du professeur', 'error');
        }
    }

    async deleteProfesseur(id) {
        if (!this.checkPermission('delete_professeur')) return;
        
        const confirmModal = new ConfirmModal();
        const confirmed = await confirmModal.render({
            title: 'Supprimer le professeur',
            message: 'Êtes-vous sûr de vouloir supprimer ce professeur ? Cette action est irréversible.',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            type: 'danger'
        });
        
        if (confirmed) {
            try {
                await this.professeurService.deleteProfesseur(id);
                this.toast.show('Professeur supprimé avec succès', 'success');
                await this.loadProfesseurData();
            } catch (error) {
                console.error('Erreur lors de la suppression du professeur:', error);
                this.toast.show('Erreur lors de la suppression du professeur', 'error');
            }
        }
    }

    async editEtudiant(id) {
        if (!this.checkPermission('edit_etudiant')) return;
        
        try {
            const etudiant = await this.etudiantService.getEtudiantById(id);
            if (!etudiant) throw new Error('Étudiant non trouvé');
            
            await this.openEtudiantModal(id);
        } catch (error) {
            console.error('Erreur lors de l\'édition de l\'étudiant:', error);
            this.toast.show('Erreur lors de l\'édition de l\'étudiant', 'error');
        }
    }

    async deleteEtudiant(id) {
        if (!this.checkPermission('delete_etudiant')) return;
        
        const confirmModal = new ConfirmModal();
        const confirmed = await confirmModal.render({
            title: 'Supprimer l\'étudiant',
            message: 'Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible.',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            type: 'danger'
        });
        
        if (confirmed) {
            try {
                await this.etudiantService.deleteEtudiant(id);
                this.toast.show('Étudiant supprimé avec succès', 'success');
                await this.loadEtudiantData();
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'étudiant:', error);
                this.toast.show('Erreur lors de la suppression de l\'étudiant', 'error');
            }
        }
    }

    async editSeance(id) {
        if (!this.checkPermission('edit_seance')) return;
        await this.openSeanceModal(id);
    }

    async deleteSeance(id) {
        if (!this.checkPermission('delete_seance')) return;
        
        const confirmModal = new ConfirmModal();
        const confirmed = await confirmModal.render({
            title: 'Supprimer la séance',
            message: 'Êtes-vous sûr de vouloir supprimer cette séance ? Cette action est irréversible.',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            type: 'danger'
        });
        
        if (confirmed) {
            try {
                await this.seanceService.deleteSeance(id);
                this.toast.show('Séance supprimée avec succès', 'success');
                await this.loadSeanceData();
            } catch (error) {
                console.error('Erreur lors de la suppression de la séance:', error);
                this.toast.show('Erreur lors de la suppression de la séance', 'error');
            }
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

    // Nouvelle méthode pour réinitialiser les composants
    resetComponents() {
        // Réinitialiser les tables
        this.coursTable = null;
        this.professeurTable = null;
        this.etudiantTable = null;
        this.seanceTable = null;
        this.absenceTable = null;
        
        // Réinitialiser les listes
        this.professeurList = null;
        this.etudiantList = null;
        this.seanceList = null;
        this.absenceList = null;
    }

    checkComponentsState() {
        console.log('État des composants:', {
            sidebar: !!this.sidebar,
            topbar: !!this.topbar,
            header: !!this.header,
            filters: !!this.filters,
            coursTable: !!this.coursTable,
            professeurTable: !!this.professeurTable,
            etudiantTable: !!this.etudiantTable,
            seanceTable: !!this.seanceTable,
            absenceTable: !!this.absenceTable
        });
    }

    logout() {
        this.authService.logout();
    }

    updateUIBasedOnPermissions() {
        const user = this.authService.getUser();
        
        // Cacher/Montrer les éléments selon le rôle
        document.querySelectorAll('[data-requires-role]').forEach(element => {
            const requiredRole = element.dataset.requiresRole;
            if (!this.authService.hasRole(requiredRole)) {
                element.style.display = 'none';
            }
        });

        // Mettre à jour le nom de l'utilisateur dans la topbar
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = `${user.prenom} ${user.nom}`;
        }
    }

    loadDashboard() {
        // ... code pour charger le tableau de bord ...
        someAsyncOperation()
            .then(response => {
                // ... traitement de la réponse ...
            })
            .catch(error => {
                console.error('Erreur lors du chargement du dashboard:', error);
                this.toast.show('Erreur lors du chargement du dashboard', 'error');
            });
    }

    async loadSeancesPage() {
        try {
            const contentContainer = document.getElementById('content');
            if (!contentContainer) {
                throw new Error('Container de contenu non trouvé');
            }

            contentContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-4 md:p-6 h-full">
                    <div class="mb-6">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div class="flex justify-between items-center w-full md:w-auto">
                                <h2 class="text-xl font-semibold">Liste des Séances</h2>
                                <!-- Bouton pour afficher/masquer les filtres sur mobile -->
                                <button id="toggleFilters" class="md:hidden text-gray-600 hover:text-gray-900">
                                    <i class="fas fa-filter"></i>
                                </button>
                            </div>
                            
                            <!-- Conteneur des filtres avec état masqué par défaut sur mobile -->
                            <div id="filtersContainer" class="hidden md:flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <div class="flex flex-wrap gap-2 items-center w-full md:w-auto">
                                    <input type="text" 
                                        id="searchSeance" 
                                        placeholder="Rechercher une séance..."
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm"
                                    >
                                    <select id="filterCours" 
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm">
                                        <option value="">Tous les cours</option>
                                    </select>
                                    <select id="filterStatut" 
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm">
                                        <option value="">Tous les statuts</option>
                                        <option value="en_cours">En cours</option>
                                        <option value="planifié">Planifié</option>
                                        <option value="terminé">Terminé</option>
                                    </select>
                                </div>
                                <button id="addSeanceBtn" class="w-full md:w-auto btn-primary whitespace-nowrap">
                                    <i class="fas fa-plus mr-2"></i>Ajouter une séance
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-x-auto -mx-4 md:mx-0">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50 hidden md:table-header-group">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Séance</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Professeur</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="seances-table-body" class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colspan="5" class="text-center py-4">
                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="pagination-container"></div>
                </div>
            `;

            // Initialiser la table des séances
            this.seanceTable = new SeanceTable('seances-table-body');
            
            // Configurer les filtres
            await this.setupSeanceFilters();
            
            // Charger les données initiales
            await this.loadSeanceData();
            
            // Configurer les événements
            this.setupSeanceEventListeners();

        } catch (error) {
            console.error('Erreur lors du chargement des séances:', error);
            this.toast.show('Erreur lors du chargement des séances', 'error');
        }
    }

    setupSeanceEventListeners() {
        // Recherche avec debounce
        const searchInput = document.getElementById('searchSeance');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.loadSeanceData();
            }, 300));
        }

        // Filtre par cours
        const filterCours = document.getElementById('filterCours');
        if (filterCours) {
            filterCours.addEventListener('change', () => this.loadSeanceData());
        }

        // Filtre par statut
        const filterStatut = document.getElementById('filterStatut');
        if (filterStatut) {
            filterStatut.addEventListener('change', () => this.loadSeanceData());
        }

        // Bouton d'ajout
        const addBtn = document.getElementById('addSeanceBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openSeanceModal());
        }

        // Toggle des filtres sur mobile
        const toggleFiltersBtn = document.getElementById('toggleFilters');
        const filtersContainer = document.getElementById('filtersContainer');
        
        if (toggleFiltersBtn && filtersContainer) {
            toggleFiltersBtn.addEventListener('click', () => {
                filtersContainer.classList.toggle('hidden');
                // Changer l'icône
                const icon = toggleFiltersBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-filter');
                    icon.classList.toggle('fa-times');
                }
            });
        }
    }

    async setupSeanceFilters() {
        try {
            // Charger les cours pour le filtre
            const coursResponse = await this.coursService.getAllCours();
            const cours = Array.isArray(coursResponse) ? coursResponse : [];
            
            const filterCours = document.getElementById('filterCours');
            if (filterCours && cours) {
                filterCours.innerHTML = '<option value="">Tous les cours</option>';
                cours.forEach(cours => {
                    const option = document.createElement('option');
                    option.value = cours.id;
                    option.textContent = cours.libelle;
                    filterCours.appendChild(option);
                });
            }

            // Configurer le filtre de statut
            const filterStatut = document.getElementById('filterStatut');
            if (filterStatut) {
                filterStatut.innerHTML = `
                    <option value="">Tous les statuts</option>
                    <option value="en_cours">En cours</option>
                    <option value="planifié">Planifié</option>
                    <option value="terminé">Terminé</option>
                `;
            }
        } catch (error) {
            console.error('Erreur lors de la configuration des filtres:', error);
            this.toast.show('Erreur lors du chargement des filtres', 'error');
        }
    }

    async loadSeanceData(filters = {}) {
        try {
            // Récupérer tous les filtres actifs
            const searchValue = document.getElementById('searchSeance')?.value;
            const coursId = document.getElementById('filterCours')?.value;
            const statut = document.getElementById('filterStatut')?.value;

            // Combiner les filtres existants avec les nouveaux
            const combinedFilters = {
                ...filters,
                ...(searchValue && { q: searchValue }),
                ...(coursId && { coursId }),
                ...(statut && { statut })
            };

            // Appliquer les filtres
            await this.seanceTable.render(combinedFilters);
        } catch (error) {
            console.error('Erreur lors du chargement des séances:', error);
            this.toast.show('Erreur lors du chargement des séances', 'error');
        }
    }

    async openSeanceModal(seanceId = null) {
        if (!this.checkPermission('edit_seance')) return;
        
        try {
            const seanceModal = new SeanceModal();
            if (seanceId) {
                const seance = await this.seanceService.getSeanceById(seanceId);
                if (!seance) {
                    throw new Error('Séance non trouvée');
                }
                await seanceModal.render(seance);
            } else {
                await seanceModal.render();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ouverture du modal:', error);
            this.toast.show('Erreur lors de l\'ouverture du formulaire', 'error');
        }
    }

    async viewSeanceDetails(seanceId) {
        try {
            const detailsModal = new SeanceDetailsModal();
            await detailsModal.render(seanceId);
        } catch (error) {
            console.error('Erreur lors de l\'affichage des détails de la séance:', error);
            this.toast.show('Erreur lors de l\'affichage des détails de la séance', 'error');
        }
    }

    async loadProfesseursPage() {
        try {
            const contentContainer = document.getElementById('content');
            if (!contentContainer) {
                throw new Error('Container de contenu non trouvé');
            }

            contentContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-4 md:p-6 h-full">
                    <div class="mb-6">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div class="flex justify-between items-center w-full md:w-auto">
                                <h2 class="text-xl font-semibold">Liste des Professeurs</h2>
                                <button id="toggleFilters" class="md:hidden text-gray-600 hover:text-gray-900">
                                    <i class="fas fa-filter"></i>
                                </button>
                            </div>
                            
                            <div id="filtersContainer" class="hidden md:flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <div class="flex flex-wrap gap-2 items-center w-full md:w-auto">
                                    <input type="text" 
                                        id="searchProfesseur" 
                                        placeholder="Rechercher un professeur..."
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm"
                                    >
                                    <select id="filterSpecialite" 
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm">
                                        <option value="">Toutes les spécialités</option>
                                    </select>
                                </div>
                                <button id="addProfesseurBtn" class="w-full md:w-auto btn-primary whitespace-nowrap">
                                    <i class="fas fa-plus mr-2"></i>Ajouter un professeur
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-x-auto -mx-4 md:mx-0">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Professeur</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spécialité</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="professeurs-table-body" class="bg-white divide-y divide-gray-200">
                                <!-- Le contenu sera chargé dynamiquement -->
                            </tbody>
                        </table>
                    </div>
                    <div id="pagination-container"></div>
                </div>
            `;

            // Initialiser la table des professeurs
            this.professeurTable = new ProfesseurTable('professeurs-table-body');
            
            // Configurer les filtres
            await this.setupProfesseurFilters();
            
            // Charger les données initiales
            await this.loadProfesseurData();
            
            // Configurer les événements
            this.setupProfesseurEventListeners();

        } catch (error) {
            console.error('Erreur lors du chargement des professeurs:', error);
            this.toast.show('Erreur lors du chargement des professeurs', 'error');
        }
    }

    async setupProfesseurFilters() {
        try {
            // Charger les spécialités pour le filtre
            const specialites = await this.professeurService.getAllSpecialites();
            const filterSpecialite = document.getElementById('filterSpecialite');
            if (filterSpecialite && specialites) {
                filterSpecialite.innerHTML = '<option value="">Toutes les spécialités</option>';
                specialites.forEach(specialite => {
                    const option = document.createElement('option');
                    option.value = specialite;
                    option.textContent = specialite;
                    filterSpecialite.appendChild(option);
                });
            }

            // Configurer les autres filtres si nécessaire
            const searchInput = document.getElementById('searchProfesseur');
            if (searchInput) {
                searchInput.addEventListener('input', this.debounce(() => {
                    this.loadProfesseurData();
                }, 300));
            }
        } catch (error) {
            console.error('Erreur lors de la configuration des filtres:', error);
            this.toast.show('Erreur lors du chargement des filtres', 'error');
        }
    }

    async loadProfesseurData(filters = {}) {
        try {
            // Récupérer tous les filtres actifs
            const searchValue = document.getElementById('searchProfesseur')?.value;
            const specialite = document.getElementById('filterSpecialite')?.value;

            // Combiner les filtres existants avec les nouveaux
            const combinedFilters = {
                ...filters,
                ...(searchValue && { q: searchValue }),
                ...(specialite && { specialite })
            };

            // Appliquer les filtres
            await this.professeurTable.render(combinedFilters);
        } catch (error) {
            console.error('Erreur lors du chargement des professeurs:', error);
            this.toast.show('Erreur lors du chargement des professeurs', 'error');
        }
    }

    async setupProfesseurEventListeners() {
        // Recherche avec debounce
        const searchInput = document.getElementById('searchProfesseur');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.loadProfesseurData();
            }, 300));
        }

        // Filtre par spécialité
        const filterSpecialite = document.getElementById('filterSpecialite');
        if (filterSpecialite) {
            filterSpecialite.addEventListener('change', () => this.loadProfesseurData());
        }

        // Bouton d'ajout
        const addBtn = document.getElementById('addProfesseurBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openProfesseurModal());
        }

        // Toggle des filtres sur mobile
        const toggleFiltersBtn = document.getElementById('toggleFilters');
        const filtersContainer = document.getElementById('filtersContainer');
        
        if (toggleFiltersBtn && filtersContainer) {
            toggleFiltersBtn.addEventListener('click', () => {
                filtersContainer.classList.toggle('hidden');
                const icon = toggleFiltersBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-filter');
                    icon.classList.toggle('fa-times');
                }
            });
        }
    }

    async openProfesseurModal(professeurId = null) {
        if (!this.checkPermission('edit_professeur')) return;
        
        try {
            const professeurModal = new ProfesseurModal();
            if (professeurId) {
                const professeur = await this.professeurService.getProfesseurById(professeurId);
                if (!professeur) {
                    throw new Error('Professeur non trouvé');
                }
                await professeurModal.render(professeur);
            } else {
                await professeurModal.render();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ouverture du modal:', error);
            this.toast.show('Erreur lors de l\'ouverture du formulaire', 'error');
        }
    }

    async viewProfesseurDetails(professeurId) {
        try {
            if (!professeurId) throw new Error('ID du professeur non fourni');
            
            const professeur = await this.professeurService.getProfesseursWithCours(professeurId);
            if (!professeur) throw new Error('Professeur non trouvé');

            const detailsModal = new ProfesseurDetailsModal();
            await detailsModal.render(professeurId);
        } catch (error) {
            console.error('Erreur lors de l\'affichage des détails du professeur:', error);
            this.toast.show('Erreur lors de l\'affichage des détails du professeur', 'error');
        }
    }

    async loadEtudiantsPage() {
        try {
            const contentContainer = document.getElementById('content');
            if (!contentContainer) {
                throw new Error('Container de contenu non trouvé');
            }

            contentContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-4 md:p-6 h-full">
                    <div class="mb-6">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div class="flex justify-between items-center w-full md:w-auto">
                                <h2 class="text-xl font-semibold">Liste des Étudiants</h2>
                                <button id="toggleFilters" class="md:hidden text-gray-600 hover:text-gray-900">
                                    <i class="fas fa-filter"></i>
                                </button>
                            </div>
                            
                            <div id="filtersContainer" class="hidden md:flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <div class="flex flex-wrap gap-2 items-center w-full md:w-auto">
                                    <input type="text" 
                                        id="searchEtudiant" 
                                        placeholder="Rechercher un étudiant..."
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm"
                                    >
                                    <select id="filterClasse" 
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm">
                                        <option value="">Toutes les classes</option>
                                    </select>
                                    <select id="filterStatut" 
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm">
                                        <option value="">Tous les statuts</option>
                                        <option value="actif">Actif</option>
                                        <option value="inactif">Inactif</option>
                                    </select>
                                </div>
                                <button id="addEtudiantBtn" class="w-full md:w-auto btn-primary whitespace-nowrap">
                                    <i class="fas fa-plus mr-2"></i>Ajouter un étudiant
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-x-auto -mx-4 md:mx-0">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="etudiants-table-body" class="bg-white divide-y divide-gray-200">
                                <!-- Le contenu sera chargé dynamiquement -->
                            </tbody>
                        </table>
                    </div>
                    <div id="pagination-container"></div>
                </div>
            `;

            // Initialiser la table des étudiants
            this.etudiantTable = new EtudiantTable('etudiants-table-body');
            
            // Configurer les filtres
            await this.setupEtudiantFilters();
            
            // Charger les données initiales
            await this.loadEtudiantData();
            
            // Configurer les événements
            this.setupEtudiantEventListeners();

        } catch (error) {
            console.error('Erreur lors du chargement des étudiants:', error);
            this.toast.show('Erreur lors du chargement des étudiants', 'error');
        }
    }

    async setupEtudiantFilters() {
        try {
            // Charger les classes pour le filtre
            const classesResponse = await this.classeService.getClasses();
            const filterClasse = document.getElementById('filterClasse');
            
            if (filterClasse && classesResponse.data) {
                // Vider d'abord le select
                filterClasse.innerHTML = '<option value="">Toutes les classes</option>';
                
                // Ajouter les options de classe
                classesResponse.data.forEach(classe => {
                    const option = document.createElement('option');
                    option.value = classe.id;
                    option.textContent = classe.nom;
                    filterClasse.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Erreur lors de la configuration des filtres:', error);
            this.toast.show('Erreur lors du chargement des filtres', 'error');
        }
    }

    async loadEtudiantData(filters = {}) {
        try {
            // Récupérer tous les filtres actifs
            const searchValue = document.getElementById('searchEtudiant')?.value;
            const classeId = document.getElementById('filterClasse')?.value;
            const statut = document.getElementById('filterStatut')?.value;

            // Combiner les filtres existants avec les nouveaux
            const combinedFilters = {
                ...filters,
                ...(searchValue && { q: searchValue }),
                ...(classeId && { classeId: parseInt(classeId) }), // Convertir en nombre
                ...(statut && { statut })
            };

            // Appliquer les filtres
            await this.etudiantTable.render(combinedFilters);
        } catch (error) {
            console.error('Erreur lors du chargement des étudiants:', error);
            this.toast.show('Erreur lors du chargement des étudiants', 'error');
        }
    }

    setupEtudiantEventListeners() {
        // Recherche avec debounce
        const searchInput = document.getElementById('searchEtudiant');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.loadEtudiantData();
            }, 300));
        }

        // Filtre par classe
        const filterClasse = document.getElementById('filterClasse');
        if (filterClasse) {
            filterClasse.addEventListener('change', () => this.loadEtudiantData());
        }

        // Filtre par statut
        const filterStatut = document.getElementById('filterStatut');
        if (filterStatut) {
            filterStatut.addEventListener('change', () => this.loadEtudiantData());
        }

        // Bouton d'ajout
        const addBtn = document.getElementById('addEtudiantBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openEtudiantModal());
        }

        // Toggle des filtres sur mobile
        const toggleFiltersBtn = document.getElementById('toggleFilters');
        const filtersContainer = document.getElementById('filtersContainer');
        
        if (toggleFiltersBtn && filtersContainer) {
            toggleFiltersBtn.addEventListener('click', () => {
                filtersContainer.classList.toggle('hidden');
                const icon = toggleFiltersBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-filter');
                    icon.classList.toggle('fa-times');
                }
            });
        }
    }

    async openEtudiantModal(etudiantId = null) {
        try {
            const etudiantModal = new EtudiantModal();
            if (etudiantId) {
                const etudiant = await this.etudiantService.getEtudiantById(etudiantId);
                if (!etudiant) {
                    throw new Error('Étudiant non trouvé');
                }
                await etudiantModal.render(etudiant);
            } else {
                await etudiantModal.render();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ouverture du modal:', error);
            this.toast.show('Erreur lors de l\'ouverture du formulaire', 'error');
        }
    }

    async viewEtudiantDetails(etudiantId) {
        try {
            if (!etudiantId) throw new Error('ID de l\'étudiant non fourni');
            
            const etudiant = await this.etudiantService.getEtudiantById(etudiantId);
            if (!etudiant) throw new Error('Étudiant non trouvé');

            const detailsModal = new EtudiantDetailsModal();
            await detailsModal.render(etudiantId);
        } catch (error) {
            console.error('Erreur lors de l\'affichage des détails de l\'étudiant:', error);
            this.toast.show('Erreur lors de l\'affichage des détails de l\'étudiant', 'error');
        }
    }

    async setupAbsenceFilters() {
        try {
            // Récupérer les étudiants pour le filtre
            const etudiantsResponse = await this.etudiantService.getEtudiants();
            const filterEtudiant = document.getElementById('filterEtudiant');
            
            if (filterEtudiant && etudiantsResponse.etudiants) {
                filterEtudiant.innerHTML = '<option value="">Tous les étudiants</option>';
                etudiantsResponse.etudiants.forEach(etudiant => {
                    const option = document.createElement('option');
                    option.value = etudiant.id;
                    option.textContent = etudiant.nomComplet;
                    filterEtudiant.appendChild(option);
                });
            }

            // Récupérer les cours pour le filtre
            const coursResponse = await this.coursService.getAllCours();
            const filterCours = document.getElementById('filterCours');
            
            if (filterCours && coursResponse) {
                filterCours.innerHTML = '<option value="">Tous les cours</option>';
                coursResponse.forEach(cours => {
                    const option = document.createElement('option');
                    option.value = cours.id;
                    option.textContent = cours.libelle;
                    filterCours.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Erreur lors de la configuration des filtres:', error);
            this.toast.show('Erreur lors du chargement des filtres', 'error');
        }
    }

    async loadAbsenceData(filters = {}) {
        try {
            console.log('Chargement des absences avec filtres:', filters); // Debug
            
            const response = await this.absenceService.getAbsences(filters);
            console.log('Réponse du service:', response); // Debug
            
            if (this.absenceTable) {
                await this.absenceTable.render(response);
            } else {
                console.error('absenceTable n\'est pas initialisé');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des absences:', error);
            this.toast.show('Erreur lors du chargement des absences', 'error');
        }
    }

    async viewAbsenceDetails(absenceId) {
        try {
            if (!absenceId) throw new Error('ID de l\'absence non fourni');
            
            const detailsModal = new AbsenceDetailsModal();
            await detailsModal.render(absenceId);
        } catch (error) {
            console.error('Erreur lors de l\'affichage des détails de l\'absence:', error);
            this.toast.show('Erreur lors de l\'affichage des détails', 'error');
        }
    }

    async openAbsenceModal(seanceId = null, absenceId = null) {
        try {
            const absenceModal = new AbsenceModal();
            if (absenceId) {
                const absence = await this.absenceService.getAbsenceById(absenceId);
                if (!absence) throw new Error('Absence non trouvée');
                await absenceModal.render(absence);
            } else {
                await absenceModal.render(null, seanceId);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ouverture du modal:', error);
            this.toast.show('Erreur lors de l\'ouverture du formulaire', 'error');
        }
    }

    async justifierAbsence(absenceId) {
        if (!this.checkPermission('edit_absence')) return;
        
        try {
            const absence = await this.absenceService.getAbsenceById(absenceId);
            if (!absence) throw new Error('Absence non trouvée');

            const justificationModal = new JustificationModal();
            await justificationModal.render(absenceId);
        } catch (error) {
            console.error('Erreur lors de la justification:', error);
            this.toast.show('Erreur lors de la justification', 'error');
        }
    }

    async deleteAbsence(absenceId) {
        if (!this.checkPermission('delete_absence')) return;
        
        const confirmModal = new ConfirmModal();
        const confirmed = await confirmModal.render({
            title: 'Supprimer l\'absence',
            message: 'Êtes-vous sûr de vouloir supprimer cette absence ? Cette action est irréversible.',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            type: 'danger'
        });
        
        if (confirmed) {
            try {
                await this.absenceService.deleteAbsence(absenceId);
                this.toast.show('Absence supprimée avec succès', 'success');
                await this.loadAbsenceData();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                this.toast.show('Erreur lors de la suppression', 'error');
            }
        }
    }

    async loadClassesPage() {
        try {
            const contentContainer = document.getElementById('content');
            if (!contentContainer) {
                throw new Error('Container de contenu non trouvé');
            }

            contentContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-4 md:p-6 h-full">
                    <div class="mb-6">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div class="flex justify-between items-center w-full md:w-auto">
                                <h2 class="text-xl font-semibold">Liste des Classes</h2>
                                <button id="toggleFilters" class="md:hidden text-gray-600 hover:text-gray-900">
                                    <i class="fas fa-filter"></i>
                                </button>
                            </div>
                            
                            <div id="filtersContainer" class="hidden md:flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <div class="flex flex-wrap gap-2 items-center w-full md:w-auto">
                                    <input type="text" 
                                        id="searchClasse" 
                                        placeholder="Rechercher une classe..."
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm"
                                    >
                                    <select id="filterNiveau" 
                                        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67D23] focus:ring-opacity-50 text-sm">
                                        <option value="">Tous les niveaux</option>
                                        <option value="Niveau 1">Niveau 1</option>
                                        <option value="Niveau 2">Niveau 2</option>
                                        <option value="Niveau 3">Niveau 3</option>
                                    </select>
                                </div>
                                <button id="addClasseBtn" class="w-full md:w-auto btn-primary whitespace-nowrap">
                                    <i class="fas fa-plus mr-2"></i>Ajouter une classe
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-x-auto -mx-4 md:mx-0">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effectif</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="classes-table-body" class="bg-white divide-y divide-gray-200">
                                <!-- Le contenu sera chargé dynamiquement -->
                            </tbody>
                        </table>
                    </div>
                    <div id="pagination-container"></div>
                </div>
            `;

            // Initialiser la table des classes
            this.classeTable = new ClasseTable('classes-table-body');
            
            // Charger les données initiales
            await this.loadClasseData();
            
            // Configurer les événements
            this.setupClasseEventListeners();

        } catch (error) {
            console.error('Erreur lors du chargement des classes:', error);
            this.toast.show('Erreur lors du chargement des classes', 'error');
        }
    }

    async loadClasseData(filters = {}) {
        try {
            // Récupérer tous les filtres actifs
            const searchValue = document.getElementById('searchClasse')?.value;
            const niveau = document.getElementById('filterNiveau')?.value;

            // Combiner les filtres existants avec les nouveaux
            const combinedFilters = {
                ...filters,
                ...(searchValue && { q: searchValue }),
                ...(niveau && { niveau })
            };

            // Appliquer les filtres
            await this.classeTable.render(combinedFilters);
        } catch (error) {
            console.error('Erreur lors du chargement des classes:', error);
            this.toast.show('Erreur lors du chargement des classes', 'error');
        }
    }

    setupClasseEventListeners() {
        // Recherche avec debounce
        const searchInput = document.getElementById('searchClasse');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.loadClasseData();
            }, 300));
        }

        // Filtre par niveau
        const filterNiveau = document.getElementById('filterNiveau');
        if (filterNiveau) {
            filterNiveau.addEventListener('change', () => this.loadClasseData());
        }

        // Bouton d'ajout
        const addBtn = document.getElementById('addClasseBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openClasseModal());
        }

        // Toggle des filtres sur mobile
        const toggleFiltersBtn = document.getElementById('toggleFilters');
        const filtersContainer = document.getElementById('filtersContainer');
        
        if (toggleFiltersBtn && filtersContainer) {
            toggleFiltersBtn.addEventListener('click', () => {
                filtersContainer.classList.toggle('hidden');
                const icon = toggleFiltersBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-filter');
                    icon.classList.toggle('fa-times');
                }
            });
        }
    }

    async openClasseModal(classeId = null) {
        try {
            const classeModal = new ClasseModal();
            if (classeId) {
                const classe = await this.classeService.getClasseById(classeId);
                if (!classe) {
                    throw new Error('Classe non trouvée');
                }
                await classeModal.render(classe);
            } else {
                await classeModal.render();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ouverture du modal:', error);
            this.toast.show('Erreur lors de l\'ouverture du formulaire', 'error');
        }
    }

    async editClasse(id) {
        if (!this.checkPermission('edit_classe')) return;
        await this.openClasseModal(id);
    }

    async deleteClasse(id) {
        if (!this.checkPermission('delete_classe')) return;
        
        const confirmModal = new ConfirmModal();
        const confirmed = await confirmModal.render({
            title: 'Supprimer la classe',
            message: 'Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible.',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            type: 'danger'
        });
        
        if (confirmed) {
            try {
                await this.classeService.deleteClasse(id);
                this.toast.show('Classe supprimée avec succès', 'success');
                await this.loadClasseData();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                this.toast.show('Erreur lors de la suppression', 'error');
            }
        }
    }

    async viewClasseDetails(classeId) {
        try {
            const detailsModal = new ClasseDetailsModal();
            await detailsModal.render(classeId);
        } catch (error) {
            console.error('Erreur lors de l\'affichage des détails de la classe:', error);
            this.toast.show('Erreur lors de l\'affichage des détails', 'error');
        }
    }

    async removeEtudiantFromClasse(etudiantId, classeId) {
        const confirmModal = new ConfirmModal();
        const confirmed = await confirmModal.render({
            title: 'Retirer l\'étudiant',
            message: 'Êtes-vous sûr de vouloir retirer cet étudiant de la classe ?',
            confirmText: 'Retirer',
            cancelText: 'Annuler',
            type: 'warning'
        });
        
        if (confirmed) {
            try {
                await this.etudiantService.updateEtudiant(etudiantId, { classeId: null });
                this.toast.show('Étudiant retiré avec succès', 'success');
                await this.viewClasseDetails(classeId);
            } catch (error) {
                console.error('Erreur lors du retrait de l\'étudiant:', error);
                this.toast.show('Erreur lors du retrait de l\'étudiant', 'error');
            }
        }
    }

    async openAddEtudiantToClasseModal(classeId) {
        try {
            const etudiants = await this.etudiantService.getEtudiantsSansClasse();
            if (!etudiants || etudiants.length === 0) {
                this.toast.show('Aucun étudiant disponible à ajouter', 'info');
                return;
            }
            
            const modal = new AddEtudiantToClasseModal();
            await modal.render(classeId, etudiants);
        } catch (error) {
            console.error('Erreur lors de l\'ouverture du modal:', error);
            this.toast.show('Erreur lors de l\'ouverture du formulaire', 'error');
        }
    }
} 