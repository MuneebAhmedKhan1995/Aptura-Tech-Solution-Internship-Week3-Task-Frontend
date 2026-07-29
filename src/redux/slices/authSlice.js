import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      
      const userData = action.payload.user || {};
      state.user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        permissions: userData.permissions || []
      };
      state.token = action.payload.token;
      state.error = null;
      
      console.log('✅ Login Success - User:', state.user);
      console.log('📦 Permissions:', state.user.permissions);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setUser: (state, action) => {
      const userData = action.payload || {};
      state.user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        permissions: userData.permissions || []
      };
      state.isAuthenticated = true;
      
      console.log('✅ Set User - Permissions:', state.user.permissions);
    }
  }
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  setUser
} = authSlice.actions;

export default authSlice.reducer;