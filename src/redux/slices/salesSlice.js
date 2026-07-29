import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sales: [],
  selectedSale: null,
  total: 0,
  loading: false,
  error: null
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    fetchRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      const payload = action.payload;
      
      console.log('📥 Sales fetchSuccess payload:', payload);
      
      if (payload && payload.data) {
        state.sales = payload.data;
        state.total = payload.total || payload.data.length;
        console.log('✅ Sales set:', state.sales.length);
      } else if (Array.isArray(payload)) {
        state.sales = payload;
        state.total = payload.length;
      } else {
        state.sales = payload || [];
        state.total = payload?.length || 0;
      }
    },
    fetchOneSuccess: (state, action) => {
      state.loading = false;
      const payload = action.payload;
      if (payload && payload.data) {
        state.selectedSale = payload.data;
      } else {
        state.selectedSale = payload;
      }
    },
    createRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createSuccess: (state, action) => {
      state.loading = false;
      const newSale = action.payload?.data || action.payload;
      state.sales = [newSale, ...state.sales];
    },
    updateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload?.data || action.payload;
      const index = state.sales.findIndex(s => (s._id || s.id) === (updated._id || updated.id));
      if (index !== -1) {
        state.sales[index] = updated;
      }
      if (state.selectedSale && (state.selectedSale._id || state.selectedSale.id) === (updated._id || updated.id)) {
        state.selectedSale = updated;
      }
    },
    deleteRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteSuccess: (state, action) => {
      state.loading = false;
      const id = action.payload;
      state.sales = state.sales.filter(s => (s._id || s.id) !== id);
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchRequest,
  fetchSuccess,
  fetchOneSuccess,
  createRequest,
  createSuccess,
  updateRequest,
  updateSuccess,
  deleteRequest,
  deleteSuccess,
  fetchFailure,
  createFailure,
  updateFailure,
  deleteFailure
} = salesSlice.actions;

export default salesSlice.reducer;