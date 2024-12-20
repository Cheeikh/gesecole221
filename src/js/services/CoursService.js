import { ApiClient, API_CONFIG } from '../api/config.js';

export class CoursService {
    async getCours(params = {}) {
        try {
            const cours = await ApiClient.get(API_CONFIG.ENDPOINTS.COURS, params);
            
            // Charger les données associées pour chaque cours
            const coursEnrichi = await Promise.all(cours.map(async (cours) => {
                const [professeur, classe] = await Promise.all([
                    ApiClient.get(`${API_CONFIG.ENDPOINTS.PROFESSEURS}/${cours.professeurId}`),
                    ApiClient.get(`${API_CONFIG.ENDPOINTS.CLASSES}/${cours.classeId}`)
                ]);
                
                return {
                    ...cours,
                    professeur,
                    classe,
                    seances: await this.getSeancesCours(cours.id)
                };
            }));
            
            return coursEnrichi;
        } catch (error) {
            console.error('Erreur lors du chargement des cours:', error);
            throw error;
        }
    }

    async getSeancesCours(coursId) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.COURS}/${coursId}/seances`);
    }

    async getCoursParProfesseur(professeurId) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.COURS}/professeur/${professeurId}`);
    }

    async getCoursParClasse(classeId) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.COURS}/classe/${classeId}`);
    }

    async getCoursParSemestre(semestreId) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.COURS}/semestre/${semestreId}`);
    }

    async getCoursParDate(date) {
        try {
            return await ApiClient.get(`${API_CONFIG.ENDPOINTS.COURS}?dateCours=${date}`);
        } catch (error) {
            console.error('Erreur lors de la récupération des cours par date:', error);
            throw error;
        }
    }

    async createCours(coursData) {
        return ApiClient.post(API_CONFIG.ENDPOINTS.COURS, coursData);
    }

    async updateCours(id, coursData) {
        return ApiClient.put(`${API_CONFIG.ENDPOINTS.COURS}/${id}`, coursData);
    }

    async deleteCours(id) {
        return ApiClient.delete(`${API_CONFIG.ENDPOINTS.COURS}/${id}`);
    }
} 