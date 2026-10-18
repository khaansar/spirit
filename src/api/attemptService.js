import apiClient, { apiClientRaw } from './client';

let saveQueue = Promise.resolve();
let authoritativeVersion = null;

export function parseOptions(optionsJson) {
  if (!optionsJson) return [];

  let parsed = optionsJson;

  if (typeof optionsJson === 'string') {
    try {
      parsed = JSON.parse(optionsJson);
    } catch {
      // Handle PowerShell or map format: @{key1=val1; key2=val2}
      const match = optionsJson.match(/@\{(.+)\}/);
      if (match) {
        const pairs = match[1].split(';');
        const obj = {};
        pairs.forEach((p) => {
          const eqIdx = p.indexOf('=');
          if (eqIdx !== -1) {
            const k = p.slice(0, eqIdx).trim();
            const v = p.slice(eqIdx + 1).trim();
            if (k) obj[k] = v;
          }
        });
        parsed = obj;
      }
    }
  }

  if (Array.isArray(parsed)) {
    return parsed.map((option, index) => ({
      id: String(option.id ?? index),
      text: String(option.text ?? option.value ?? ''),
    }));
  }

  if (parsed && typeof parsed === 'object') {
    return Object.entries(parsed).map(([id, value]) => ({
      id,
      text: typeof value === 'string' ? value : String(value?.text ?? value ?? ''),
    }));
  }

  return [];
}

export const SAMPLE_EXAM_DATA = {
  attemptId: 'att-sample-01',
  testId: 'mock-cgl-01',
  title: 'SSC CGL Tier 1 - All India Full Mock #01',
  durationMinutes: 60,
  sections: [
    {
      id: 'sec-1',
      name: 'General Intelligence & Reasoning',
      durationMinutes: 15,
      questions: [
        {
          id: 'q-101',
          type: 'MCQ',
          text: 'Select the related word from the given alternatives:\n\nThermometer : Temperature :: Hygrometer : ?',
          marks: 2,
          negativeMarks: 0.5,
          options: [
            { id: 'A', text: 'Atmospheric Pressure' },
            { id: 'B', text: 'Humidity' },
            { id: 'C', text: 'Wind Velocity' },
            { id: 'D', text: 'Density of Liquid' },
          ],
        },
        {
          id: 'q-102',
          type: 'MCQ',
          text: 'Find the missing number in the series:\n\n4, 9, 25, 49, 121, ?',
          marks: 2,
          negativeMarks: 0.5,
          options: [
            { id: 'A', text: '144' },
            { id: 'B', text: '169' },
            { id: 'C', text: '196' },
            { id: 'D', text: '225' },
          ],
        },
        {
          id: 'q-103',
          type: 'MCQ',
          text: 'If in a certain code language, "PENCIL" is written as "QGPEKN", then how will "MARKER" be written in that language?',
          marks: 2,
          negativeMarks: 0.5,
          options: [
            { id: 'A', text: 'NCTMGT' },
            { id: 'B', text: 'OBVNGT' },
            { id: 'C', text: 'NCSMGT' },
            { id: 'D', text: 'ODVNHU' },
          ],
        },
      ],
    },
    {
      id: 'sec-2',
      name: 'Quantitative Aptitude',
      durationMinutes: 20,
      questions: [
        {
          id: 'q-201',
          type: 'MCQ',
          text: 'If x + (1/x) = 5, find the value of x^2 + (1/x^2):',
          marks: 2,
          negativeMarks: 0.5,
          options: [
            { id: 'A', text: '23' },
            { id: 'B', text: '25' },
            { id: 'C', text: '27' },
            { id: 'D', text: '21' },
          ],
        },
        {
          id: 'q-202',
          type: 'MCQ',
          text: 'A train 180 meters long is running at a speed of 54 km/h. How much time will it take to cross a platform 270 meters long?',
          marks: 2,
          negativeMarks: 0.5,
          options: [
            { id: 'A', text: '25 seconds' },
            { id: 'B', text: '30 seconds' },
            { id: 'C', text: '36 seconds' },
            { id: 'D', text: '40 seconds' },
          ],
        },
      ],
    },
  ],
};

