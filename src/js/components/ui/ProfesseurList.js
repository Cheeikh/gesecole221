export class ProfesseurList {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(professeurs) {
        if (!professeurs || professeurs.length === 0) {
            this.container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-users text-4xl mb-4"></i>
                    <p>Aucun professeur trouvé</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <table class="min-w-full">
                <thead>
                    <tr class="bg-gray-50">
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spécialité</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${professeurs.map(professeur => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${professeur.nom}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${professeur.prenom}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${professeur.specialite}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button class="text-blue-600 hover:text-blue-800 mr-2" onclick="editProfesseur(${professeur.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="text-red-600 hover:text-red-800" onclick="deleteProfesseur(${professeur.id})">
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