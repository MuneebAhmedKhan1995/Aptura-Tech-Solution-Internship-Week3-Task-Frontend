import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createEmployee, updateEmployee, getEmployeeById } from '../../redux/actions/employeeActions';
import { toast } from 'react-toastify';

const EmployeeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedEmployee, loading } = useSelector((state) => state.employees);
  const { user } = useSelector((state) => state.auth);
  
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: '',
    hireDate: '',
    phone: '',
    address: '',
    status: 'Active'
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEdit && !selectedEmployee) {
      dispatch(getEmployeeById(id));
    }
    if (isEdit && selectedEmployee) {
      setFormData({
        name: selectedEmployee.user?.name || selectedEmployee.name || '',
        email: selectedEmployee.user?.email || selectedEmployee.email || '',
        department: selectedEmployee.department || '',
        position: selectedEmployee.position || '',
        salary: selectedEmployee.salary || '',
        hireDate: selectedEmployee.hireDate?.split('T')[0] || '',
        phone: selectedEmployee.phone || '',
        address: selectedEmployee.address || '',
        status: selectedEmployee.status || 'Active'
      });
    }
  }, [dispatch, id, selectedEmployee, isEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.department) {
      errors.department = 'Department is required';
    }
    
    if (!formData.position.trim()) {
      errors.position = 'Position is required';
    }
    
    if (!formData.salary || parseFloat(formData.salary) <= 0) {
      errors.salary = 'Salary must be greater than 0';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all errors');
      return;
    }

    const employeeData = {
      name: formData.name,
      email: formData.email,
      department: formData.department,
      position: formData.position,
      salary: parseFloat(formData.salary) || 0,
      hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
      phone: formData.phone,
      address: formData.address || '',
      status: formData.status
    };

    let result;
    if (isEdit) {
      result = await dispatch(updateEmployee(id, employeeData));
    } else {
      result = await dispatch(createEmployee(employeeData));
    }

    if (result.success) {
      toast.success(isEdit ? 'Employee updated successfully' : 'Employee created successfully');
      navigate('/employees');
    } else {
      const errorMsg = result.error || 'Operation failed';
      toast.error(errorMsg);
    
      if (result.errors) {
        result.errors.forEach(err => {
          setFormErrors(prev => ({
            ...prev,
            [err.field]: err.message
          }));
        });
      }
    }
  };
  if (user?.role !== 'admin') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to manage employees.</p>
      </div>
    );
  }

  return (
    <div className="employee-form">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>
        <button onClick={() => navigate('/employees')} className="btn btn-secondary">
          ← Back
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${formErrors.name ? 'error' : ''}`}
              placeholder="Enter full name"
              required
            />
            {formErrors.name && <span className="error-text">{formErrors.name}</span>}
          </div>
          
     
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${formErrors.email ? 'error' : ''}`}
              placeholder="Enter email"
              required
            />
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>
          
       
          <div className="form-group">
            <label>Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`form-control ${formErrors.department ? 'error' : ''}`}
              required
            >
              <option value="">Select Department</option>
              <option value="Engineering">⚙️ Engineering</option>
              <option value="Sales">📈 Sales</option>
              <option value="Marketing">📢 Marketing</option>
              <option value="HR">👥 HR</option>
              <option value="Finance">💰 Finance</option>
              <option value="IT">💻 IT</option>
              <option value="Operations">📋 Operations</option>
            </select>
            {formErrors.department && <span className="error-text">{formErrors.department}</span>}
          </div>
          
    
          <div className="form-group">
            <label>Position *</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={`form-control ${formErrors.position ? 'error' : ''}`}
              placeholder="Enter position"
              required
            />
            {formErrors.position && <span className="error-text">{formErrors.position}</span>}
          </div>
          
     
          <div className="form-group">
            <label>Salary *</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className={`form-control ${formErrors.salary ? 'error' : ''}`}
              placeholder="Enter salary"
              min="0"
              step="1000"
              required
            />
            {formErrors.salary && <span className="error-text">{formErrors.salary}</span>}
          </div>
          
      
          <div className="form-group">
            <label>Hire Date *</label>
            <input
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          
    
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-control ${formErrors.phone ? 'error' : ''}`}
              placeholder="Enter phone number"
              required
            />
            {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
          </div>
          
   
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Active">✅ Active</option>
              <option value="Inactive">❌ Inactive</option>
              <option value="On Leave">⏳ On Leave</option>
            </select>
          </div>
          

          <div className="form-group full-width">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Enter address (optional)"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Employee' : 'Create Employee')}
          </button>
          <button type="button" onClick={() => navigate('/employees')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;