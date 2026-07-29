import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [],
  selectedEmployee: null,
  total: 0,
  loading: false,
  error: null
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    fetchRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.employees = action.payload.data || action.payload;
      state.total = action.payload.total || action.payload.length;
    },
    fetchOneSuccess: (state, action) => {
      state.loading = false;
      state.selectedEmployee = action.payload;
    },
    createRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createSuccess: (state, action) => {
      state.loading = false;
      state.employees = [action.payload, ...state.employees];
    },
    updateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload.id) {
        state.selectedEmployee = action.payload;
      }
    },
    deleteRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteSuccess: (state, action) => {
      state.loading = false;
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
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
} = employeeSlice.actions;

export default employeeSlice.reducer;