import apiClient from './client';
import { FALLBACK_SERIES, FALLBACK_FEATURED_TESTS } from './catalogService';

export const testService = {
  async getPublishedSeries(page = 1, limit = 20) {
    try {
      const data = await apiClient.get(`/tests-api/public/series?page=${page}&limit=${limit}`);
      return data?.items || data || FALLBACK_SERIES;
    } catch (err) {
      console.warn('Failed to fetch series list, using fallback:', err?.message);
      return FALLBACK_SERIES;
    }
  },

  async getSeriesById(seriesId) {
    try {
      return await apiClient.get(`/tests-api/public/series/${encodeURIComponent(seriesId)}`);
    } catch (err) {
      const fallback = FALLBACK_SERIES.find((s) => s.id === seriesId) || FALLBACK_SERIES[0];
      return {
        ...fallback,
        tests: FALLBACK_FEATURED_TESTS,
      };
    }
  },

  async getMockTestStructure(testId) {
    try {
      return await apiClient.get(`/tests-api/catalog/mock-tests/${encodeURIComponent(testId)}/structure`);
    } catch (err) {
      const fallback = FALLBACK_FEATURED_TESTS.find((t) => t.id === testId) || FALLBACK_FEATURED_TESTS[0];
      return {
        id: fallback.id,
        title: fallback.title,
        durationMinutes: fallback.durationMinutes,
        totalMarks: fallback.totalMarks,
        totalQuestions: fallback.totalQuestions,
        negativeMark: fallback.negativeMark || 0.25,
        instructions: [
          'The test contains objective Multiple Choice Questions (MCQs).',
          'Each correct answer carries marks as specified in each section.',
          'Negative marks will be deducted for each incorrect response.',
          'You can flag questions to review them later before submitting.',
          'The exam auto-submits when the timer reaches 00:00:00.',
        ],
        sections: [
          {
            id: 'sec-1',
            name: 'General Intelligence & Reasoning',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMarks: 0.5,
          },
          {
            id: 'sec-2',
            name: 'General Awareness',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMarks: 0.5,
          },
          {
            id: 'sec-3',
            name: 'Quantitative Aptitude',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMarks: 0.5,
          },
          {
            id: 'sec-4',
            name: 'English Comprehension',
            questionCount: 25,
            marksPerQuestion: 2,
            negativeMarks: 0.5,
          },
        ],
      };
    }
  },
};

export default testService;
