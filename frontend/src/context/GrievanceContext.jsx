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
      // Convert date filter to ISO string if it's a Date object
      const processedFilters = { ...filters };
      if (processedFilters.programDate instanceof Date) {
        processedFilters.programDate = processedFilters.programDate.toISOString().split('T')[0];
      }
      
      const query = new URLSearchParams(processedFilters).toString();
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