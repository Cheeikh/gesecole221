import {Pagination} from "./ui/Pagination.js";

export class Dashboard {
    constructor() {
        this.limit = 2; // Limite fixe de 2 éléments
    }

    async loadCoursDuJour() {
        try {
            const today = new Date();
            const cours = await app.coursService.getCoursParDate(today);

            const coursContainer = document.getElementById('coursJourTable');
            if (!coursContainer) return;

            if (!cours || cours.length === 0) {
                coursContainer.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-calendar-times text-4xl mb-4"></i>
                        <div>Aucun cours prévu aujourd'hui</div>
                    </div>
                `;
                return;
            }

            // Limiter l'affichage aux 2 premiers éléments
            const coursToShow = cours.slice(0, this.limit);

            // Ajouter une classe pour le scroll uniquement si nécessaire
            const needsScroll = cours.length > this.limit;
            coursContainer.className = `${needsScroll ? 'max-h-[200px] overflow-y-auto' : ''}`;

            coursContainer.innerHTML = `
                <table class="min-w-full">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Cours</th>
                            <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Horaires</th>
                            <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Professeur</th>
                            <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cours.map(cours => this.renderCoursRow(cours)).join('')}
                    </tbody>
                </table>
            `;

        } catch (error) {
            console.error('Erreur lors du chargement des cours:', error);
            app.toast.show('Erreur lors du chargement des cours', 'error');
        }
    }

    async loadAbsencesRecentes() {
        try {
            const absencesResponse = await app.absenceService.getAbsences({
                _sort: 'dateAbs',
                _order: 'desc'
            });

            const absencesContainer = document.getElementById('absencesRecentesTable');
            if (!absencesContainer) return;

            const absences = absencesResponse.absences || [];

            if (absences.length === 0) {
                absencesContainer.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-check-circle text-4xl mb-4"></i>
                        <div>Aucune absence récente</div>
                    </div>
                `;
                return;
            }

            // Limiter l'affichage aux 2 premiers éléments
            const absencesToShow = absences.slice(0, this.limit);

            // Ajouter une classe pour le scroll uniquement si nécessaire
            const needsScroll = absences.length > this.limit;
            absencesContainer.className = `${needsScroll ? 'max-h-[200px] overflow-y-auto' : ''}`;

            absencesContainer.innerHTML = `
                <table class="min-w-full">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Étudiant</th>
                            <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Cours</th>
                            <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                            <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${absences.map(absence => this.renderAbsenceRow(absence)).join('')}
                    </tbody>
                </table>
            `;

        } catch (error) {
            console.error('Erreur lors du chargement des absences:', error);
            app.toast.show('Erreur lors du chargement des absences', 'error');
        }
    }

    renderCoursRow(cours) {
        return `
            <tr class="hover:bg-gray-50">
                <td class="py-3 px-4">
                    <div class="font-medium text-gray-800">${cours.libelle}</div>
                </td>
                <td class="py-3 px-4 text-gray-600">
                    ${cours.heureDebut} - ${cours.heureFin}
                </td>
                <td class="py-3 px-4 text-gray-600">
                    ${cours.professeur?.nom} ${cours.professeur?.prenom}
                </td>
                <td class="py-3 px-4">
                    <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(cours.statut)}">
                        ${this.formatStatus(cours.statut)}
                    </span>
                </td>
            </tr>
        `;
    }

    renderAbsenceRow(absence) {
        return `
            <tr class="hover:bg-gray-50">
                <td class="py-3 px-4">
                    <div class="font-medium text-gray-800">
                        ${absence.etudiant?.nomComplet || 'Non défini'}
                    </div>
                </td>
                <td class="py-3 px-4 text-gray-600">
                    ${absence.seance?.cours?.libelle || 'Non défini'}
                </td>
                <td class="py-3 px-4 text-gray-600">
                    ${new Date(absence.dateAbs).toLocaleDateString('fr-FR')}
                </td>
                <td class="py-3 px-4">
                    <span class="px-2 py-1 text-xs rounded-full ${
                        absence.statut === 'justifié' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }">
                        ${absence.statut}
                    </span>
                </td>
            </tr>
        `;
    }

    getStatusColor(statut) {
        switch (statut) {
            case 'en_cours':
                return 'bg-green-100 text-green-800';
            case 'planifié':
                return 'bg-blue-100 text-blue-800';
            case 'terminé':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    formatStatus(statut) {
        switch (statut) {
            case 'en_cours':
                return 'En cours';
            case 'planifié':
                return 'Planifié';
            case 'terminé':
                return 'Terminé';
            default:
                return statut || 'Non défini';
        }
    }
} 