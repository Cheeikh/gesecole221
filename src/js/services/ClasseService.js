import { dataProvider } from '../providers/DataProvider.js';

export class ClasseService {
    async getClasses(params = {}) {
        return dataProvider.getClasses(params);
    }

    async getClasseById(id) {
        return dataProvider.getClasseById(id);
    }

    async createClasse(data) {
        return dataProvider.create('/classes', data);
    }

    async updateClasse(id, data) {
        return dataProvider.update('/classes', id, data);
    }

    async deleteClasse(id) {
        return dataProvider.delete('/classes', id);
    }
} 