// contexts/MandalContext.js
import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const MandalContext = createContext();

export const MandalProvider = ({ children }) => {
  const [mandals, setMandals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMandals = async () => {
    console.log("fetch")
    setLoading(true);
    try {
      const response = await api.get('/mandal');
      console.log("resss",response)
      setMandals(response.data.data);
      console.log("mandals",mandals)
    } catch (err) {
      console.log("errr",err)
      setError(err.response?.data?.message || 'Failed to fetch mandals');
    } finally {
      setLoading(false);
    }
  };

  const createMandal = async (mandalData) => {
    try {
      const response = await api.post('/mandal', mandalData);
      setMandals([...mandals, response.data.data]);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to create mandal';
    }
  };

  const updateMandal = async (id, mandalData) => {
    try {
      const response = await api.put(`/mandal/${id}`, mandalData);
      setMandals(mandals.map(m => m._id === id ? response.data.data : m));
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to update mandal';
    }
  };

  const deleteMandal = async (id) => {
    try {
      await api.delete(`/mandal/${id}`);
      setMandals(mandals.filter(m => m._id !== id));
      return { success: true };
    } catch (err) {
      throw err.response?.data?.message || 'Failed to delete mandal';
    }
  };

  return (
    <MandalContext.Provider
      value={{
        mandals,
        loading,
        error,
        fetchMandals,
        createMandal,
        updateMandal,
        deleteMandal
      }}
    >
      {children}
    </MandalContext.Provider>
  );
};

export const useMandal = () => useContext(MandalContext);