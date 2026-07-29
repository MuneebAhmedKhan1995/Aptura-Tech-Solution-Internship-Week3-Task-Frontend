import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import EmployeeList from './components/employees/EmployeeList';
import EmployeeForm from './components/employees/EmployeeForm';
import EmployeeDetails from './components/employees/EmployeeDetails';
import InventoryList from './components/inventory/InventoryList';
import InventoryForm from './components/inventory/InventoryForm';
import InventoryDetails from './components/inventory/InventoryDetails';
import SalesList from './components/sales/SalesList';
import SalesForm from './components/sales/SalesForm';
import SalesDetails from './components/sales/SalesDetails';
import ReportDashboard from './components/reports/ReportDashboard';
import ActivityLogs from './components/logs/ActivityLogs';
import RoleManagement from './components/admin/RoleManagement';
import UserManagement from './components/admin/UserManagement';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            
           
            <Route path="employees/add" element={<EmployeeForm />} />
            <Route path="employees/edit/:id" element={<EmployeeForm />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />
            <Route path="employees" element={<EmployeeList />} />
            
            
            <Route path="inventory/add" element={<InventoryForm />} />
            <Route path="inventory/edit/:id" element={<InventoryForm />} />
            <Route path="inventory/:id" element={<InventoryDetails />} />
            <Route path="inventory" element={<InventoryList />} />
            
         
            <Route path="sales/add" element={<SalesForm />} />
            <Route path="sales/:id" element={<SalesDetails />} />
            <Route path="sales" element={<SalesList />} />
            
            
            <Route path="reports" element={<ReportDashboard />} />
            <Route path="logs" element={<ActivityLogs />} />
            
            
            <Route path="admin/roles" element={<RoleManagement />} />
            <Route path="admin/users" element={<UserManagement />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          <Outlet />  
        </div>
      </div>
    </div>
  );
}

export default App;