const API_BASE = 'http://localhost:5004/api';

export const getSales = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: 'sales/fetchRequest' });
    
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/sales${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch sales');
    }

    dispatch({ type: 'sales/fetchSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'sales/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const getSaleById = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'sales/fetchRequest' });
    
    const response = await fetch(`${API_BASE}/sales/${id}`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch sale');
    }

    dispatch({ type: 'sales/fetchOneSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'sales/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const createSale = (saleData) => async (dispatch) => {
  try {
    dispatch({ type: 'sales/createRequest' });
    
    const response = await fetch(`${API_BASE}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(saleData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create sale');
    }

    dispatch({ type: 'sales/createSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'sales/createFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};



export const updateSaleStatus = (id, status) => async (dispatch) => {
  try {
    dispatch({ type: 'sales/updateRequest' });
    
    const response = await fetch(`${API_BASE}/sales/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ paymentStatus: status })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update sale status');
    }

    dispatch({ type: 'sales/updateSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'sales/updateFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};
export const deleteSale = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'sales/deleteRequest' });
    
    const response = await fetch(`${API_BASE}/sales/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete sale');
    }

    dispatch({ type: 'sales/deleteSuccess', payload: id });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'sales/deleteFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};