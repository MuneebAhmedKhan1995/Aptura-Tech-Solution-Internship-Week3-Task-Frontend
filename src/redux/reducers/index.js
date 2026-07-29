import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import employeeReducer from '../slices/employeeSlice';
import inventoryReducer from '../slices/inventorySlice';
import salesReducer from '../slices/salesSlice';
import reportReducer from '../slices/reportSlice';
import logReducer from '../slices/logSlice';
import roleReducer from '../slices/roleSlice';
import userReducer from '../slices/userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  employees: employeeReducer,
  inventory: inventoryReducer,
  sales: salesReducer,
  reports: reportReducer,
  logs: logReducer,
  roles: roleReducer,
  users: userReducer
});

export default rootReducer;