const API_BASE = 'https://aptura-tech-solution-internship.vercel.app/api';

export const getUsers = () => async (dispatch) => {
  try {
    dispatch({ type: 'users/fetchRequest' });
    
    const response = await fetch(`${API_BASE}/users`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    dispatch({ type: 'users/fetchSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'users/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const getUserById = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'users/fetchRequest' });
    
    const response = await fetch(`${API_BASE}/users/${id}`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user');
    }

    dispatch({ type: 'users/fetchOneSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'users/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const createUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: 'users/createRequest' });
    
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }

    dispatch({ type: 'users/createSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'users/createFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: 'users/updateRequest' });
    
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user');
    }

    dispatch({ type: 'users/updateSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'users/updateFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'users/deleteRequest' });
    
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete user');
    }

    dispatch({ type: 'users/deleteSuccess', payload: id });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'users/deleteFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};