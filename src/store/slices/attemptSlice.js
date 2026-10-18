import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import attemptService, { SAMPLE_EXAM_DATA } from '../../api/attemptService';

export const startAttemptThunk = createAsyncThunk(
  'attempt/startAttempt',
  async ({ testId, durationMinutes }, { rejectWithValue }) => {
    try {
      // 1. Create attempt record on backend
      let attemptId = null;
      try {
        const startRes = await attemptService.startAttempt(testId, durationMinutes);
        attemptId = startRes?.attemptId || startRes?.id;
      } catch (startErr) {
        console.warn('Backend startAttempt error:', startErr?.message);
        attemptId = 'att-' + Date.now();
      }

      // 2. Fetch real questions and structure from backend
      const fullState = await attemptService.getAttemptState(attemptId, testId);
      return fullState;
    } catch (err) {
      console.warn('Error initializing test attempt:', err?.message);
      return rejectWithValue(err?.message || 'Failed to initialize exam');
    }
  }
);

export const submitAttemptThunk = createAsyncThunk(
  'attempt/submitAttempt',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { attempt } = getState();
      const payload = {
        responses: attempt.responses,
        timeSpentSeconds: attempt.durationMinutes * 60 - attempt.timeRemainingSeconds,
      };
      const result = await attemptService.submitAttempt(attempt.attemptId, payload);
      return result;
    } catch (err) {
      return rejectWithValue(err?.message || 'Submission failed');
    }
  }
);

const initialState = {
  attemptId: null,
  testId: null,
  testTitle: 'Mock Exam',
  durationMinutes: 60,
  timeRemainingSeconds: 3600,
  sections: [],
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  responses: {}, // { [qId]: { selected: ['A'], marked: false, visited: true } }
  status: 'idle', // 'idle' | 'loading' | 'active' | 'submitting' | 'submitted' | 'error'
  isPaletteOpen: false,
  isSubmitModalOpen: false,
  lastResult: null,
  error: null,
};

