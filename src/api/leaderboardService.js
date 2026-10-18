import apiClient from './client';

export const FALLBACK_LEADERBOARD = [
  { rank: 1, name: 'Ananya Sharma', avatar: null, score: 195, accuracy: 98.2, timeTaken: '48m 12s', isCurrentUser: false },
  { rank: 2, name: 'Rahul Verma', avatar: null, score: 190, accuracy: 96.0, timeTaken: '52m 04s', isCurrentUser: false },
  { rank: 3, name: 'Priya Patel', avatar: null, score: 188, accuracy: 94.5, timeTaken: '50m 30s', isCurrentUser: false },
  { rank: 4, name: 'Vikram Singh', avatar: null, score: 184, accuracy: 93.1, timeTaken: '55m 18s', isCurrentUser: false },
  { rank: 5, name: 'Deepak Roy', avatar: null, score: 180, accuracy: 91.0, timeTaken: '54m 40s', isCurrentUser: false },
  { rank: 6, name: 'Sneha Kulkarni', avatar: null, score: 176, accuracy: 90.5, timeTaken: '56m 22s', isCurrentUser: false },
  { rank: 14, name: 'You (Current Aspirant)', avatar: null, score: 160, accuracy: 80.0, timeTaken: '58m 10s', isCurrentUser: true },
  { rank: 15, name: 'Amit Kumar', avatar: null, score: 158, accuracy: 79.2, timeTaken: '57m 45s', isCurrentUser: false },
];

export const leaderboardService = {
  async getTestLeaderboard(testSlug = 'mock-cgl-01', page = 1, pageSize = 25) {
    try {
      const data = await apiClient.get(
        `/analytics-api/reports/leaderboard/tests/${encodeURIComponent(testSlug)}?page=${page}&pageSize=${pageSize}`
      );
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_LEADERBOARD;
    } catch (err) {
      console.warn('API error fetching leaderboard, using fallback:', err?.message);
      return FALLBACK_LEADERBOARD;
    }
  },
};

export default leaderboardService;
