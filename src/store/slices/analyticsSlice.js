import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import leaderboardService from '../../api/leaderboardService';
import historyService from '../../api/historyService';

export const fetchLeaderboard = createAsyncThunk(
  'analytics/fetchLeaderboard',
  async (testSlug) => {
    return await leaderboardService.getTestLeaderboard(testSlug);
  }
);

export const fetchHistory = createAsyncThunk(
  'analytics/fetchHistory',
  async () => {
    return await historyService.getAttemptHistory();
  }
);

export const fetchSolutions = createAsyncThunk(
  'analytics/fetchSolutions',
  async (attemptId) => {
    return await historyService.getAttemptSolutions(attemptId);
  }
);

const initialState = {
  leaderboard: [],
  history: [],
  solutions: [],
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LEADERBOARD
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // HISTORY
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // SOLUTIONS
      .addCase(fetchSolutions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSolutions.fulfilled, (state, action) => {
        state.loading = false;
        state.solutions = action.payload;
      })
      .addCase(fetchSolutions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default analyticsSlice.reducer;
