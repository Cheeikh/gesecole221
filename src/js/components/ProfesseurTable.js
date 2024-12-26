export class ProfesseurTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(professeurs) {
        if (!this.container) return;

        if (!professeurs || professeurs.length === 0) {
            this.container.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4 text-gray-500">
                        <i class="fas fa-user-times text-4xl mb-2"></i>
                        <p>Aucun professeur trouvé</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.container.innerHTML = professeurs.map(professeur => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                        ${professeur.nom || 'Non défini'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                        ${professeur.prenom || 'Non défini'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                        ${professeur.specialite || 'Non défini'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="app.editProfesseur(${professeur.id})" class="text-indigo-600 hover:text-indigo-900 mr-2">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="app.deleteProfesseur(${professeur.id})" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
} 