import apiClient from './client';

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
    startedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
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
    startedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
  {
    attemptId: 'att-103',
    testId: 'mock-os-03',
    testName: 'Operating Systems - Sectional Mock',
    categoryName: 'Computer Science',
    score: 22,
    totalMarks: 25,
    accuracy: 92,
    status: 'SUBMITTED',
    startedAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
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
  {
    id: 'q-102',
    sectionName: 'General Intelligence & Reasoning',
    text: 'Find the missing number in the series:\n\n4, 9, 25, 49, 121, ?',
    userSelected: 'A',
    correctOption: 'B',
    isCorrect: false,
    marksObtained: -0.5,
    explanation:
      'The numbers in the given series are squares of consecutive prime numbers:\n2^2 = 4\n3^2 = 9\n5^2 = 25\n7^2 = 49\n11^2 = 121\nThe next prime number is 13. Therefore, 13^2 = 169.\nHence, 169 (Option B) is the correct answer.',
    options: [
      { id: 'A', text: '144' },
      { id: 'B', text: '169' },
      { id: 'C', text: '196' },
      { id: 'D', text: '225' },
    ],
  },
  {
    id: 'q-201',
    sectionName: 'Quantitative Aptitude',
    text: 'If x + (1/x) = 5, find the value of x^2 + (1/x^2):',
    userSelected: 'A',
    correctOption: 'A',
    isCorrect: true,
    marksObtained: 2,
    explanation:
      'Squaring both sides of x + (1/x) = 5:\n(x + 1/x)^2 = 5^2\nx^2 + 2 * x * (1/x) + 1/x^2 = 25\nx^2 + 2 + 1/x^2 = 25\nx^2 + 1/x^2 = 25 - 2 = 23.\nHence, option A (23) is the correct answer.',
    options: [
      { id: 'A', text: '23' },
      { id: 'B', text: '25' },
      { id: 'C', text: '27' },
      { id: 'D', text: '21' },
    ],
  },
  {
    id: 'q-301',
    sectionName: 'General Awareness',
    text: 'Which Article of the Indian Constitution is related to the "Right to Equality before law"?',
    userSelected: 'A',
    correctOption: 'A',
    isCorrect: true,
    marksObtained: 2,
    explanation:
      'Article 14 of the Constitution of India guarantees equality before the law and equal protection of the laws to all individuals within the territory of India.',
    options: [
      { id: 'A', text: 'Article 14' },
      { id: 'B', text: 'Article 19' },
      { id: 'C', text: 'Article 21' },
      { id: 'D', text: 'Article 32' },
    ],
  },
];

export const historyService = {
  async getAttemptHistory() {
    try {
      const data = await apiClient.get('/attempts-api/history?page=1&perPage=50');
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_HISTORY;
    } catch (err) {
      console.warn('API error fetching attempt history, using fallback:', err?.message);
      return FALLBACK_HISTORY;
    }
  },

  async getAttemptSolutions(attemptId) {
    try {
      const data = await apiClient.get(`/attempts-api/${attemptId}/solutions`);
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_SOLUTIONS;
    } catch (err) {
      console.warn('API error fetching solutions, using fallback:', err?.message);
      return FALLBACK_SOLUTIONS;
    }
  },
};

export default historyService;
