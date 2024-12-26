import { dataProvider } from '../providers/DataProvider.js';
import { dateFormatter } from '../utils/dateFormatter.js';

export class CoursService {
    async getCours(params = {}) {
        return dataProvider.getCours(params);
    }

    async getCoursById(id) {
        return dataProvider.getCoursById(id);
    }

    async createCours(data) {
        return dataProvider.create('/cours', data);
    }

    async updateCours(id, data) {
        return dataProvider.update('/cours', id, data);
    }

    async deleteCours(id) {
        return dataProvider.delete('/cours', id);
    }

    async getCoursParDate(date) {
        const formattedDate = dateFormatter.toInputDate(new Date(date));
        return dataProvider.getCours({ dateCours: formattedDate });
    }
} 