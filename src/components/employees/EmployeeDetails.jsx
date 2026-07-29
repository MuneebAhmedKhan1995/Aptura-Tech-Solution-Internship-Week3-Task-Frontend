import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById } from '../../redux/actions/employeeActions';
import { toast } from 'react-toastify';

const EmployeeDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedEmployee, loading, error } = useSelector((state) => state.employees);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeById(id));
    }
  }, [dispatch, id]);

  const handleEdit = () => {
    navigate(`/employees/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/employees');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader-spinner"></div>
        <p>Loading employee details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={handleBack} className="btn btn-secondary">
          Back to Employees
        </button>
      </div>
    );
  }

  if (!selectedEmployee) {
    return (
      <div className="error-container">
        <div className="error">Employee not found</div>
        <button onClick={handleBack} className="btn btn-secondary">
          Back to Employees
        </button>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="employee-details">
      <div className="page-header">
        <h1>Employee Details</h1>
        <div className="header-actions">
          <button onClick={handleBack} className="btn btn-secondary">
            Back
          </button>
          {isAdmin && (
            <button onClick={handleEdit} className="btn btn-primary">
              Edit Employee
            </button>
          )}
        </div>
      </div>

      <div className="details-card">
        <div className="details-header">
          <div className="avatar">
            {selectedEmployee.name?.charAt(0).toUpperCase() || 'E'}
          </div>
          <div className="employee-title">
            <h2>{selectedEmployee.name}</h2>
            <span className={`status-badge ${selectedEmployee.status?.toLowerCase()}`}>
              {selectedEmployee.status || 'Active'}
            </span>
          </div>
        </div>

        <div className="details-grid">
          <div className="details-section">
            <h3>Personal Information</h3>
            <div className="details-row">
              <span className="label">Employee ID:</span>
              <span>{selectedEmployee.id}</span>
            </div>
            <div className="details-row">
              <span className="label">Full Name:</span>
              <span>{selectedEmployee.name}</span>
            </div>
            <div className="details-row">
              <span className="label">Email:</span>
              <span>{selectedEmployee.email}</span>
            </div>
            <div className="details-row">
              <span className="label">Phone:</span>
              <span>{selectedEmployee.phone || '-'}</span>
            </div>
            <div className="details-row">
              <span className="label">Address:</span>
              <span>{selectedEmployee.address || '-'}</span>
            </div>
          </div>

          <div className="details-section">
            <h3>Employment Information</h3>
            <div className="details-row">
              <span className="label">Department:</span>
              <span>
                <span className={`department-badge ${selectedEmployee.department?.toLowerCase()}`}>
                  {selectedEmployee.department || '-'}
                </span>
              </span>
            </div>
            <div className="details-row">
              <span className="label">Position:</span>
              <span>{selectedEmployee.position || '-'}</span>
            </div>
            <div className="details-row">
              <span className="label">Salary:</span>
              <span className="amount">${selectedEmployee.salary?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="details-row">
              <span className="label">Hire Date:</span>
              <span>
                {selectedEmployee.hireDate
                  ? new Date(selectedEmployee.hireDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : '-'}
              </span>
            </div>
            <div className="details-row">
              <span className="label">Status:</span>
              <span className={`status-badge ${selectedEmployee.status?.toLowerCase()}`}>
                {selectedEmployee.status || 'Active'}
              </span>
            </div>
          </div>
        </div>

        {selectedEmployee.createdAt && (
          <div className="details-footer">
            <div className="details-row">
              <span className="label">Created At:</span>
              <span>{new Date(selectedEmployee.createdAt).toLocaleString()}</span>
            </div>
            {selectedEmployee.updatedAt && (
              <div className="details-row">
                <span className="label">Last Updated:</span>
                <span>{new Date(selectedEmployee.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity Section (Optional) */}
      <div className="recent-activity-card">
        <h3>Recent Activity</h3>
        <div className="activity-placeholder">
          <p>No recent activity found for this employee.</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;