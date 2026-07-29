import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
  total: 0,
  loading: false,
  error: null
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    fetchRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      const payload = action.payload;
      if (payload && payload.data) {
        state.items = payload.data;
        state.total = payload.total || payload.data.length;
      } else if (Array.isArray(payload)) {
        state.items = payload;
        state.total = payload.length;
      } else {
        state.items = payload || [];
        state.total = payload?.length || 0;
      }
    },
    fetchOneSuccess: (state, action) => {
      state.loading = false;
      const payload = action.payload;
      if (payload && payload.data) {
        state.selectedItem = payload.data;
      } else {
        state.selectedItem = payload;
      }
    },
    createRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createSuccess: (state, action) => {
      state.loading = false;
      const newItem = action.payload?.data || action.payload;
      state.items = [newItem, ...state.items];
    },
    updateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload?.data || action.payload;
      const index = state.items.findIndex(item => (item._id || item.id) === (updated._id || updated.id));
      if (index !== -1) {
        state.items[index] = updated;
      }
      if (state.selectedItem && (state.selectedItem._id || state.selectedItem.id) === (updated._id || updated.id)) {
        state.selectedItem = updated;
      }
    },
    deleteRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteSuccess: (state, action) => {
      state.loading = false;
      const id = action.payload;
      state.items = state.items.filter(item => (item._id || item.id) !== id);
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
} = inventorySlice.actions;

export default inventorySlice.reducer;