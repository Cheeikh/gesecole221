import { ApiClient, API_CONFIG } from '../api/config.js';

export class SeanceService {
    async getSeances(params = {}) {
        try {
            const seances = await ApiClient.get(API_CONFIG.ENDPOINTS.SEANCES, params);
            
            // Enrichir les séances avec les données associées
            const seancesEnrichies = await Promise.all(seances.map(async (seance) => {
                const [cours, absences] = await Promise.all([
                    ApiClient.get(`${API_CONFIG.ENDPOINTS.COURS}/${seance.coursId}`),
                    ApiClient.get(`${API_CONFIG.ENDPOINTS.SEANCES}/${seance.id}/absences`)
                ]);
                
                return {
                    ...seance,
                    cours,
                    absences
                };
            }));
            
            return seancesEnrichies;
        } catch (error) {
            console.error('Erreur lors du chargement des séances:', error);
            throw error;
        }
    }

    async getSeancesParCours(coursId) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.SEANCES}/cours/${coursId}`);
    }

    async getSeancesParDate(date) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.SEANCES}/date/${date}`);
    }

    async getSeancesParSalle(salle) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.SEANCES}/salle/${salle}`);
    }

    async createSeance(seanceData) {
        return ApiClient.post(API_CONFIG.ENDPOINTS.SEANCES, seanceData);
    }

    async updateSeance(id, seanceData) {
        return ApiClient.put(`${API_CONFIG.ENDPOINTS.SEANCES}/${id}`, seanceData);
    }

    async deleteSeance(id) {
        return ApiClient.delete(`${API_CONFIG.ENDPOINTS.SEANCES}/${id}`);
    }
} 