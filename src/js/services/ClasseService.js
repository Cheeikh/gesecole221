export class ClasseService {
    static async getClasses() {
        try {
            const response = await fetch('/api/classes');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des classes');
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur:', error);
            throw error;
        }
    }

    static async createClasse(classe) {
        try {
            const response = await fetch('/api/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(classe),
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la création de la classe');
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur:', error);
            throw error;
        }
    }

    static async updateClasse(id, classe) {
        try {
            const response = await fetch(`/api/classes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(classe),
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la classe');
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur:', error);
            throw error;
        }
    }

    static async deleteClasse(id) {
        try {
            const response = await fetch(`/api/classes/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de la classe');
            }
            return true;
        } catch (error) {
            console.error('Erreur:', error);
            throw error;
        }
    }
} 