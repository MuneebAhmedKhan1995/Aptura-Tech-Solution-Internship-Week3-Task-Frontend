const API_BASE = 'http://localhost:5004/api';

export const getRoles = () => async (dispatch) => {
  try {
    dispatch({ type: 'roles/fetchRequest' });
    
    const response = await fetch(`${API_BASE}/roles`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch roles');
    }

    dispatch({ type: 'roles/fetchSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'roles/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const createRole = (roleData) => async (dispatch) => {
  try {
    dispatch({ type: 'roles/createRequest' });
    
    const response = await fetch(`${API_BASE}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(roleData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create role');
    }

    dispatch({ type: 'roles/createSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'roles/createFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const updateRole = (id, roleData) => async (dispatch) => {
  try {
    dispatch({ type: 'roles/updateRequest' });
    
    const response = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(roleData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update role');
    }

    dispatch({ type: 'roles/updateSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'roles/updateFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const deleteRole = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'roles/deleteRequest' });
    
    const response = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete role');
    }

    dispatch({ type: 'roles/deleteSuccess', payload: id });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'roles/deleteFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};