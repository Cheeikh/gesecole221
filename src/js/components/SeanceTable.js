export class SeanceTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(seances) {
        if (!this.container) return;

        if (!seances || seances.length === 0) {
            this.container.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-gray-500">
                        <i class="fas fa-calendar-times text-4xl mb-2"></i>
                        <p>Aucune séance trouvée</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.container.innerHTML = seances.map(seance => {
            const cours = seance.cours || {};
            const professeur = seance.professeur || {};
            
            return `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">
                            ${cours.libelle || 'Non défini'}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            ${seance.date ? new Date(seance.date).toLocaleDateString('fr-FR') : 'Non défini'}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            ${seance.heureDebut && seance.heureFin ? `${seance.heureDebut} - ${seance.heureFin}` : 'Non défini'}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            ${professeur.nom ? `${professeur.nom} ${professeur.prenom || ''}` : 'Non défini'}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="app.editSeance(${seance.id})" class="text-indigo-600 hover:text-indigo-900 mr-2">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteSeance(${seance.id})" class="text-red-600 hover:text-red-900">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
} 