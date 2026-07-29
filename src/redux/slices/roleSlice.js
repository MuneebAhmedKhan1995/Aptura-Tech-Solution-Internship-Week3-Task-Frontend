import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roles: [],
  selectedRole: null,
  loading: false,
  error: null
};

const roleSlice = createSlice({
  name: 'roles',
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
        state.roles = payload.data;
      } else if (Array.isArray(payload)) {
        state.roles = payload;
      } else {
        state.roles = payload || [];
      }
    },
    fetchOneSuccess: (state, action) => {
      state.loading = false;
      const payload = action.payload;
      state.selectedRole = payload?.data || payload;
    },
    createRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createSuccess: (state, action) => {
      state.loading = false;
      const newRole = action.payload?.data || action.payload;
      state.roles = [newRole, ...state.roles];
    },
    updateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload?.data || action.payload;
      const index = state.roles.findIndex(r => (r._id || r.id) === (updated._id || updated.id));
      if (index !== -1) {
        state.roles[index] = updated;
      }
      if (state.selectedRole && (state.selectedRole._id || state.selectedRole.id) === (updated._id || updated.id)) {
        state.selectedRole = updated;
      }
    },
    deleteRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteSuccess: (state, action) => {
      state.loading = false;
      const id = action.payload;
      state.roles = state.roles.filter(r => (r._id || r.id) !== id);
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
} = roleSlice.actions;

export default roleSlice.reducer;