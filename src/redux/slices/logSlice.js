import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logs: [],
  total: 0,
  loading: false,
  clearing: false,
  error: null
};

const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    fetchRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.logs = action.payload.data || action.payload;
      state.total = action.payload.total || action.payload.length;
    },
    clearRequest: (state) => {
      state.clearing = true;
      state.error = null;
    },
    clearSuccess: (state, action) => {
      state.clearing = false;
      state.logs = state.logs.filter(log => 
        new Date(log.timestamp) > new Date(action.payload.olderThan)
      );
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearFailure: (state, action) => {
      state.clearing = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchRequest,
  fetchSuccess,
  clearRequest,
  clearSuccess,
  fetchFailure,
  clearFailure
} = logSlice.actions;

export default logSlice.reducer;