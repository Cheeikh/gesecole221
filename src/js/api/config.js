export const API_CONFIG = {
    BASE_URL: '/api',
    ENDPOINTS: {
        COURS: '/cours',
        SEANCES: '/seances',
        ABSENCES: '/absences',
        PROFESSEURS: '/professeurs',
        ETUDIANTS: '/etudiants',
        CLASSES: '/classes',
        SEMESTRES: '/semestres',
        NIVEAUX: '/niveaux'
    },
    HEADERS: {
        'Content-Type': 'application/json'
    }
};

export class ApiClient {
    static async get(endpoint, params = {}) {
        try {
            // Gérer les endpoints spéciaux avec des paramètres dans l'URL
            if (endpoint.includes('date/')) {
                const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            }

            // Construction de l'URL avec les paramètres de requête
            const queryParams = new URLSearchParams();
            for (const [key, value] of Object.entries(params)) {
                if (value) queryParams.append(key, value);
            }
            
            const url = `${API_CONFIG.BASE_URL}${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }

    static async post(endpoint, data) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }

    static async put(endpoint, data) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }

    static async delete(endpoint) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return true;
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }

    // Méthodes utilitaires pour la construction d'URL
    static buildUrl(endpoint, params = {}) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value) queryParams.append(key, value);
        }
        return `${API_CONFIG.BASE_URL}${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    }

    static buildDateUrl(endpoint, date) {
        return `${API_CONFIG.BASE_URL}${endpoint}/date/${date}`;
    }
} 