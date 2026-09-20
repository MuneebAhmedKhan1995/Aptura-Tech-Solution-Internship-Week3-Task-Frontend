const API_BASE = 'https://aptura-tech-solution-internship.vercel.app/api';


export const getSalesReport = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: 'reports/fetchRequest' });
    
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/reports/sales${queryString ? `?${queryString}` : ''}`;
    
    console.log('📤 Fetching sales report:', url);
    
    const response = await fetch(url, {
      credentials: 'include'
    });

    const data = await response.json();


    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch sales report');
    }

    dispatch({ type: 'reports/fetchSalesSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    console.error('❌ Fetch sales report error:', error);
    dispatch({ type: 'reports/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const getInventoryReport = () => async (dispatch) => {
  try {
    dispatch({ type: 'reports/fetchRequest' });
    
    const response = await fetch(`${API_BASE}/reports/inventory`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch inventory report');
    }

    dispatch({ type: 'reports/fetchInventorySuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    console.error('❌ Fetch inventory report error:', error);
    dispatch({ type: 'reports/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};

export const getEmployeeReport = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: 'reports/fetchRequest' });
    
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/reports/employees${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      credentials: 'include'
    });

    const data = await response.json();


    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch employee report');
    }

    dispatch({ type: 'reports/fetchEmployeeSuccess', payload: data });
    return { success: true, data };
  } catch (error) {
    console.error('❌ Fetch employee report error:', error);
    dispatch({ type: 'reports/fetchFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};


export const exportReport = (type, format, params = {}) => async (dispatch) => {
  try {
    dispatch({ type: 'reports/exportRequest' });
    
    const queryString = new URLSearchParams({ format, ...params }).toString();
    const url = `${API_BASE}/reports/${type}/export?${queryString}`;
    
    console.log('📤 Exporting report:', url);
    
    const response = await fetch(url, {
      credentials: 'include'
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to export report');
    }

    const blob = await response.blob();
    const url2 = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url2;
    link.download = `${type}_report.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url2);

    dispatch({ type: 'reports/exportSuccess' });
    return { success: true };
  } catch (error) {
    console.error('❌ Export report error:', error);
    dispatch({ type: 'reports/exportFailure', payload: error.message });
    return { success: false, error: error.message };
  }
};