import Stats from '../models/stats/Stats';
import apiService from './ApiService';

class StatsService {
  async getStats(): Promise<Stats> {
    return (await apiService.get<Stats>('/stats')).data;
  }
}

export default new StatsService();
