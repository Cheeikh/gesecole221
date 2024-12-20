import { ApiClient, API_CONFIG } from '../api/config.js';

export class AbsenceService {
    async getAbsences(params = {}) {
        try {
            const absences = await ApiClient.get(API_CONFIG.ENDPOINTS.ABSENCES, params);
            
            // Enrichir les données des absences avec les informations de l'étudiant et de la séance
            const absencesEnrichies = await Promise.all(absences.map(async (absence) => {
                const [etudiant, seance] = await Promise.all([
                    ApiClient.get(`${API_CONFIG.ENDPOINTS.ETUDIANTS}/${absence.etudiantId}`),
                    ApiClient.get(`${API_CONFIG.ENDPOINTS.SEANCES}/${absence.seanceId}`)
                ]);
                
                // Récupérer les informations du cours associé à la séance
                const cours = await ApiClient.get(`${API_CONFIG.ENDPOINTS.COURS}/${seance.coursId}`);
                
                return {
                    ...absence,
                    etudiant,
                    seance: {
                        ...seance,
                        cours
                    }
                };
            }));
            
            return absencesEnrichies;
        } catch (error) {
            console.error('Erreur lors du chargement des absences:', error);
            throw error;
        }
    }

    async getAbsencesParEtudiant(etudiantId) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.ABSENCES}/etudiant/${etudiantId}`);
    }

    async getAbsencesParSeance(seanceId) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.ABSENCES}/seance/${seanceId}`);
    }

    async getAbsencesParDate(date) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.ABSENCES}/date/${date}`);
    }

    async getAbsencesParStatut(statut) {
        return ApiClient.get(`${API_CONFIG.ENDPOINTS.ABSENCES}/statut/${statut}`);
    }

    async justifierAbsence(id, justificationData) {
        return ApiClient.put(`${API_CONFIG.ENDPOINTS.ABSENCES}/justifier/${id}`, justificationData);
    }

    async createAbsence(absenceData) {
        return ApiClient.post(API_CONFIG.ENDPOINTS.ABSENCES, absenceData);
    }

    async updateAbsence(id, absenceData) {
        return ApiClient.put(`${API_CONFIG.ENDPOINTS.ABSENCES}/${id}`, absenceData);
    }

    async deleteAbsence(id) {
        return ApiClient.delete(`${API_CONFIG.ENDPOINTS.ABSENCES}/${id}`);
    }
} 