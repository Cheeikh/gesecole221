import { ApiClient, API_CONFIG } from '../api/config.js';

export class EtudiantService {
    async getEtudiants(params = {}) {
        try {
            const etudiants = await ApiClient.get(API_CONFIG.ENDPOINTS.ETUDIANTS, params);
            
            // Enrichir les données des étudiants avec leurs absences et classe
            const etudiantsEnrichis = await Promise.all(etudiants.map(async (etudiant) => {
                const [absences, classe] = await Promise.all([
                    ApiClient.get(`${API_CONFIG.ENDPOINTS.ETUDIANTS}/${etudiant.id}/absences`),
                    ApiClient.get(`${API_CONFIG.ENDPOINTS.CLASSES}/${etudiant.classeId}`)
                ]);
                
                return {
                    ...etudiant,
                    absences,
                    classe
                };
            }));
            
            return etudiantsEnrichis;
        } catch (error) {
            console.error('Erreur lors du chargement des étudiants:', error);
            throw error;
        }
    }

    async getEtudiantsParClasse(classeId) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.ETUDIANTS}/classe/${classeId}`);
    }

    async getEtudiantsActifs() {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.ETUDIANTS}/statut/actif`);
    }

    async searchEtudiants(query) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.ETUDIANTS}/search`, { q: query });
    }

    async createEtudiant(etudiantData) {
        return ApiClient.post(API_CONFIG.ENDPOINTS.ETUDIANTS, etudiantData);
    }

    async updateEtudiant(id, etudiantData) {
        return ApiClient.put(`${API_CONFIG.ENDPOINTS.ETUDIANTS}/${id}`, etudiantData);
    }

    async deleteEtudiant(id) {
        return ApiClient.delete(`${API_CONFIG.ENDPOINTS.ETUDIANTS}/${id}`);
    }
} 