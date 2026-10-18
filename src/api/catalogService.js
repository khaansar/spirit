import apiClient from './client';

export const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Engineering', slug: 'engineering', testCount: 120, icon: 'Settings', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  { id: '2', name: 'Medical', slug: 'medical', testCount: 80, icon: 'Stethoscope', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  { id: '3', name: 'Government Exams', slug: 'government', testCount: 150, icon: 'Landmark', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)' },
  { id: '4', name: 'School Exams', slug: 'school', testCount: 60, icon: 'BookOpen', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  { id: '5', name: 'Aptitude & Reasoning', slug: 'aptitude', testCount: 90, icon: 'Sigma', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
  { id: '6', name: 'Computer Science', slug: 'cs', testCount: 100, icon: 'Monitor', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.12)' },
  { id: '7', name: 'Data Structures', slug: 'dsa', testCount: 70, icon: 'Network', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)' },
  { id: '8', name: 'Operating Systems', slug: 'os', testCount: 60, icon: 'Cpu', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
];

export const FALLBACK_SERIES = [
  {
    id: 's1',
    title: 'GATE 2025 Full Length Mock Series',
    badge: 'Popular',
    testCount: 12,
    durationMinutes: 180,
    avgRating: 4.8,
    categoryName: 'Engineering',
    description: 'Comprehensive mock tests covering complete engineering syllabus with detailed video solutions and All-India ranks.',
  },
  {
    id: 's2',
    title: 'SSC CGL Tier 1 & 2 Champion Series',
    badge: 'Trending',
    testCount: 20,
    durationMinutes: 60,
    avgRating: 4.9,
    categoryName: 'Government Exams',
    description: 'Designed as per latest SSC TCS pattern with sectional and full-length papers.',
  },
  {
    id: 's3',
    title: 'Computer Science Core Concepts Mock Pack',
    badge: 'New',
    testCount: 8,
    durationMinutes: 90,
    avgRating: 4.6,
    categoryName: 'Computer Science',
    description: 'Master OS, DBMS, Computer Networks and Algorithms with exam-oriented sectional tests.',
  },
  {
    id: 's4',
    title: 'Quantitative Aptitude Speed Drills',
    badge: null,
    testCount: 15,
    durationMinutes: 45,
    avgRating: 4.7,
    categoryName: 'Aptitude & Reasoning',
    description: 'Improve calculation speed, shortcuts, and accuracy for competitive exams.',
  },
];

export const FALLBACK_FEATURED_TESTS = [
  {
    id: 'dfc9d8e2-33a2-4f66-b0c7-5c71278616a8',
    title: 'SSC CGL Tier 1 - All India Full Mock #01',
    categoryName: 'Government Exams',
    durationMinutes: 60,
    totalMarks: 200,
    totalQuestions: 100,
    negativeMark: 0.5,
    difficulty: 'Moderate',
  },
  {
    id: 't2',
    title: 'Operating Systems - Process & Deadlocks',
    categoryName: 'Computer Science',
    durationMinutes: 45,
    totalMarks: 50,
    totalQuestions: 25,
    negativeMark: 0.33,
    difficulty: 'Hard',
  },
  {
    id: 't3',
    title: 'Quantitative Aptitude - Arithmetic Mock #02',
    categoryName: 'Aptitude & Reasoning',
    durationMinutes: 60,
    totalMarks: 100,
    totalQuestions: 50,
    negativeMark: 0.25,
    difficulty: 'Easy',
  },
  {
    id: 't4',
    title: 'GATE CS - Algorithms & Data Structures',
    categoryName: 'Engineering',
    durationMinutes: 90,
    totalMarks: 100,
    totalQuestions: 35,
    negativeMark: 0.33,
    difficulty: 'Moderate',
  },
];

export const catalogService = {
  async getCategories() {
    try {
      const data = await apiClient.get('/tests-api/public/categories');
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_CATEGORIES;
    } catch (err) {
      console.warn('API error fetching categories, using fallback:', err?.message);
      return FALLBACK_CATEGORIES;
    }
  },

  async getPopularSeries() {
    try {
      const data = await apiClient.get('/tests-api/public/series/popular');
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_SERIES;
    } catch (err) {
      console.warn('API error fetching popular series, using fallback:', err?.message);
      return FALLBACK_SERIES;
    }
  },

  async getFeaturedTests() {
    try {
      const data = await apiClient.get('/tests-api/public/mock-tests/featured');
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_FEATURED_TESTS;
    } catch (err) {
      console.warn('API error fetching featured tests, using fallback:', err?.message);
      return FALLBACK_FEATURED_TESTS;
    }
  },

  async getContinueAttempt() {
    try {
      return await apiClient.get('/attempts-api/attempts/in-progress');
    } catch (err) {
      return null;
    }
  },
};

export default catalogService;
