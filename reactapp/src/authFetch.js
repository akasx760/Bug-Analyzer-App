// authFetch.js
import API_BASE_URL from './api';

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
    
    // Check if response is JSON before trying to parse it
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }
    
    // Check for other error statuses
    if (!response.ok) {
      let errorData;
      if (isJson) {
        errorData = await response.json();
      } else {
        const text = await response.text();
        // Try to extract error message from HTML if possible
        const match = text.match(/<title>(.*?)<\/title>/i) || text.match(/<h1>(.*?)<\/h1>/i);
        errorData = { message: match ? match[1] : `HTTP error! status: ${response.status}` };
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Return appropriate data based on content type
    if (isJson) {
      return response.json();
    } else {
      return response.text();
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};