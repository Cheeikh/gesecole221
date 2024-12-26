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

export class App {
    constructor() {
        try {
            this.authService = new AuthService();
            
            // Vérifier l'authentification
            if (!this.authService.isAuthenticated()) {
                window.location.href = '/login.html';
                return;
            }

            // Initialiser le gestionnaire de toast en premier
            this.toast = new ToastManager();
            
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
        try {
            // Mettre à jour le titre
            this.header.setTitle(this.getPageTitle(pageId));
            
            // Récupérer le container de contenu
            const contentContainer = document.getElementById('content');
            if (!contentContainer) {
                throw new Error('Container de contenu non trouvé');
            }
            
            // Afficher le loader
            contentContainer.innerHTML = `
                <div class="flex justify-center items-center h-64">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E67D23]"></div>
                </div>
            `;
            
            // Réinitialiser les composants existants
            this.resetComponents();
            
            // Charger la nouvelle page
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

            // Gérer l'affichage des filtres
            const filtersContainer = document.getElementById('filters');
            if (filtersContainer) {
                filtersContainer.style.display = pageId === 'cours' ? 'block' : 'none';
            }

        } catch (error) {
            console.error('Erreur lors du changement de page:', error);
            this.toast.show('Erreur lors du chargement de la page: ' + error.message, 'error');
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
        if (!this.checkPermission('view_cours')) return;
        try {
            const contentContainer = document.getElementById('content');
            if (!contentContainer) {
                throw new Error('Container de contenu non trouvé');
            }

            contentContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <div class="mb-6">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h2 class="text-xl font-semibold">Liste des Cours</h2>
                            <div class="flex flex-col md:flex-row gap-4">
                                <div class="flex gap-2">
                                    <input type="text" id="searchCours" placeholder="Rechercher un cours..."
                                        class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <select id="filterProfesseur" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="">Tous les professeurs</option>
                                    </select>
                                    <select id="filterStatut" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="">Tous les statuts</option>
                                        <option value="en_cours">En cours</option>
                                        <option value="planifié">Planifié</option>
                                        <option value="terminé">Terminé</option>
                                    </select>
                                </div>
                                <button id="addCoursBtn" class="btn-primary">
                                    <i class="fas fa-plus mr-2"></i>Ajouter un cours
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead>
                                <tr class="bg-gray-50">
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cours</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Professeur</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coefficient</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
            `;

            // Initialiser la table
            this.coursTable = new CoursTable('cours-table-body');
            
            // Charger les données initiales
            await this.loadCoursData();
            
            // Configurer les filtres
            await this.setupCoursFilters();
            
            // Configurer les événements
            this.setupCoursEventListeners();

        } catch (error) {
            console.error('Erreur lors du chargement de la page des cours:', error);
            this.toast.show('Erreur lors du chargement de la page des cours', 'error');
        }
    }

    async loadCoursData(filters = {}) {
        try {
            const cours = await this.coursService.getCours(filters);
            if (this.coursTable) {
                this.coursTable.render(cours);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des cours:', error);
            this.toast.show('Erreur lors du chargement des cours', 'error');
        }
    }

    async setupCoursFilters() {
        try {
            // Charger les professeurs pour le filtre
            const professeurs = await this.professeurService.getProfesseurs();
            const filterProfesseur = document.getElementById('filterProfesseur');
            
            if (filterProfesseur) {
                professeurs.forEach(prof => {
                    const option = document.createElement('option');
                    option.value = prof.id;
                    option.textContent = `${prof.nom} ${prof.prenom}`;
                    filterProfesseur.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Erreur lors de la configuration des filtres:', error);
        }
    }

    setupCoursEventListeners() {
        // Bouton d'ajout
        const addBtn = document.getElementById('addCoursBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openCoursModal());
        }

        // Recherche
        const searchInput = document.getElementById('searchCours');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.loadCoursData({ q: searchInput.value });
            }, 300));
        }

        // Filtres
        const filterProfesseur = document.getElementById('filterProfesseur');
        const filterStatut = document.getElementById('filterStatut');

        if (filterProfesseur) {
            filterProfesseur.addEventListener('change', () => {
                this.loadCoursData({
                    professeurId: filterProfesseur.value,
                    statut: filterStatut.value
                });
            });
        }

        if (filterStatut) {
            filterStatut.addEventListener('change', () => {
                this.loadCoursData({
                    professeurId: filterProfesseur.value,
                    statut: filterStatut.value
                });
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

    async editCours(id) {
        if (!this.checkPermission('edit_cours')) return;
        await this.openCoursModal(id);
    }

    async deleteCours(id) {
        if (!this.checkPermission('edit_cours')) return;
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;
        
        try {
            await this.coursService.deleteCours(id);
            this.toast.show('Cours supprimé avec succès', 'success');
            this.loadCoursData();
        } catch (error) {
            console.error('Erreur lors de la suppression du cours:', error);
            this.toast.show('Erreur lors de la suppression du cours', 'error');
        }
    }

    async loadProfesseursPage() {
        try {
            const contentContainer = document.getElementById('content');
            if (!contentContainer) {
                throw new Error('Container de contenu non trouvé');
            }

            // Afficher le loader
            contentContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <div class="mb-4 flex justify-between items-center">
                        <h2 class="text-xl font-semibold">Liste des Professeurs</h2>
                        <button class="btn-primary" id="addProfesseurBtn">
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

            // Initialiser la table des professeurs
            this.professeurTable = new ProfesseurTable('professeurs-table-body');
            
            // Charger les données
            console.log('Chargement des professeurs...');
            const professeurs = await this.professeurService.getProfesseurs();
            console.log('Professeurs reçus:', professeurs);

            if (this.professeurTable && professeurs) {
                this.professeurTable.render(professeurs);
            } else {
                throw new Error('Erreur lors du rendu des professeurs');
            }

            // Ajouter l'écouteur pour le bouton d'ajout
            const addProfesseurBtn = document.getElementById('addProfesseurBtn');
            if (addProfesseurBtn) {
                addProfesseurBtn.addEventListener('click', () => {
                    // Implémenter l'ouverture du modal d'ajout
                    console.log('Ouvrir le modal d\'ajout de professeur');
                });
            }

        } catch (error) {
            console.error('Erreur lors du chargement des professeurs:', error);
            this.toast.show('Erreur lors du chargement des professeurs: ' + error.message, 'error');
            
            const tableBody = document.getElementById('professeurs-table-body');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center py-4 text-red-500">
                            <i class="fas fa-exclamation-circle text-4xl mb-2"></i>
                            <p>Erreur lors du chargement des professeurs</p>
                            <p class="text-sm">${error.message}</p>
                        </td>
                    </tr>
                `;
            }
        }
    }

    async loadEtudiantsPage() {
        try {
            const contentContainer = document.getElementById('content');
            if (!contentContainer) {
                throw new Error('Container de contenu non trouvé');
            }

            // Afficher le loader
            contentContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <div class="mb-4 flex justify-between items-center">
                        <h2 class="text-xl font-semibold">Liste des Étudiants</h2>
                        <button class="btn-primary" id="addEtudiantBtn">
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
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="etudiants-table-body">
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

            // Initialiser la table des étudiants
            this.etudiantTable = new EtudiantTable('etudiants-table-body');
            
            // Charger les données
            console.log('Chargement des étudiants...');
            const etudiants = await this.etudiantService.getEtudiants();
            console.log('Étudiants reçus:', etudiants);

            if (this.etudiantTable && etudiants) {
                this.etudiantTable.render(etudiants);
            } else {
                throw new Error('Erreur lors du rendu des étudiants');
            }

            // Ajouter l'écouteur pour le bouton d'ajout
            const addEtudiantBtn = document.getElementById('addEtudiantBtn');
            if (addEtudiantBtn) {
                addEtudiantBtn.addEventListener('click', () => {
                    // Implémenter l'ouverture du modal d'ajout
                    console.log('Ouvrir le modal d\'ajout d\'étudiant');
                });
            }

        } catch (error) {
            console.error('Erreur lors du chargement des étudiants:', error);
            this.toast.show('Erreur lors du chargement des étudiants: ' + error.message, 'error');
            
            const tableBody = document.getElementById('etudiants-table-body');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center py-4 text-red-500">
                            <i class="fas fa-exclamation-circle text-4xl mb-2"></i>
                            <p>Erreur lors du chargement des étudiants</p>
                            <p class="text-sm">${error.message}</p>
                        </td>
                    </tr>
                `;
            }
        }
    }

    async loadSeancesPage() {
        try {
            const contentContainer = document.getElementById('content');
            if (!contentContainer) {
                throw new Error('Container de contenu non trouvé');
            }

            // Afficher le loader
            contentContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <div class="mb-4 flex justify-between items-center">
                        <h2 class="text-xl font-semibold">Liste des Séances</h2>
                        <button class="btn-primary" id="addSeanceBtn">
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

            // Initialiser la table des séances
            this.seanceTable = new SeanceTable('seances-table-body');
            
            // Charger les données avec un délai pour voir le loader
            console.log('Chargement des séances...');
            const seances = await this.seanceService.getSeances();
            console.log('Séances reçues:', seances);

            if (this.seanceTable && seances) {
                this.seanceTable.render(seances);
            } else {
                throw new Error('Erreur lors du rendu des séances');
            }

            // Ajouter l'écouteur pour le bouton d'ajout
            const addSeanceBtn = document.getElementById('addSeanceBtn');
            if (addSeanceBtn) {
                addSeanceBtn.addEventListener('click', () => {
                    // Implémenter l'ouverture du modal d'ajout
                    console.log('Ouvrir le modal d\'ajout de séance');
                });
            }

        } catch (error) {
            console.error('Erreur lors du chargement des séances:', error);
            this.toast.show('Erreur lors du chargement des séances: ' + error.message, 'error');
            
            const tableBody = document.getElementById('seances-table-body');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center py-4 text-red-500">
                            <i class="fas fa-exclamation-circle text-4xl mb-2"></i>
                            <p>Erreur lors du chargement des séances</p>
                            <p class="text-sm">${error.message}</p>
                        </td>
                    </tr>
                `;
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
                </div>
            `;

            // Initialiser la table des absences
            this.absenceTable = new AbsenceTable('absences-table-body');
            
            // Charger les données
            const absences = await this.absenceService.getAbsences();
            if (this.absenceTable && absences) {
                this.absenceTable.render(absences);
            }

        } catch (error) {
            console.error('Erreur lors du chargement des absences:', error);
            this.toast.show('Erreur lors du chargement des absences: ' + error.message, 'error');
        }
    }

    async loadDashboardPage() {
        const contentContainer = document.getElementById('content');
        
        try {
            // Formater la date d'aujourd'hui au format YYYY-MM-DD
            const today = dateFormatter.toInputDate(new Date());
            
            // Charger les données depuis l'API
            const [etudiants, professeurs, coursAujourdhui, absences] = await Promise.all([
                this.etudiantService.getEtudiants(),
                this.professeurService.getProfesseurs(),
                this.coursService.getCoursParDate(today),
                this.absenceService.getAbsences()
            ]).catch(error => {
                console.error('Erreur lors du chargement des données:', error);
                return [[], [], [], []]; // Retourner des tableaux vides en cas d'erreur
            });

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
            if (coursAujourdhui && coursAujourdhui.length > 0) {
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
            if (contentContainer) {
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

    checkPermission(permission) {
        if (!this.authService.hasPermission(permission)) {
            this.toast.show('Vous n\'avez pas les permissions nécessaires', 'error');
            return false;
        }
        return true;
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
} 