import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import catalogService from '../../api/catalogService';
import testService from '../../api/testService';

export const fetchCategories = createAsyncThunk(
  'catalog/fetchCategories',
  async () => {
    return await catalogService.getCategories();
  }
);

export const fetchPopularSeries = createAsyncThunk(
  'catalog/fetchPopularSeries',
  async () => {
    return await catalogService.getPopularSeries();
  }
);

export const fetchFeaturedTests = createAsyncThunk(
  'catalog/fetchFeaturedTests',
  async () => {
    return await catalogService.getFeaturedTests();
  }
);

export const fetchSeriesDetail = createAsyncThunk(
  'catalog/fetchSeriesDetail',
  async (seriesId) => {
    return await testService.getSeriesById(seriesId);
  }
);

export const fetchTestStructure = createAsyncThunk(
  'catalog/fetchTestStructure',
  async (testId) => {
    return await testService.getMockTestStructure(testId);
  }
);

const initialState = {
  categories: [],
  popularSeries: [],
  featuredTests: [],
  selectedCategory: 'all',
  searchQuery: '',
  currentSeries: null,
  currentTestStructure: null,
  loading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearCurrentSeries(state) {
      state.currentSeries = null;
    },
    clearCurrentTestStructure(state) {
      state.currentTestStructure = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CATEGORIES
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // POPULAR SERIES
      .addCase(fetchPopularSeries.fulfilled, (state, action) => {
        state.popularSeries = action.payload;
      })

      // FEATURED TESTS
      .addCase(fetchFeaturedTests.fulfilled, (state, action) => {
        state.featuredTests = action.payload;
      })

      // SERIES DETAIL
      .addCase(fetchSeriesDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSeriesDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSeries = action.payload;
      })

      // TEST STRUCTURE
      .addCase(fetchTestStructure.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTestStructure = action.payload;
      });
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  clearCurrentSeries,
  clearCurrentTestStructure,
} = catalogSlice.actions;

export default catalogSlice.reducer;
