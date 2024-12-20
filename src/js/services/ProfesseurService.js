import { ApiClient, API_CONFIG } from '../api/config.js';

export class ProfesseurService {
    async getProfesseurs(params = {}) {
        try {
            const professeurs = await ApiClient.get(API_CONFIG.ENDPOINTS.PROFESSEURS, params);
            
            // Enrichir les données des professeurs avec leurs cours
            const professeursEnrichis = await Promise.all(professeurs.map(async (professeur) => {
                const cours = await ApiClient.get(`${API_CONFIG.ENDPOINTS.PROFESSEURS}/${professeur.id}/cours`);
                return {
                    ...professeur,
                    cours
                };
            }));
            
            return professeursEnrichis;
        } catch (error) {
            console.error('Erreur lors du chargement des professeurs:', error);
            throw error;
        }
    }

    async getProfesseurParSpecialite(specialite) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.PROFESSEURS}/specialite/${specialite}`);
    }

    async getProfesseursActifs() {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.PROFESSEURS}/statut/actif`);
    }

    async createProfesseur(professeurData) {
        return ApiClient.post(API_CONFIG.ENDPOINTS.PROFESSEURS, professeurData);
    }

    async updateProfesseur(id, professeurData) {
        return ApiClient.put(`${API_CONFIG.ENDPOINTS.PROFESSEURS}/${id}`, professeurData);
    }

    async deleteProfesseur(id) {
        return ApiClient.delete(`${API_CONFIG.ENDPOINTS.PROFESSEURS}/${id}`);
    }
} 