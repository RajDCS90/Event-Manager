// src/context/GrievanceContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api, { getMe } from '../services/api';

const GrievanceContext = createContext();

export const useGrievance = () => useContext(GrievanceContext);

export const GrievanceProvider = ({ children }) => {
  const [grievances, setGrievances] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGrievances = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/grievances?${query}`);
      setGrievances(res.data);
    } catch (err) {
      console.error('Failed to fetch grievances:', err);
    }
  };

  const addGrievance = async (data) => {
    try {
      const res = await api.post('/grievances', data);
      setGrievances(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add grievance:', err);
    }
  };

  const updateGrievance = async (id, data) => {
    try {
      const res = await api.put(`/grievances/${id}`, data);
      setGrievances(prev =>
        prev.map(g => (g._id === id ? res.data : g))
      );
    } catch (err) {
      console.error('Failed to update grievance:', err);
    }
  };

  const deleteGrievance = async (id) => {
    try {
      await api.delete(`/grievances/${id}`);
      setGrievances(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      console.error('Failed to delete grievance:', err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await getMe();
      setCurrentUser(user);
    } catch (err) {
      console.error('Failed to get current user:', err);
    }
  };

  useEffect(() => {
    fetchCurrentUser().then(fetchGrievances).finally(() => setLoading(false));
  }, []);

  return (
    <GrievanceContext.Provider value={{
      grievances,
      currentUser,
      loading,
      fetchGrievances,
      addGrievance,
      updateGrievance,
      deleteGrievance,
    }}>
      {children}
    </GrievanceContext.Provider>
  );
};
