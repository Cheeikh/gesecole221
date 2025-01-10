import { dataProvider } from '../providers/DataProvider.js';

export class ProfesseurService {
    async getProfesseurs(params = {}) {
        try {
            const { page = 1, limit = 10, q, specialite, ...otherParams } = params;
            
            let queryParams = {
                _page: page,
                _limit: limit,
                ...otherParams
            };

            // Ajouter les filtres spécifiques
            if (q) queryParams.q = q;
            if (specialite) queryParams.specialite = specialite;

            const response = await dataProvider.get('/professeurs', queryParams);
            
            return {
                professeurs: response.data,
                total: response.total,
                currentPage: page,
                totalPages: Math.ceil(response.total / limit)
            };
        } catch (error) {
            console.error('Erreur dans getProfesseurs:', error);
            throw error;
        }
    }

    async getProfesseurById(id) {
        try {
            const response = await dataProvider.get(`/professeurs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur dans getProfesseurById:', error);
            throw error;
        }
    }

    async createProfesseur(professeurData) {
        return dataProvider.create('/professeurs', professeurData);
    }

    async updateProfesseur(id, professeurData) {
        return dataProvider.update('/professeurs', id, professeurData);
    }

    async deleteProfesseur(id) {
        return dataProvider.delete('/professeurs', id);
    }

    async getProfesseurParSpecialite(specialite) {
        return dataProvider.get(`/professeurs/specialite/${specialite}`);
    }

    async getProfesseursActifs() {
        return dataProvider.get(`/professeurs/statut/actif`);
    }

    async getAllSpecialites() {
        try {
            const response = await dataProvider.get('/professeurs');
            const professeurs = response.data;
            // Extraire les spécialités uniques
            const specialites = [...new Set(professeurs.map(p => p.specialite).filter(Boolean))];
            return specialites;
        } catch (error) {
            console.error('Erreur dans getAllSpecialites:', error);
            return [];
        }
    }

    async getProfesseursWithCours() {
        try {
            const response = await dataProvider.get('/professeurs', {
                _embed: ['cours']
            });
            return response.data;
        } catch (error) {
            console.error('Erreur dans getProfesseursWithCours:', error);
            throw error;
        }
    }
} 