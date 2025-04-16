import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as apiLogin,
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../services/api';

// Create Context
const AuthContext = createContext(null);

// Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('events'); // Added activeTab state
  const navigate = useNavigate();

  // Check authentication on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Try to get saved user from localStorage first
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
          } else {
            // Fetch user data if not in localStorage
            const user = await getMe();
            setCurrentUser(user);
            localStorage.setItem('user', JSON.stringify(user));
          }

          // Fetch all users if admin
          if (currentUser?.role === 'admin') {
            await refreshUsers();
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError(err.response?.data?.message || 'Authentication check failed');
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setUsers([]);
  };

  // Login function - updated to handle the response format you provided
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // The API response contains user data and token directly
      const userData = await apiLogin(credentials);
      
      // Extract token and store it
      const { token, ...userWithoutToken } = userData;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithoutToken));
      
      setCurrentUser(userWithoutToken);
      
      // Fetch users if admin
      if (userWithoutToken.role === 'admin') {
        await refreshUsers();
      }
      
      // Set default active tab based on user permissions
      if (userWithoutToken.assignedTables?.includes('event')) {
        setActiveTab('events');
      } else if (userWithoutToken.assignedTables?.includes('grievances')) {
        setActiveTab('grievances');
      } else if (userWithoutToken.assignedTables?.includes('party')) {
        setActiveTab('partyYouth');
      } else if (userWithoutToken.role === 'admin') {
        setActiveTab('userManagement');
      }
      
      navigate('/dashboard');
      return userWithoutToken;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Logout function
  const logout = useCallback(() => {
    clearAuthData();
    navigate('/');
  }, [navigate]);

  // Set active tab function
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Refresh users list (admin only)
  const refreshUsers = useCallback(async () => {
    try {
      const userList = await getUsers();
      setUsers(userList);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh users');
      throw err;
    }
  }, []);

  // Admin-only functions
  const addUser = async (userData) => {
    try {
      const newUser = await createUser(userData);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
      throw err;
    }
  };

  const editUser = async (id, updatedData) => {
    try {
      const updatedUser = await updateUser(id, updatedData);
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? updatedUser : user))
      );
      
      // Update current user if editing self
      if (currentUser?._id === id) {
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      throw err;
    }
  };

  const removeUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      
      // Logout if deleting current user
      if (currentUser?._id === id) {
        logout();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      throw err;
    }
  };

  const value = {
    currentUser,
    users,
    isLoading,
    error,
    activeTab,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    login,
    logout,
    handleTabChange,
    addUser,
    editUser,
    removeUser,
    refreshUsers,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};