import apiClient from './client';

export const analyticsService = {
  /**
   * Fetches full yearly activity heatmap and current streak
   */
  async getYearlyStreak() {
    return await apiClient.get('/attempts-api/streak/yearly');
  },

  /**
   * Fetches overall student test metrics, score averages, and section accuracies
   */
  async getUserPerformance() {
    return await apiClient.get('/analytics-api/reports/performance');
  },

  /**
   * Fetches topic breakdown, strengths, weaknesses, and AI insights
   */
  async getUserTopicPerformance() {
    return await apiClient.get('/analytics-api/reports/topics');
  },

  /**
   * Fetches calendar analytics for given month and year
   */
  async getCalendarAnalytics(year, month) {
    return await apiClient.get('/auth-api/users/calendar', {
      params: { year, month },
    });
  },
};

export default analyticsService;
