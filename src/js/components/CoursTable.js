export class CoursTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    getStatusBadge(statut) {
        const styles = {
            'planifié': 'bg-blue-100 text-blue-800',
            'en_cours': 'bg-green-100 text-green-800',
            'terminé': 'bg-gray-100 text-gray-800'
        };
        return `<span class="px-2 py-1 rounded-full text-xs font-medium ${styles[statut] || 'bg-gray-100 text-gray-800'}">
            ${statut.charAt(0).toUpperCase() + statut.slice(1)}
        </span>`;
    }

    renderRow(cours) {
        return `
            <tr class="border-t hover:bg-gray-50">
                <td class="p-4">
                    <div class="font-medium">${cours.libelle}</div>
                    <div class="text-sm text-gray-500">
                        ${cours.description || 'Aucune description'}
                    </div>
                </td>
                <td class="p-4">
                    ${new Date(cours.dateCours).toLocaleDateString('fr-FR')}
                </td>
                <td class="p-4">
                    ${cours.heureDebut} - ${cours.heureFin}
                </td>
                <td class="p-4">
                    <div>Coef. ${cours.coefficient}</div>
                    <div class="text-sm text-gray-500">${cours.heuresTotal}h total</div>
                </td>
                <td class="p-4">${this.getStatusBadge(cours.statut)}</td>
                <td class="p-4">
                    <div class="flex gap-2">
                        <button class="text-blue-600 hover:text-blue-800" 
                                onclick="app.editCours(${cours.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-800" 
                                onclick="app.deleteCours(${cours.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="text-green-600 hover:text-green-800" 
                                onclick="app.viewCourseDetails(${cours.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    render(cours) {
        if (!Array.isArray(cours) || !cours.length) {
            this.container.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8 text-gray-500">
                        <i class="fas fa-inbox text-4xl mb-4"></i>
                        <div>Aucun cours trouvé</div>
                    </td>
                </tr>
            `;
            return;
        }
        this.container.innerHTML = cours.map(c => this.renderRow(c)).join('');
    }
} 