const attemptSlice = createSlice({
  name: 'attempt',
  initialState,
  reducers: {
    initLocalExam(state, action) {
      // If already active with populated questions, preserve existing state
      if (
        state.status === 'active' &&
        Array.isArray(state.sections) &&
        state.sections.length > 0 &&
        state.sections[0]?.questions?.length > 0
      ) {
        return;
      }

      const data = action.payload || SAMPLE_EXAM_DATA;
      state.attemptId = data.attemptId || 'att-' + Date.now();
      state.testId = data.testId || 'test-1';
      state.testTitle = data.title || 'Mock Test';
      state.durationMinutes = data.durationMinutes || 60;
      state.timeRemainingSeconds = (data.durationMinutes || 60) * 60;

      const hasQuestions =
        Array.isArray(data.sections) &&
        data.sections.some((s) => Array.isArray(s.questions) && s.questions.length > 0);

      state.sections = hasQuestions ? data.sections : SAMPLE_EXAM_DATA.sections;
      state.currentSectionIndex = 0;
      state.currentQuestionIndex = 0;
      state.responses = {};
      state.status = 'active';
      state.isPaletteOpen = false;
      state.isSubmitModalOpen = false;

      // Mark the first question as visited
      const firstQId = state.sections?.[0]?.questions?.[0]?.id;
      if (firstQId) {
        state.responses[firstQId] = { selected: [], marked: false, visited: true };
      }
    },

    selectAnswer(state, action) {
      const { questionId, optionId, isMulti = false } = action.payload;
      const existing = state.responses[questionId] || { selected: [], marked: false, visited: true };

      if (isMulti) {
        const set = new Set(existing.selected || []);
        if (set.has(optionId)) {
          set.delete(optionId);
        } else {
          set.add(optionId);
        }
        state.responses[questionId] = {
          ...existing,
          selected: Array.from(set),
          visited: true,
        };
      } else {
        state.responses[questionId] = {
          ...existing,
          selected: [optionId],
          visited: true,
        };
      }
    },

    clearAnswer(state, action) {
      const { questionId } = action.payload;
      if (state.responses[questionId]) {
        state.responses[questionId].selected = [];
      }
    },

    toggleMarkForReview(state, action) {
      const { questionId } = action.payload;
      const existing = state.responses[questionId] || { selected: [], marked: false, visited: true };
      state.responses[questionId] = {
        ...existing,
        marked: !existing.marked,
        visited: true,
      };
    },

    setCurrentSection(state, action) {
      state.currentSectionIndex = action.payload;
      state.currentQuestionIndex = 0;

      // Mark first question of newly selected section as visited
      const currentQId = state.sections[state.currentSectionIndex]?.questions?.[0]?.id;
      if (currentQId && !state.responses[currentQId]) {
        state.responses[currentQId] = { selected: [], marked: false, visited: true };
      }
    },

    setCurrentQuestion(state, action) {
      state.currentQuestionIndex = action.payload;
      const currentQId =
        state.sections[state.currentSectionIndex]?.questions?.[state.currentQuestionIndex]?.id;
      if (currentQId) {
        state.responses[currentQId] = {
          ...(state.responses[currentQId] || { selected: [], marked: false }),
          visited: true,
        };
      }
    },

    nextQuestion(state) {
      const currentSec = state.sections[state.currentSectionIndex];
      if (!currentSec) return;

      if (state.currentQuestionIndex < currentSec.questions.length - 1) {
        state.currentQuestionIndex += 1;
      } else if (state.currentSectionIndex < state.sections.length - 1) {
        state.currentSectionIndex += 1;
        state.currentQuestionIndex = 0;
      }

      const currentQId =
        state.sections[state.currentSectionIndex]?.questions?.[state.currentQuestionIndex]?.id;
      if (currentQId) {
        state.responses[currentQId] = {
          ...(state.responses[currentQId] || { selected: [], marked: false }),
          visited: true,
        };
      }
    },

    prevQuestion(state) {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      } else if (state.currentSectionIndex > 0) {
        state.currentSectionIndex -= 1;
        const prevSec = state.sections[state.currentSectionIndex];
        state.currentQuestionIndex = (prevSec?.questions?.length || 1) - 1;
      }

      const currentQId =
        state.sections[state.currentSectionIndex]?.questions?.[state.currentQuestionIndex]?.id;
      if (currentQId) {
        state.responses[currentQId] = {
          ...(state.responses[currentQId] || { selected: [], marked: false }),
          visited: true,
        };
      }
    },

    tickTimer(state) {
      if (state.status === 'active' && state.timeRemainingSeconds > 0) {
        state.timeRemainingSeconds -= 1;
      }
    },

    setPaletteOpen(state, action) {
      state.isPaletteOpen = action.payload;
    },

    setSubmitModalOpen(state, action) {
      state.isSubmitModalOpen = action.payload;
    },

    resetAttempt() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder
      // START ATTEMPT
      .addCase(startAttemptThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(startAttemptThunk.fulfilled, (state, action) => {
        const data = action.payload || SAMPLE_EXAM_DATA;
        state.attemptId = data.attemptId || 'att-' + Date.now();
        state.testTitle = data.title || 'Mock Test';
        state.durationMinutes = data.durationMinutes || 60;
        state.timeRemainingSeconds = (data.durationMinutes || 60) * 60;
        state.sections = data.sections || [];
        state.currentSectionIndex = 0;
        state.currentQuestionIndex = 0;
        state.responses = {};
        if (data.serverAnswers && typeof data.serverAnswers === 'object') {
          Object.entries(data.serverAnswers).forEach(([qId, val]) => {
            state.responses[qId] = {
              selected: val ? [val] : [],
              marked: false,
              visited: true,
            };
          });
        }
        state.status = 'active';

        const firstQId = data.sections?.[0]?.questions?.[0]?.id;
        if (firstQId && !state.responses[firstQId]) {
          state.responses[firstQId] = { selected: [], marked: false, visited: true };
        }
      })
      .addCase(startAttemptThunk.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })

      // SUBMIT ATTEMPT
      .addCase(submitAttemptThunk.pending, (state) => {
        state.status = 'submitting';
      })
      .addCase(submitAttemptThunk.fulfilled, (state, action) => {
        state.status = 'submitted';
        state.lastResult = action.payload;
        state.isSubmitModalOpen = false;
        state.isPaletteOpen = false;
      })
      .addCase(submitAttemptThunk.rejected, (state, action) => {
        state.status = 'active';
        state.error = action.payload;
      });
  },
});

export const {
  initLocalExam,
  selectAnswer,
  clearAnswer,
  toggleMarkForReview,
  setCurrentSection,
  setCurrentQuestion,
  nextQuestion,
  prevQuestion,
  tickTimer,
  setPaletteOpen,
  setSubmitModalOpen,
  resetAttempt,
} = attemptSlice.actions;

export default attemptSlice.reducer;
