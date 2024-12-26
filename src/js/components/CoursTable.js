export class CoursTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(cours) {
        if (!this.container) return;

        if (!cours || cours.length === 0) {
            this.container.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-gray-500">
                        <i class="fas fa-book text-4xl mb-2"></i>
                        <p>Aucun cours trouvé</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.container.innerHTML = cours.map(cours => `
            <tr class="hover:bg-gray-50 cursor-pointer" onclick="app.viewCoursDetails(${cours.id})">
                <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">
                        ${cours.libelle || 'Non défini'}
                    </div>
                    <div class="text-xs text-gray-500">
                        ${cours.description || ''}
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                        ${cours.professeur ? `${cours.professeur.nom} ${cours.professeur.prenom}` : 'Non défini'}
                    </div>
                    <div class="text-xs text-gray-500">
                        ${cours.professeur?.specialite || ''}
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                        ${cours.dateCours ? new Date(cours.dateCours).toLocaleDateString('fr-FR') : 'Non défini'}
                    </div>
                    <div class="text-xs text-gray-500">
                        ${cours.heureDebut || ''} - ${cours.heureFin || ''}
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                        ${cours.heuresTotal || 0}h
                    </div>
                    <div class="text-xs text-gray-500">
                        Coef: ${cours.coefficient || 1}
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs font-medium rounded-full 
                        ${this.getStatusColor(cours.statut)}">
                        ${this.formatStatus(cours.statut)}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button onclick="event.stopPropagation(); app.editCours(${cours.id})" 
                            class="text-blue-600 hover:text-blue-900 mr-2">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="event.stopPropagation(); app.deleteCours(${cours.id})" 
                            class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getStatusColor(statut) {
        switch (statut) {
            case 'en_cours':
                return 'bg-green-100 text-green-800';
            case 'planifié':
                return 'bg-yellow-100 text-yellow-800';
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