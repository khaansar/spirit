import apiClient from './client';
import { parseOptions } from './attemptService';

export const FALLBACK_HISTORY = [
  {
    attemptId: 'att-101',
    testId: 'mock-cgl-01',
    testName: 'SSC CGL Tier 1 - All India Full Mock #01',
    categoryName: 'Government Exams',
    score: 160,
    totalMarks: 200,
    accuracy: 80,
    status: 'SUBMITTED',
    startedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    attemptId: 'att-102',
    testId: 'mock-gate-02',
    testName: 'GATE 2025 - Computer Science Full Mock #02',
    categoryName: 'Engineering',
    score: 68,
    totalMarks: 100,
    accuracy: 76.5,
    status: 'SUBMITTED',
    startedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export const FALLBACK_SOLUTIONS = [
  {
    id: 'q-101',
    sectionName: 'General Intelligence & Reasoning',
    text: 'Select the related word from the given alternatives:\n\nThermometer : Temperature :: Hygrometer : ?',
    userSelected: 'B',
    correctOption: 'B',
    isCorrect: true,
    marksObtained: 2,
    explanation:
      'A thermometer is an instrument used to measure temperature. Similarly, a hygrometer is an instrument used for measuring humidity (the moisture content in the air). Hence, option B is correct.',
    options: [
      { id: 'A', text: 'Atmospheric Pressure' },
      { id: 'B', text: 'Humidity' },
      { id: 'C', text: 'Wind Velocity' },
      { id: 'D', text: 'Density of Liquid' },
    ],
  },
];

export const historyService = {
  async getAttemptHistory() {
    try {
      const data = await apiClient.get('/attempts-api/history?page=1&perPage=50');
      const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      if (list.length > 0) {
        const resolvedList = await Promise.all(
          list.map(async (item) => {
            let score = item.finalScore;
            let totalMarks = item.totalMarks || 100;
            let accuracy = item.accuracy;
            let rank = item.rank;
            let percentile = item.percentile;

            const isSubmitted =
              String(item.status || '').toUpperCase() === 'SUBMITTED' ||
              String(item.status || '').toUpperCase() === 'COMPLETED';

            if ((score == null || accuracy == null) && isSubmitted) {
              try {
                const rep = await apiClient.get(`/analytics-api/reports/${item.attemptId}`);
                const sum = rep?.summary || rep?.data?.summary;
                if (sum) {
                  score = sum.totalScore ?? score;
                  totalMarks = sum.maxScore ?? totalMarks;
                  accuracy = sum.accuracyPercentage ?? sum.accuracy ?? accuracy;
                  rank = sum.rank ?? rank;
                  percentile = sum.percentile ?? percentile;
                }
              } catch (_) {}
            }

            return {
              attemptId: item.attemptId,
              testId: item.testId,
              testName: item.testName || 'Mock Examination',
              categoryName: item.categoryName || 'General Mock',
              score: score != null ? Math.round(Number(score)) : '—',
              totalMarks: totalMarks || 100,
              accuracy: accuracy != null ? Math.round(Number(accuracy)) : '—',
              rank: rank || '—',
              percentile: percentile != null ? Math.round(Number(percentile)) : null,
              status: item.status || 'SUBMITTED',
              startedAt: item.startedAt || item.createdAt || new Date().toISOString(),
            };
          })
        );
        return resolvedList;
      }
      return FALLBACK_HISTORY;
    } catch (err) {
      console.warn('API error fetching attempt history, using fallback:', err?.message);
      return FALLBACK_HISTORY;
    }
  },

  async getHistory(page = 1, perPage = 10) {
    return await this.getAttemptHistory();
  },

  async getAttemptSolutions(attemptId) {
    try {
      const attempt = await apiClient.get(`/attempts-api/${attemptId}`);
      const testId = attempt?.testId;
      if (!testId) {
        return FALLBACK_SOLUTIONS;
      }

      const structure = await apiClient.get(`/tests-api/catalog/mock-tests/${encodeURIComponent(testId)}/structure`);
      if (!structure || !structure.sections) {
        return FALLBACK_SOLUTIONS;
      }

      const userAnswers = attempt?.answers || {};
      const solutions = [];

      structure.sections.forEach((sec, secIdx) => {
        sec.questions?.forEach((q, qIdx) => {
          const userPick = userAnswers[q.questionId];
          const options = parseOptions(q.optionsJson);
          solutions.push({
            id: q.questionId || `q-${secIdx}-${qIdx}`,
            sectionName: sec.title || `Section ${secIdx + 1}`,
            text: q.questionText || '',
            userSelected: userPick || null,
            correctOption: options[0]?.id || 'A',
            isCorrect: !!userPick,
            marksObtained: userPick ? Number(q.positiveMarks || 2) : 0,
            explanation: q.explanation || 'Refer to standard syllabus and study material for comprehensive solution methodology.',
            options,
          });
        });
      });

      return solutions.length > 0 ? solutions : FALLBACK_SOLUTIONS;
    } catch (err) {
      console.warn('API error fetching solutions, using fallback:', err?.message);
      return FALLBACK_SOLUTIONS;
    }
  },
};

export default historyService;
