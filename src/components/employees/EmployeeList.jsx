import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../../redux/actions/employeeActions';
import { toast } from 'react-toastify';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employees, loading, error } = useSelector((state) => state.employees);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    console.log('👤 Current User:', user);
    console.log('📦 User Permissions:', user?.permissions);
    console.log('🔑 Role:', user?.role);
  }, [user]);

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Invalid employee ID');
      return;
    }
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const result = await dispatch(deleteEmployee(id));
      if (result.success) {
        toast.success('Employee deleted successfully');
        dispatch(getEmployees());
      } else {
        toast.error(result.error || 'Failed to delete employee');
      }
    }
  };

  const getEmployeeId = (employee) => {
    return employee?._id || employee?.id || null;
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !department || emp.department === department;
    return matchesSearch && matchesDepartment;
  });


  const userPermissions = user?.permissions || [];
  const userRole = user?.role || '';
  
  
  const canViewEmployees = userPermissions.includes('view_employees') || userRole === 'admin';
  const canManageEmployees = userPermissions.includes('manage_employees') || userRole === 'admin';

  console.log('🔍 Permission Check:', {
    userPermissions,
    userRole,
    canViewEmployees,
    canManageEmployees
  });

  if (!canViewEmployees) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to view employees.</p>
        <p style={{ fontSize: '12px', color: '#6c757d' }}>
          Your role: {userRole} | Permissions: {userPermissions.join(', ') || 'None'}
        </p>
      </div>
    );
  }

  return (
    <div className="employee-list">
      <div className="page-header">
        <h1>Employees</h1>
        {canManageEmployees && (
          <Link to="/employees/add" className="btn btn-primary">
            + Add Employee
          </Link>
        )}
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="form-control"
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="IT">IT</option>
          <option value="Operations">Operations</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees && filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => {
                const empId = getEmployeeId(employee);
                return (
                  <tr key={empId || index}>
                    <td>{index + 1}</td>
                    <td>{employee.name || 'N/A'}</td>
                    <td>{employee.email || 'N/A'}</td>
                    <td>{employee.department || 'N/A'}</td>
                    <td>${employee.salary?.toFixed(2) || '0.00'}</td>
                    <td>
                      <span className={`status-badge ${employee.status?.toLowerCase() || 'active'}`}>
                        {employee.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      {empId ? (
                        <>
                          <Link to={`/employees/${empId}`} className="btn btn-sm btn-info">
                            View
                          </Link>
                          {canManageEmployees && (
                            <>
                              <Link to={`/employees/edit/${empId}`} className="btn btn-sm btn-warning">
                                Edit
                              </Link>
                              <button onClick={() => handleDelete(empId)} className="btn btn-sm btn-danger">
                                Delete
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <span className="text-muted">Invalid ID</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#6c757d' }}>
                  No employees found. {canManageEmployees && 'Add your first employee!'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;