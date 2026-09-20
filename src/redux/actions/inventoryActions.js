const API_BASE = 'https://aptura-tech-solution-internship.vercel.app/api';

export const getInventory = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: 'inventory/fetchRequest' });
    
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/inventory${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch inventory');
    }

    dispatch({ type: 'inventory/fetchSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'inventory/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const getInventoryById = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'inventory/fetchRequest' });
    
    const response = await fetch(`${API_BASE}/inventory/${id}`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch inventory item');
    }

    dispatch({ type: 'inventory/fetchOneSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'inventory/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const createInventoryItem = (itemData) => async (dispatch) => {
  try {
    dispatch({ type: 'inventory/createRequest' });
    
    const response = await fetch(`${API_BASE}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(itemData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create inventory item');
    }

    dispatch({ type: 'inventory/createSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'inventory/createFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const updateInventoryItem = (id, itemData) => async (dispatch) => {
  try {
    dispatch({ type: 'inventory/updateRequest' });
    
    const response = await fetch(`${API_BASE}/inventory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(itemData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update inventory item');
    }

    dispatch({ type: 'inventory/updateSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'inventory/updateFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const deleteInventoryItem = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'inventory/deleteRequest' });
    
    const response = await fetch(`${API_BASE}/inventory/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete inventory item');
    }

    dispatch({ type: 'inventory/deleteSuccess', payload: id });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'inventory/deleteFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};