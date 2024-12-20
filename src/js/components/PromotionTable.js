export class PromotionTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    renderRow(promotion) {
        return `
            <tr class="border-t">
                <td class="p-4">
                    <img src="${promotion.photo}" class="w-10 h-10 rounded-full">
                </td>
                <td class="p-4">${promotion.nom}</td>
                <td class="p-4">${promotion.dateDebut}</td>
                <td class="p-4">${promotion.dateFin}</td>
                <td class="p-4">
                    ${promotion.referentiels.map(ref => 
                        `<span class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">${ref}</span>`
                    ).join(' ')}
                </td>
                <td class="p-4">
                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full">${promotion.statut}</span>
                </td>
                <td class="p-4">
                    <button class="text-gray-600 hover:text-gray-900">•••</button>
                </td>
            </tr>
        `;
    }

    render(promotions) {
        this.container.innerHTML = promotions.map(p => this.renderRow(p)).join('');
    }
} 