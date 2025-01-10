import { dataProvider } from '../providers/DataProvider.js';
import { dateFormatter } from '../utils/dateFormatter.js';

export class CoursService {
    async getCours(params = {}) {
        try {
            const { page = 1, limit = 10, q, classeId, professeurId, statut, ...otherParams } = params;
            
            let queryParams = {
                _page: page,
                _limit: limit,
                ...otherParams
            };

            // Ajouter les filtres spécifiques
            if (q) queryParams.q = q;
            if (classeId) queryParams.classeId = classeId;
            if (professeurId) queryParams.professeurId = professeurId;
            if (statut) queryParams.statut = statut;

            const response = await dataProvider.getCours(queryParams);
            
            return {
                cours: response.data,
                total: response.total,
                currentPage: page,
                totalPages: Math.ceil(response.total / limit)
            };
        } catch (error) {
            console.error('Erreur dans getCours:', error);
            throw error;
        }
    }

    async getCoursById(id) {
        return dataProvider.getCoursById(id);
    }

    async createCours(data) {
        return dataProvider.create('/cours', data);
    }

    async updateCours(id, data) {
        return dataProvider.update('/cours', id, data);
    }

    async deleteCours(id) {
        return dataProvider.delete('/cours', id);
    }

    async getCoursParDate(date) {
        const formattedDate = dateFormatter.toInputDate(new Date(date));
        return dataProvider.getCours({ dateCours: formattedDate });
    }

    async getAllCours() {
        try {
            const response = await dataProvider.get('/cours', {
                _sort: 'libelle',
                _order: 'asc',
                _expand: ['professeur']
            });
            
            return response.data || [];
        } catch (error) {
            console.error('Erreur dans getAllCours:', error);
            return [];
        }
    }
} 