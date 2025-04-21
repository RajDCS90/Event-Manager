import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  // Remove the default Content-Type header as we'll set it dynamically
});

// Add JWT to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Dynamically set Content-Type based on data type
    if (!config.headers['Content-Type']) {
      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout if 401 response returned from api
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Users API (admin only)
export const getUsers = async () => {
  try {
    const response = await api.get('/auth');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const updateUserPassword = async (id, newPassword) => {
  console.log('updateUserPassword')
  const res = await api.patch(`/auth/password/${id}`, { newPassword });
  return res.data;
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/auth', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/auth/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/auth/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const putWithFormData = async (url, formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  try {
    const response = await api.put(url, formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};



// Export the configured axios instance for other API calls
export default api;