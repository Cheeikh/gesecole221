import { dataProvider } from '../providers/DataProvider.js';
import { dateFormatter } from '../utils/dateFormatter.js';

export class SeanceService {
    async getSeances(params = {}) {
        try {
            const { page = 1, limit = 10, q, coursId, statut, ...otherParams } = params;
            
            let queryParams = {
                _page: page,
                _limit: limit,
                _expand: ['cours'], // Pour inclure les détails du cours
                ...otherParams
            };

            // Ajouter les filtres spécifiques
            if (q) queryParams.q = q;
            if (coursId) queryParams.coursId = coursId;
            if (statut) queryParams.statut = statut;

            const response = await dataProvider.get('/seances', queryParams);
            
            return {
                seances: response.data,
                total: response.total,
                currentPage: page,
                totalPages: Math.ceil(response.total / limit)
            };
        } catch (error) {
            console.error('Erreur dans getSeances:', error);
            throw error;
        }
    }

    async getSeanceById(id) {
        try {
            // Récupérer la séance avec toutes les relations nécessaires
            const response = await dataProvider.get(`/seances/${id}`, {
                _expand: ['cours'],
                _embed: ['absences']
            });

            if (!response.success || !response.data) {
                throw new Error('Séance non trouvée');
            }

            const seance = response.data;

            // Enrichir avec les informations du professeur
            if (seance.cours?.professeurId) {
                const professeurResponse = await dataProvider.get(`/professeurs/${seance.cours.professeurId}`);
                if (professeurResponse.success) {
                    seance.cours.professeur = professeurResponse.data;
                }
            }

            // Enrichir les absences avec les informations des étudiants
            if (seance.absences && seance.absences.length > 0) {
                seance.absences = await Promise.all(seance.absences.map(async (absence) => {
                    if (absence.etudiantId) {
                        const etudiantResponse = await dataProvider.get(`/etudiants/${absence.etudiantId}`);
                        if (etudiantResponse.success) {
                            absence.etudiant = etudiantResponse.data;
                        }
                    }
                    return absence;
                }));
            }

            return seance;
        } catch (error) {
            console.error('Erreur dans getSeanceById:', error);
            throw error;
        }
    }

    async createSeance(data) {
        return dataProvider.create('/seances', data);
    }

    async updateSeance(id, data) {
        return dataProvider.update('/seances', id, data);
    }

    async deleteSeance(id) {
        return dataProvider.delete('/seances', id);
    }

    async getSeancesByCours(coursId) {
        return dataProvider.get(`/seances`, { coursId, _expand: ['cours'] });
    }

    async getSeancesByDate(date) {
        const formattedDate = dateFormatter.toInputDate(new Date(date));
        return dataProvider.get('/seances', { date: formattedDate, _expand: ['cours'] });
    }
} 