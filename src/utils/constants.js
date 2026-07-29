// API Base URL
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
};

export const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance'
];

export const STATUSES = {
  EMPLOYEE: ['Active', 'Inactive', 'On Leave'],
  SALE: ['Pending', 'Completed', 'Cancelled'],
  INVENTORY: ['In Stock', 'Low Stock', 'Out of Stock']
};

export const REPORT_TYPES = {
  SALES: 'sales',
  INVENTORY: 'inventory',
  EMPLOYEES: 'employees'
};

export const EXPORT_FORMATS = ['pdf', 'excel', 'csv'];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20
};