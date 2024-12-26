import { dataProvider } from '../providers/DataProvider.js';
import { dateFormatter } from '../utils/dateFormatter.js';

export class SeanceService {
    async getSeances(params = {}) {
        return dataProvider.getSeances(params);
    }

    async getSeanceById(id) {
        return dataProvider.getSeanceById(id);
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
        return dataProvider.getSeancesByCours(coursId);
    }

    async getSeancesByDate(date) {
        const formattedDate = dateFormatter.toInputDate(new Date(date));
        return dataProvider.getSeances({ date: formattedDate });
    }
} 