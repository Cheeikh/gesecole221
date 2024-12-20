export class ClasseTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    renderRow(classe) {
        return `
            <tr class="border-t">
                <td class="p-4">${classe.nom}</td>
                <td class="p-4">${classe.niveau}</td>
                <td class="p-4">${classe.nombreEtudiants}</td>
                <td class="p-4">${classe.professeurPrincipal}</td>
                <td class="p-4">
                    <div class="flex gap-2">
                        <button class="text-blue-600 hover:text-blue-800">Éditer</button>
                        <button class="text-red-600 hover:text-red-800">Supprimer</button>
                        <button class="text-green-600 hover:text-green-800">Voir détails</button>
                    </div>
                </td>
            </tr>
        `;
    }

    render(classes) {
        this.container.innerHTML = classes.map(c => this.renderRow(c)).join('');
    }
} 