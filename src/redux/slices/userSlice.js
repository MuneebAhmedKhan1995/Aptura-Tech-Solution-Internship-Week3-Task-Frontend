import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  selectedUser: null,
  total: 0,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'users',
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
        state.users = payload.data;
        state.total = payload.total || payload.data.length;
      } else if (Array.isArray(payload)) {
        state.users = payload;
        state.total = payload.length;
      } else {
        state.users = payload || [];
        state.total = payload?.length || 0;
      }
    },
    fetchOneSuccess: (state, action) => {
      state.loading = false;
      const payload = action.payload;
      state.selectedUser = payload?.data || payload;
    },
    createRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createSuccess: (state, action) => {
      state.loading = false;
      const newUser = action.payload?.data || action.payload;
      state.users = [newUser, ...state.users];
    },
    updateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload?.data || action.payload;
      const index = state.users.findIndex(u => (u._id || u.id) === (updated._id || updated.id));
      if (index !== -1) {
        state.users[index] = updated;
      }
      if (state.selectedUser && (state.selectedUser._id || state.selectedUser.id) === (updated._id || updated.id)) {
        state.selectedUser = updated;
      }
    },
    deleteRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteSuccess: (state, action) => {
      state.loading = false;
      const id = action.payload;
      state.users = state.users.filter(u => (u._id || u.id) !== id);
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
} = userSlice.actions;

export default userSlice.reducer;