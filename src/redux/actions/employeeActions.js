const API_BASE = 'http://localhost:5004/api';

export const getEmployees = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: 'employees/fetchRequest' });
    
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/employees${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch employees');
    }

    dispatch({ type: 'employees/fetchSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'employees/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const getEmployeeById = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'employees/fetchRequest' });
    
    const response = await fetch(`${API_BASE}/employees/${id}`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch employee');
    }

    dispatch({ type: 'employees/fetchOneSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'employees/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const createEmployee = (employeeData) => async (dispatch) => {
  try {
    dispatch({ type: 'employees/createRequest' });
    
    const response = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(employeeData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create employee');
    }

    dispatch({ type: 'employees/createSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'employees/createFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const updateEmployee = (id, employeeData) => async (dispatch) => {
  try {
    dispatch({ type: 'employees/updateRequest' });
    
    const response = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(employeeData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update employee');
    }

    dispatch({ type: 'employees/updateSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'employees/updateFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};
export const deleteEmployee = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'employees/deleteRequest' });
    
    const response = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete employee');
    }

    dispatch({ type: 'employees/deleteSuccess', payload: id });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'employees/deleteFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};