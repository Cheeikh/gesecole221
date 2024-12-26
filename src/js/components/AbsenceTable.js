export class AbsenceTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(absences) {
        if (!this.container) return;

        if (!absences || absences.length === 0) {
            this.container.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-gray-500">
                        <i class="fas fa-calendar-check text-4xl mb-2"></i>
                        <p>Aucune absence enregistrée</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.container.innerHTML = absences.map(absence => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                        ${absence.etudiant?.nomComplet || 'Non défini'}
                    </div>
                    <div class="text-xs text-gray-500">
                        ${absence.etudiant?.matricule || ''}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                        ${absence.seance?.cours?.libelle || 'Non défini'}
                    </div>
                    <div class="text-xs text-gray-500">
                        Salle: ${absence.seance?.salle || 'Non définie'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                        ${absence.dateAbs ? new Date(absence.dateAbs).toLocaleDateString('fr-FR') : 'Non défini'}
                    </div>
                    <div class="text-xs text-gray-500">
                        ${absence.seance?.heureDebut || ''} - ${absence.seance?.heureFin || ''}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${this.getStatusColor(absence.statut)}">
                            ${this.formatStatus(absence.statut)}
                        </span>
                    </div>
                    ${absence.dateJustification ? `
                        <div class="text-xs text-gray-500">
                            Justifié le: ${new Date(absence.dateJustification).toLocaleDateString('fr-FR')}
                        </div>
                    ` : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${this.renderActions(absence)}
                </td>
            </tr>
        `).join('');
    }

    getStatusColor(statut) {
        switch (statut) {
            case 'justifié':
                return 'bg-green-100 text-green-800';
            case 'non_justifié':
                return 'bg-red-100 text-red-800';
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    formatStatus(statut) {
        switch (statut) {
            case 'justifié':
                return 'Justifié';
            case 'non_justifié':
                return 'Non justifié';
            case 'en_attente':
                return 'En attente';
            default:
                return statut || 'Non défini';
        }
    }

    renderActions(absence) {
        const actions = [];

        // Bouton d'édition
        actions.push(`
            <button onclick="app.editAbsence(${absence.id})" class="text-indigo-600 hover:text-indigo-900 mr-2">
                <i class="fas fa-edit"></i>
            </button>
        `);

        // Bouton de justification si non justifié
        if (absence.statut === 'non_justifié') {
            actions.push(`
                <button onclick="app.justifierAbsence(${absence.id})" class="text-green-600 hover:text-green-900 mr-2">
                    <i class="fas fa-check-circle"></i>
                </button>
            `);
        }

        // Bouton de suppression
        actions.push(`
            <button onclick="app.deleteAbsence(${absence.id})" class="text-red-600 hover:text-red-900">
                <i class="fas fa-trash"></i>
            </button>
        `);

        return actions.join('');
    }
} 