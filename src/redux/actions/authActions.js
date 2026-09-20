const API_BASE = 'https://aptura-tech-solution-internship.vercel.app/api';

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: 'auth/loginRequest' });
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    if (data.user && !data.user.permissions) {
      data.user.permissions = [];
    }

    console.log('📥 Login Response:', data);

    dispatch({ type: 'auth/loginSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    console.error('❌ Login error:', error);
    dispatch({ type: 'auth/loginFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    dispatch({ type: 'auth/logout' });
    return { success: true };
  } catch (error) {
    console.error('❌ Logout error:', error);
    return { success: false, error: error.message };
  }
};
export const getCurrentUser = () => async (dispatch) => {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user');
    }

    if (data.user && !data.user.permissions) {
      data.user.permissions = [];
    }

    console.log('📥 Get Current User Response:', data);

    dispatch({ type: 'auth/setUser', payload: data.user });
    return { success: true, data };
  } catch (error) {
    console.error('❌ Get current user error:', error);
    dispatch({ type: 'auth/logout' });
    return { success: false, error: error.message };
  }
};