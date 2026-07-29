const API_BASE = 'http://localhost:5004/api';

export const getActivityLogs = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: 'logs/fetchRequest' });
    
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/logs${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch activity logs');
    }

    dispatch({ type: 'logs/fetchSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'logs/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const clearLogs = (olderThan) => async (dispatch) => {
  try {
    dispatch({ type: 'logs/clearRequest' });
    
    const response = await fetch(`${API_BASE}/logs/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ olderThan })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to clear logs');
    }

    dispatch({ type: 'logs/clearSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: 'logs/clearFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};