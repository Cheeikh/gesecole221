export class PromotionService {
    static async getPromotions() {
        // Simulation d'appel API
        return [
            {
                id: 1,
                nom: "Promotion 6",
                dateDebut: "01/02/2024",
                dateFin: "31/11/2024",
                referentiels: ["DEV WEB/MOBILE", "DEV DATA", "REF OPS"],
                statut: "actif"
            },
            // ... autres promotions
        ];
    }

    static async createPromotion(promotion) {
        // Implémentation création
    }

    static async updatePromotion(id, promotion) {
        // Implémentation mise à jour
    }

    static async deletePromotion(id) {
        // Implémentation suppression
    }
} 