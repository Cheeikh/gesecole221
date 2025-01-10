export class DataProvider {
    constructor() {
        this.baseUrl = 'http://localhost:3000'; // ou votre port json-server
        this.authToken = null;
    }

    setAuthToken(token) {
        this.authToken = token;
    }

    async getCours(params = {}) {
        return this.get('/cours', params);
    }

    async getCoursById(id) {
        return this.get(`/cours/${id}`);
    }

    async create(endpoint, data) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (this.authToken) {
                headers['Authorization'] = `Bearer ${this.authToken}`;
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`Erreur lors de la création`);
            }
            
            return response.json();
        } catch (error) {
            console.error('Erreur dans create:', error);
            throw error;
        }
    }

    async update(endpoint, id, data) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (this.authToken) {
                headers['Authorization'] = `Bearer ${this.authToken}`;
            }

            const response = await fetch(`${this.baseUrl}${endpoint}/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`Erreur lors de la mise à jour`);
            }
            
            return response.json();
        } catch (error) {
            console.error('Erreur dans update:', error);
            throw error;
        }
    }

    async delete(endpoint, id) {
        try {
            const headers = {};
            
            if (this.authToken) {
                headers['Authorization'] = `Bearer ${this.authToken}`;
            }

            const response = await fetch(`${this.baseUrl}${endpoint}/${id}`, {
                method: 'DELETE',
                headers
            });
            
            if (!response.ok) {
                throw new Error(`Erreur lors de la suppression`);
            }
            
            return true;
        } catch (error) {
            console.error('Erreur dans delete:', error);
            throw error;
        }
    }

    async getClasses(params = {}) {
        return this.get('/classes', params);
    }

    async get(endpoint, params = {}) {
        try {
            let queryString = '';
            
            // Gérer _expand
            if (params._expand) {
                const expands = Array.isArray(params._expand) ? params._expand : [params._expand];
                queryString += expands.map(e => `_expand=${e}`).join('&');
            }
            
            // Gérer _embed
            if (params._embed) {
                const embeds = Array.isArray(params._embed) ? params._embed : [params._embed];
                if (queryString) queryString += '&';
                queryString += embeds.map(e => `_embed=${e}`).join('&');
            }
            
            // Ajouter les autres paramètres
            const otherParams = { ...params };
            delete otherParams._expand;
            delete otherParams._embed;
            
            if (Object.keys(otherParams).length > 0) {
                if (queryString) queryString += '&';
                queryString += new URLSearchParams(otherParams).toString();
            }

            endpoint = `${endpoint}${queryString ? '?' + queryString : ''}`;

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` })
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des données depuis ${endpoint}`);
            }

            const data = await response.json();
            const total = parseInt(response.headers.get('X-Total-Count') || data.length);

            return {
                data,
                total,
                success: true
            };
        } catch (error) {
            console.error(`Erreur dans get ${endpoint}:`, error);
            return {
                data: [],
                total: 0,
                success: false,
                error: error.message
            };
        }
    }

    async getSeancesByCours(coursId) {
        return this.get(`/seances?coursId=${coursId}`);
    }
}

export const dataProvider = new DataProvider(); 