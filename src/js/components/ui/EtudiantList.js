export class EtudiantList {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(etudiants) {
        if (!etudiants || etudiants.length === 0) {
            this.container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-user-graduate text-4xl mb-4"></i>
                    <p>Aucun étudiant trouvé</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <table class="min-w-full">
                <thead>
                    <tr class="bg-gray-50">
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matricule</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom Complet</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${etudiants.map(etudiant => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${etudiant.matricule}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${etudiant.nomComplet}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${etudiant.classe}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button class="text-blue-600 hover:text-blue-800 mr-2" onclick="editEtudiant(${etudiant.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="text-red-600 hover:text-red-800" onclick="deleteEtudiant(${etudiant.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
} 