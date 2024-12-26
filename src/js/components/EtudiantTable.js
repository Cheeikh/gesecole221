export class EtudiantTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(etudiants) {
        if (!this.container) return;

        if (!etudiants || etudiants.length === 0) {
            this.container.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-gray-500">
                        <i class="fas fa-user-graduate text-4xl mb-2"></i>
                        <p>Aucun étudiant trouvé</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.container.innerHTML = etudiants.map(etudiant => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                        ${etudiant.matricule || 'Non défini'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                        ${etudiant.nomComplet || 'Non défini'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                        ${etudiant.classe?.nom || 'Non défini'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${etudiant.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${etudiant.statut || 'Non défini'}
                        </span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="app.editEtudiant(${etudiant.id})" class="text-indigo-600 hover:text-indigo-900 mr-2">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="app.deleteEtudiant(${etudiant.id})" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
} 