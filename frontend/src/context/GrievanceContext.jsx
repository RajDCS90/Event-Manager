// src/context/GrievanceContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const GrievanceContext = createContext();

export const useGrievance = () => useContext(GrievanceContext);

export const GrievanceProvider = ({ children }) => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGrievances = async (filters = {}) => {
    try {
      setLoading(true);
      // Check if token exists in localStorage to ensure user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        // User not authenticated, don't make the API call
        setLoading(false);
        return;
      }
      
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/grievances?${query}`);
      setGrievances(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch grievances:', err);
      setError(err.response?.data?.message || 'Failed to fetch grievances');
    } finally {
      setLoading(false);
    }
  };

  const addGrievance = async (data) => {
    try {
      setLoading(true);
      const res = await api.post('/grievances', data);
      setGrievances(prev => [...prev, res.data]);
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Failed to add grievance:', err);
      setError(err.response?.data?.message || 'Failed to add grievance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGrievance = async (id, data) => {
    try {
      setLoading(true);
      const res = await api.put(`/grievances/${id}`, data);
      setGrievances(prev =>
        prev.map(g => (g._id === id ? res.data : g))
      );
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Failed to update grievance:', err);
      setError(err.response?.data?.message || 'Failed to update grievance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGrievance = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/grievances/${id}`);
      setGrievances(prev => prev.filter(g => g._id !== id));
      setError(null);
    } catch (err) {
      console.error('Failed to delete grievance:', err);
      setError(err.response?.data?.message || 'Failed to delete grievance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize with checking if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchGrievances();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <GrievanceContext.Provider value={{
      grievances,
      loading,
      error,
      fetchGrievances,
      addGrievance,
      updateGrievance,
      deleteGrievance,
    }}>
      {children}
    </GrievanceContext.Provider>
  );
};