export const attemptService = {
  /**
   * Starts a new attempt on the Baahubali backend.
   * Requires Authorization Bearer token.
   */
  async startAttempt(testId, durationMinutes) {
    const res = await apiClient.post('/attempts-api/', {
      testId,
      durationMinutes: Number(durationMinutes) || 60,
    });
    return res;
  },

  /**
   * Fetches full attempt state including test structure and parsed questions.
   */
  async getAttemptState(attemptId, testId) {
    let attemptRes = null;
    let attemptVersion = 0;
    try {
      const rawRes = await apiClientRaw.get(`/attempts-api/${attemptId}`);
      attemptRes = rawRes?.data || rawRes || {};
      attemptVersion = rawRes?.meta?.attemptVersion ?? attemptRes?.attemptVersion ?? 0;
    } catch (e) {
      console.warn('Could not fetch attempt state directly:', e?.message);
    }

    const effectiveTestId = attemptRes?.testId || testId;

    if (!effectiveTestId) {
      throw new Error('Test identifier is required to load questions.');
    }

    // Fetch the real test structure with all sections and questions
    const structureRes = await apiClient.get(
      `/tests-api/catalog/mock-tests/${encodeURIComponent(effectiveTestId)}/structure`
    );

    if (!structureRes || !structureRes.sections) {
      throw new Error('Exam structure could not be retrieved from server.');
    }

    // Parse sections and question options
    const sections = structureRes.sections.map((sec, secIdx) => {
      const rawQuestions = sec.questions || [];
      const parsedQuestions = rawQuestions.map((q, qIdx) => ({
        id: q.questionId || `q-${secIdx}-${qIdx}`,
        type: q.questionType || 'MCQ',
        text: q.questionText || '',
        options: parseOptions(q.optionsJson),
        marks: Number(q.positiveMarks) || 2,
        negativeMarks: Number(q.negativeMarks) || 0,
        questionImages: q.questionImages || [],
        optionImages: q.optionImages || {},
      }));

      return {
        id: sec.sectionId || `sec-${secIdx}`,
        name: sec.title || `Section ${secIdx + 1}`,
        durationMinutes: sec.durationMinutes || 30,
        questions: parsedQuestions,
      };
    });

    return {
      attemptId: attemptRes?.attemptId || attemptId,
      testId: effectiveTestId,
      title: structureRes.title || 'Mock Examination',
      durationMinutes: structureRes.totalDurationMinutes || 60,
      sections,
      serverAnswers: attemptRes?.answers || {},
      attemptVersion,
    };
  },

  /**
   * Saves student answer responses sequentially using PatchAttemptRequest schema.
   * Chained to saveQueue to completely eliminate concurrent version races.
   */
  async saveResponse(attemptId, { questionId, selectedOption, currentQuestionIndex = 0, version = 0, currentSectionId = null }) {
    const job = saveQueue
      .catch(() => {})
      .then(async () => {
        let currentVer = authoritativeVersion !== null ? authoritativeVersion : Number(version) || 0;
        let conflictRetries = 0;
        const MAX_CONFLICT_RETRIES = 3;

        while (true) {
          try {
            const payload = {
              questionId,
              selectedOption: selectedOption || null,
              currentQuestionIndex: Number(currentQuestionIndex) || 0,
              version: currentVer,
            };
            if (currentSectionId) {
              payload.currentSectionId = currentSectionId;
            }

            const rawRes = await apiClientRaw.patch(`/attempts-api/${attemptId}`, payload);
            const newVer = rawRes?.meta?.attemptVersion ?? rawRes?.data?.attemptVersion;
            if (Number.isFinite(newVer)) {
              authoritativeVersion = newVer;
            } else {
              authoritativeVersion = currentVer + 1;
            }

            return {
              success: true,
              attemptVersion: authoritativeVersion,
              data: rawRes?.data || rawRes,
            };
          } catch (err) {
            if (err?.status === 409 && conflictRetries < MAX_CONFLICT_RETRIES) {
              conflictRetries++;
              try {
                const freshRaw = await apiClientRaw.get(`/attempts-api/${attemptId}`);
                const freshVer = freshRaw?.meta?.attemptVersion ?? freshRaw?.data?.attemptVersion;
                if (Number.isFinite(freshVer)) {
                  currentVer = freshVer;
                  authoritativeVersion = freshVer;
                  continue;
                }
              } catch (_) {}
            }
            console.warn(`Could not sync response for question ${questionId}:`, err?.message);
            return {
              success: false,
              attemptVersion: authoritativeVersion || currentVer,
              error: err?.message,
            };
          }
        }
      });

    saveQueue = job;
    return job;
  },

  /**
   * Submits the attempt to the backend and polls for the evaluated report.
   */
  async submitAttempt(attemptId, payload = {}) {
    // 1. Await any in-flight autosaves
    try {
      await saveQueue;
    } catch (_) {}

    // 2. Submit the attempt to the backend
    try {
      await apiClient.post(`/attempts-api/${attemptId}/submit`);
    } catch (submitErr) {
      const msg = submitErr?.message || '';
      const status = submitErr?.status;
      if (
        status === 409 ||
        status === 410 ||
        msg.toLowerCase().includes('already submitted') ||
        msg.toLowerCase().includes('submitted')
      ) {
        // Attempt already marked submitted on backend, proceed to report retrieval
      } else {
        console.warn('Backend submitAttempt response:', msg);
      }
    }

    // 3. Poll for the evaluated report card (analytics-service computes rank/percentiles asynchronously via Kafka)
    let report = null;
    const maxRetries = 6;
    for (let i = 0; i < maxRetries; i++) {
      await new Promise((resolve) => setTimeout(resolve, i === 0 ? 1500 : 1200));
      try {
        const res = await apiClient.get(`/analytics-api/reports/${attemptId}`);
        if (res && (res.summary || res.metadata)) {
          report = res;
          break;
        }
      } catch (err) {
        // Report still being computed, retry
      }
    }

    if (report && report.summary) {
      return {
        ...report,
        attemptId,
        score: report.summary.totalScore,
        totalMarks: report.summary.maxScore,
        accuracy: report.summary.accuracyPercentage ?? report.summary.accuracy,
        percentile: report.summary.percentile,
        rank: report.summary.rank,
      };
    }

    return {
      success: true,
      attemptId,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
    };
  },

  /**
   * Fetches official evaluation report card for an attempt.
   */
  async getAttemptReport(attemptId) {
    return await apiClient.get(`/analytics-api/reports/${attemptId}`);
  },
};

export default attemptService;
