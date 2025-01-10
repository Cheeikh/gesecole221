import { dataProvider } from '../providers/DataProvider.js';

export class AbsenceService {
    async getAbsences(params = {}) {
        try {
            const { page = 1, limit = 10, q, etudiantId, coursId, statut, ...otherParams } = params;
            
            let queryParams = {
                _page: page,
                _limit: limit,
                _expand: ['etudiant', 'seance'], // Pour inclure les détails de l'étudiant et de la séance
                _sort: 'dateAbs',  // Trier par date
                _order: 'desc',    // Du plus récent au plus ancien
                ...otherParams
            };

            // Ajouter les filtres spécifiques
            if (q) queryParams.q = q;
            if (etudiantId) queryParams.etudiantId = parseInt(etudiantId);
            if (coursId) queryParams['seance.coursId'] = coursId;
            if (statut) queryParams.statut = statut;

            console.log('Requête absences avec params:', queryParams); // Debug

            const response = await dataProvider.get('/absences', queryParams);
            
            console.log('Réponse absences:', response); // Debug
            
            // S'assurer que response.data est toujours un tableau
            const absences = Array.isArray(response.data) ? response.data : [];
            
            return {
                absences,
                total: response.total || absences.length,
                currentPage: page,
                totalPages: Math.ceil((response.total || absences.length) / limit)
            };
        } catch (error) {
            console.error('Erreur dans getAbsences:', error);
            // En cas d'erreur, retourner un objet avec un tableau vide
            return {
                absences: [],
                total: 0,
                currentPage: 1,
                totalPages: 1
            };
        }
    }

    async getAbsenceById(id) {
        try {
            const response = await dataProvider.get(`/absences/${id}`, {
                _expand: ['etudiant', 'seance']
            });
            return response.data || null;
        } catch (error) {
            console.error('Erreur dans getAbsenceById:', error);
            throw error;
        }
    }

    async createAbsence(absenceData) {
        return dataProvider.create('/absences', {
            ...absenceData,
            dateCreation: new Date().toISOString(),
            statut: absenceData.statut || 'non_justifié'
        });
    }

    async updateAbsence(id, absenceData) {
        return dataProvider.update('/absences', id, {
            ...absenceData,
            dateModification: new Date().toISOString()
        });
    }

    async deleteAbsence(id) {
        return dataProvider.delete('/absences', id);
    }

    async justifierAbsence(id, justificationData) {
        const absence = await this.getAbsenceById(id);
        if (!absence) throw new Error('Absence non trouvée');

        return this.updateAbsence(id, {
            ...absence,
            ...justificationData,
            statut: 'justifié',
            dateJustification: new Date().toISOString()
        });
    }

    async getAbsencesParEtudiant(etudiantId) {
        try {
            const response = await dataProvider.get('/absences', { 
                etudiantId,
                _expand: ['seance', 'etudiant'],
                _sort: 'dateAbs',
                _order: 'desc'
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erreur dans getAbsencesParEtudiant:', error);
            return [];
        }
    }

    async getAbsencesParSeance(seanceId) {
        try {
            const response = await dataProvider.get('/absences', {
                seanceId,
                _expand: ['etudiant']
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erreur dans getAbsencesParSeance:', error);
            return [];
        }
    }

    async getAbsencesNonJustifiees() {
        try {
            const response = await dataProvider.get('/absences', {
                statut: 'non_justifié',
                _expand: ['etudiant', 'seance']
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erreur dans getAbsencesNonJustifiees:', error);
            return [];
        }
    }
} 