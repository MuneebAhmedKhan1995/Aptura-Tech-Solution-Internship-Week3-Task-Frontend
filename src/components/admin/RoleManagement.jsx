import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles, createRole, updateRole, deleteRole } from '../../redux/actions/roleActions';
import { toast } from 'react-toastify';

const RoleManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { roles, loading } = useSelector((state) => state.roles);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const permissionOptions = [
    { id: 'view_dashboard', label: 'View Dashboard' },
    { id: 'view_employees', label: 'View Employees' },
    { id: 'manage_employees', label: 'Manage Employees' },
    { id: 'view_inventory', label: 'View Inventory' },
    { id: 'manage_inventory', label: 'Manage Inventory' },
    { id: 'view_sales', label: 'View Sales' },
    { id: 'manage_sales', label: 'Manage Sales' },
    { id: 'view_reports', label: 'View Reports' },
    { id: 'view_logs', label: 'View Logs' },
    { id: 'manage_roles', label: 'Manage Roles' },
    { id: 'manage_users', label: 'Manage Users' },
    { id: 'delete_data', label: 'Delete Data' }
  ];

  if (user?.role !== 'admin') {
    return <div className="access-denied">Access Denied</div>;
  }

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  const handleAddRole = () => {
    setFormData({ name: '', description: '', permissions: [] });
    setShowAddModal(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions || []
    });
    setShowEditModal(true);
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    const result = await dispatch(createRole(formData));
    if (result.success) {
      toast.success('Role created successfully');
      setShowAddModal(false);
      dispatch(getRoles());
    } else {
      toast.error(result.error || 'Failed to create role');
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    const result = await dispatch(updateRole(selectedRole._id || selectedRole.id, formData));
    if (result.success) {
      toast.success('Role updated successfully');
      setShowEditModal(false);
      dispatch(getRoles());
    } else {
      toast.error(result.error || 'Failed to update role');
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    
    const result = await dispatch(deleteRole(roleId));
    if (result.success) {
      toast.success('Role deleted successfully');
      dispatch(getRoles());
    } else {
      toast.error(result.error || 'Failed to delete role');
    }
  };

  const getPermissionLabel = (permissionId) => {
    const perm = permissionOptions.find(p => p.id === permissionId);
    return perm ? perm.label : permissionId;
  };

  const sortedRoles = [...roles].sort((a, b) => {
    if (a.name === 'admin') return -1;
    if (b.name === 'admin') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="role-management">
      <div className="page-header">
        <h1>Role Management</h1>
        <button onClick={handleAddRole} className="btn btn-primary">
          + Add Role
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading roles...</div>
      ) : (
        <div className="roles-grid">
          {sortedRoles && sortedRoles.length > 0 ? (
            sortedRoles.map((role) => (
              <div key={role._id || role.id} className="role-card">
                <div className="role-header">
                  <h3>{role.name.replace('_', ' ').toUpperCase()}</h3>
                  <div className="role-actions">
                    <button onClick={() => handleEditRole(role)} className="btn btn-sm btn-warning">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteRole(role._id || role.id)} className="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
                <p className="role-description">{role.description || 'No description'}</p>
                <div className="permissions-list">
                  <strong>Permissions:</strong>
                  <div className="permission-tags">
                    {role.permissions && role.permissions.length > 0 ? (
                      role.permissions.map((perm) => (
                        <span key={perm} className="permission-tag">
                          {getPermissionLabel(perm)}
                        </span>
                      ))
                    ) : (
                      <span className="no-permissions">No permissions assigned</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">No roles found. Click "Add Role" to create one.</div>
          )}
        </div>
      )}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Role</h2>
              <button onClick={() => setShowAddModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Role Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-control"
                  placeholder="Enter role name (e.g., hr_manager)"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-control"
                  placeholder="Enter role description"
                />
              </div>
              <div className="form-group">
                <label>Permissions</label>
                <div className="permissions-grid">
                  {permissionOptions.map((perm) => (
                    <label key={perm.id} className="permission-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.id)}
                        onChange={() => handlePermissionToggle(perm.id)}
                      />
                      {perm.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Create Role</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Role</h2>
              <button onClick={() => setShowEditModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Role Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Permissions</label>
                <div className="permissions-grid">
                  {permissionOptions.map((perm) => (
                    <label key={perm.id} className="permission-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.id)}
                        onChange={() => handlePermissionToggle(perm.id)}
                      />
                      {perm.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Update Role</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;