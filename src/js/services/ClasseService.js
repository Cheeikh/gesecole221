import { dataProvider } from '../providers/DataProvider.js';

export class ClasseService {
    async getClasses(params = {}) {
        try {
            const { page = 1, limit = 10, q, niveau, ...otherParams } = params;
            
            let queryParams = {
                _page: page,
                _limit: limit,
                ...otherParams
            };

            // Ajouter les filtres spécifiques
            if (q) queryParams.q = q;
            if (niveau) queryParams.niveau = niveau;

            // Récupérer les classes
            const response = await dataProvider.get('/classes', queryParams);
            
            // Pour chaque classe, récupérer ses étudiants
            const classesWithStudents = await Promise.all(response.data.map(async (classe) => {
                const etudiantsResponse = await dataProvider.get('/etudiants', { 
                    classeId: classe.id 
                });
                return {
                    ...classe,
                    nbEtudiants: etudiantsResponse.data?.length || 0
                };
            }));
            
            return {
                classes: classesWithStudents,
                total: response.total || classesWithStudents.length,
                currentPage: page,
                totalPages: Math.ceil((response.total || classesWithStudents.length) / limit)
            };
        } catch (error) {
            console.error('Erreur dans getClasses:', error);
            return {
                classes: [],
                total: 0,
                currentPage: 1,
                totalPages: 1
            };
        }
    }

    async getClasseById(id) {
        try {
            const response = await dataProvider.get(`/classes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur dans getClasseById:', error);
            throw error;
        }
    }

    async createClasse(data) {
        try {
            console.log('Création classe avec données:', data); // Debug
            return await dataProvider.create('/classes', data);
        } catch (error) {
            console.error('Erreur dans createClasse:', error);
            throw error;
        }
    }

    async updateClasse(id, data) {
        try {
            console.log('Mise à jour classe avec données:', data); // Debug
            return await dataProvider.update('/classes', id, data);
        } catch (error) {
            console.error('Erreur dans updateClasse:', error);
            throw error;
        }
    }

    async deleteClasse(id) {
        try {
            console.log('Suppression classe:', id); // Debug
            return await dataProvider.delete('/classes', id);
        } catch (error) {
            console.error('Erreur dans deleteClasse:', error);
            throw error;
        }
    }
} 