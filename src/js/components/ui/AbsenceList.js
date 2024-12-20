export class AbsenceList {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(absences) {
        if (!absences || absences.length === 0) {
            this.container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-calendar-check text-4xl mb-4"></i>
                    <p>Aucune absence enregistrée</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
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
                <tbody class="bg-white divide-y divide-gray-200">
                    ${absences.map(absence => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${absence.etudiant?.nomComplet || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${absence.seance?.cours?.libelle || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${new Date(absence.date).toLocaleDateString('fr-FR')}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    absence.justifie ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }">
                                    ${absence.justifie ? 'Justifiée' : 'Non justifiée'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button class="text-blue-600 hover:text-blue-800 mr-2" onclick="editAbsence(${absence.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="text-red-600 hover:text-red-800" onclick="deleteAbsence(${absence.id})">
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