import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  salesReport: null,
  inventoryReport: null,
  employeeReport: null,
  loading: false,
  exporting: false,
  error: null
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    fetchRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSalesSuccess: (state, action) => {
      state.loading = false;
      const payload = action.payload;
      if (payload && payload.data) {
        state.salesReport = payload.data;
      } else {
        state.salesReport = payload;
      }
      console.log('📊 Sales Report Data:', state.salesReport);
    },
    fetchInventorySuccess: (state, action) => {
      state.loading = false;
      const payload = action.payload;
      if (payload && payload.data) {
        state.inventoryReport = payload.data;
      } else {
        state.inventoryReport = payload;
      }
      console.log('📊 Inventory Report Data:', state.inventoryReport);
    },
    fetchEmployeeSuccess: (state, action) => {
      state.loading = false;
      const payload = action.payload;
      if (payload && payload.data) {
        state.employeeReport = payload.data;
      } else {
        state.employeeReport = payload;
      }
      console.log('📊 Employee Report Data:', state.employeeReport);
    },
    exportRequest: (state) => {
      state.exporting = true;
      state.error = null;
    },
    exportSuccess: (state) => {
      state.exporting = false;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    exportFailure: (state, action) => {
      state.exporting = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchRequest,
  fetchSalesSuccess,
  fetchInventorySuccess,
  fetchEmployeeSuccess,
  exportRequest,
  exportSuccess,
  fetchFailure,
  exportFailure
} = reportSlice.actions;

export default reportSlice.reducer;