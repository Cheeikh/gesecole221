class DataProvider {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.token = localStorage.getItem('token');
    }

    setAuthToken(token) {
        this.token = token;
    }

    async fetchWithCache(endpoint, options = {}) {
        const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
        const cached = this.cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const headers = {
                ...options.headers,
                'Content-Type': 'application/json'
            };

            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers
            });

            if (response.status === 401) {
                // Token expiré ou invalide
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login.html';
                throw new Error('Session expirée');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des données (${endpoint}):`, error);
            throw error;
        }
    }

    // Méthodes pour les cours
    async getCours(params = {}) {
        try {
            // Ajouter les paramètres de base pour inclure les relations
            const baseParams = { 
                _expand: 'professeur'  // Inclure les informations du professeur
            };
            const allParams = { ...baseParams, ...params };
            const queryString = new URLSearchParams(allParams).toString();
            return this.fetchWithCache(`/cours${queryString ? `?${queryString}` : ''}`);
        } catch (error) {
            console.error('Erreur dans getCours:', error);
            throw error;
        }
    }

    async getCoursById(id) {
        return this.fetchWithCache(`/cours/${id}?_expand=professeur`);
    }

    async getCoursParDate(date) {
        return this.fetchWithCache(`/cours/date/${date}?_expand=professeur`);
    }

    async getCoursProfesseur(professeurId) {
        return this.fetchWithCache(`/cours/professeur/${professeurId}?_expand=professeur`);
    }

    // Méthodes pour les professeurs
    async getProfesseurs(params = {}) {
        try {
            // Ajouter les paramètres de base pour inclure les relations
            const baseParams = { 
                _embed: 'cours'  // Inclure les cours associés si nécessaire
            };
            const allParams = { ...baseParams, ...params };
            const queryString = new URLSearchParams(allParams).toString();
            const professeurs = await this.fetchWithCache(`/professeurs${queryString ? `?${queryString}` : ''}`);
            
            return professeurs;
        } catch (error) {
            console.error('Erreur dans getProfesseurs:', error);
            throw error;
        }
    }

    async getProfesseurById(id) {
        return this.fetchWithCache(`/professeurs/${id}?_embed=cours`);
    }

    async getProfesseurCours(id) {
        return this.fetchWithCache(`/professeurs/${id}/cours`);
    }

    // Méthodes pour les étudiants
    async getEtudiants(params = {}) {
        try {
            // Ajouter les paramètres de base pour inclure les relations
            const baseParams = { 
                _expand: 'classe'  // Inclure les informations de la classe
            };
            const allParams = { ...baseParams, ...params };
            const queryString = new URLSearchParams(allParams).toString();
            const etudiants = await this.fetchWithCache(`/etudiants${queryString ? `?${queryString}` : ''}`);
            
            return etudiants;
        } catch (error) {
            console.error('Erreur dans getEtudiants:', error);
            throw error;
        }
    }

    async getEtudiantById(id) {
        return this.fetchWithCache(`/etudiants/${id}?_expand=classe`);
    }

    async getEtudiantAbsences(id) {
        return this.fetchWithCache(`/etudiants/${id}/absences`);
    }

    // Méthodes pour les séances
    async getSeances(params = {}) {
        try {
            // Utiliser _expand=cours pour obtenir les informations du cours
            const baseParams = { 
                _expand: 'cours'
            };
            const allParams = { ...baseParams, ...params };
            const queryString = new URLSearchParams(allParams).toString();
            const seances = await this.fetchWithCache(`/seances?${queryString}`);
            
            // Pour chaque séance, récupérer les informations du professeur via le cours
            const seancesWithProfesseur = await Promise.all(seances.map(async seance => {
                if (seance.cours?.professeurId) {
                    try {
                        const professeur = await this.getProfesseurById(seance.cours.professeurId);
                        return {
                            ...seance,
                            professeur
                        };
                    } catch (error) {
                        console.warn(`Impossible de récupérer le professeur pour la séance ${seance.id}:`, error);
                        return seance;
                    }
                }
                return seance;
            }));
            
            return seancesWithProfesseur;
        } catch (error) {
            console.error('Erreur dans getSeances:', error);
            throw error;
        }
    }

    async getSeanceById(id) {
        return this.fetchWithCache(`/seances/${id}?_expand=cours`);
    }

    async getSeancesByCours(coursId) {
        return this.fetchWithCache(`/seances?coursId=${coursId}&_expand=cours`);
    }

    // Méthodes pour les absences
    async getAbsences(params = {}) {
        try {
            // Ajouter les paramètres de base pour inclure les relations
            const baseParams = { 
                _expand: 'etudiant',
                _expand: 'seance'
            };
            const allParams = { ...baseParams, ...params };
            const queryString = new URLSearchParams(allParams).toString();
            const absences = await this.fetchWithCache(`/absences${queryString ? `?${queryString}` : ''}`);

            // Pour chaque absence, récupérer les informations du cours associé à la séance
            const absencesWithCours = await Promise.all(absences.map(async absence => {
                if (absence.seance?.coursId) {
                    try {
                        const cours = await this.getCoursById(absence.seance.coursId);
                        return {
                            ...absence,
                            seance: {
                                ...absence.seance,
                                cours
                            }
                        };
                    } catch (error) {
                        console.warn(`Impossible de récupérer le cours pour l'absence ${absence.id}:`, error);
                        return absence;
                    }
                }
                return absence;
            }));

            return absencesWithCours;
        } catch (error) {
            console.error('Erreur dans getAbsences:', error);
            throw error;
        }
    }

    async getAbsenceById(id) {
        return this.fetchWithCache(`/absences/${id}?_expand=etudiant&_expand=seance`);
    }

    async getAbsencesByEtudiant(etudiantId) {
        return this.fetchWithCache(`/absences/etudiant/${etudiantId}`);
    }

    async getAbsencesBySeance(seanceId) {
        return this.fetchWithCache(`/absences/seance/${seanceId}`);
    }

    // Méthodes pour les classes
    async getClasses(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.fetchWithCache(`/classes${queryString ? `?${queryString}` : ''}`);
    }

    async getClasseById(id) {
        return this.fetchWithCache(`/classes/${id}`);
    }

    async getClasseEtudiants(id) {
        return this.fetchWithCache(`/classes/${id}/etudiants`);
    }

    // Méthodes pour les semestres
    async getSemestres(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.fetchWithCache(`/semestres${queryString ? `?${queryString}` : ''}`);
    }

    async getSemestreActif() {
        return this.fetchWithCache(`/semestres/actif`);
    }

    // Méthodes de mutation (POST, PUT, DELETE)
    async create(endpoint, data) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Invalider le cache pour cet endpoint
        this.invalidateCache(endpoint);
        
        return response.json();
    }

    async update(endpoint, id, data) {
        const response = await fetch(`${this.baseUrl}${endpoint}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Invalider le cache pour cet endpoint
        this.invalidateCache(endpoint);
        
        return response.json();
    }

    async delete(endpoint, id) {
        const response = await fetch(`${this.baseUrl}${endpoint}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Invalider le cache pour cet endpoint
        this.invalidateCache(endpoint);
        
        return true;
    }

    // Gestion du cache
    invalidateCache(endpoint) {
        for (const key of this.cache.keys()) {
            if (key.startsWith(endpoint)) {
                this.cache.delete(key);
            }
        }
    }

    clearCache() {
        this.cache.clear();
    }
}

// Export d'une instance unique (Singleton)
export const dataProvider = new DataProvider(); 