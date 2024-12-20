export class SeanceList {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(seances) {
        if (!seances || seances.length === 0) {
            this.container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-clock text-4xl mb-4"></i>
                    <p>Aucune séance trouvée</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
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
                <tbody class="bg-white divide-y divide-gray-200">
                    ${seances.map(seance => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${seance.cours?.libelle || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${new Date(seance.date).toLocaleDateString('fr-FR')}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${seance.heureDebut} - ${seance.heureFin}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${seance.professeur?.nom || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button class="text-blue-600 hover:text-blue-800 mr-2" onclick="editSeance(${seance.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="text-red-600 hover:text-red-800" onclick="deleteSeance(${seance.id})">
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