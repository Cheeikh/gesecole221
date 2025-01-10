import { dataProvider } from '../providers/DataProvider.js';

export class EtudiantService {
    async getEtudiants(params = {}) {
        try {
            const { page = 1, limit = 10, q, classeId, statut, ...otherParams } = params;
            
            let queryParams = {
                _page: page,
                _limit: limit,
                _expand: ['classe'], // Pour inclure les détails de la classe
                ...otherParams
            };

            // Ajouter les filtres spécifiques
            if (q) queryParams.q = q;
            if (classeId) queryParams.classeId = parseInt(classeId); // Convertir en nombre
            if (statut) queryParams.statut = statut;

            const response = await dataProvider.get('/etudiants', queryParams);
            
            return {
                etudiants: response.data,
                total: response.total,
                currentPage: page,
                totalPages: Math.ceil(response.total / limit)
            };
        } catch (error) {
            console.error('Erreur dans getEtudiants:', error);
            throw error;
        }
    }

    async getEtudiantById(id) {
        try {
            const response = await dataProvider.get(`/etudiants/${id}`, {
                _expand: ['classe'],
                _embed: ['absences']
            });
            return response.data;
        } catch (error) {
            console.error('Erreur dans getEtudiantById:', error);
            throw error;
        }
    }

    async createEtudiant(etudiantData) {
        return dataProvider.create('/etudiants', etudiantData);
    }

    async updateEtudiant(id, etudiantData) {
        return dataProvider.update('/etudiants', id, etudiantData);
    }

    async deleteEtudiant(id) {
        return dataProvider.delete('/etudiants', id);
    }

    async getEtudiantsParClasse(classeId) {
        try {
            const response = await dataProvider.get('/etudiants', { 
                classeId, 
                _expand: ['classe'] 
            });
            
            // S'assurer que nous renvoyons toujours un tableau
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erreur dans getEtudiantsParClasse:', error);
            return []; // Retourner un tableau vide en cas d'erreur
        }
    }

    async getEtudiantsActifs() {
        return dataProvider.get('/etudiants', { statut: 'actif', _expand: ['classe'] });
    }

    async getEtudiantsWithAbsences() {
        try {
            const response = await dataProvider.get('/etudiants', {
                _embed: ['absences'],
                _expand: ['classe']
            });
            return response.data;
        } catch (error) {
            console.error('Erreur dans getEtudiantsWithAbsences:', error);
            throw error;
        }
    }

    async getEtudiantsSansClasse() {
        try {
            const response = await dataProvider.get('/etudiants', {
                classeId_null: true,
                statut: 'actif'
            });
            return response.data || [];
        } catch (error) {
            console.error('Erreur dans getEtudiantsSansClasse:', error);
            return [];
        }
    }
} 