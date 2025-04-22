import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const PartyAndYouthContext = createContext();

export const PartyAndYouthProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all members (with optional filters)
  const fetchMembers = async (filters = {}) => {
    try {
      setLoading(true);
      
      // Convert filters object to query parameters
      const params = new URLSearchParams();
      
      // if (filters.search) params.append('search', filters.search);
      if (filters.mandal) params.append('mandal', filters.mandal);
      if (filters.designation) params.append('designation', filters.designation);
      
      // Make the API call with query parameters
      const response = await api.get(`/party-members?${params.toString()}`);
      
      console.log('Party members response:', response);
      setMembers(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error fetching party members:', err);
      setError(err.response?.data?.message || 'Failed to fetch party members');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new member (public access)
  const createMember = async (memberData) => {
    try {
      setLoading(true);
      const response = await api.post('/party-members', memberData);
      setMembers(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing member
  const updateMember = async (memberId, updatedData) => {
    try {
      setLoading(true);
      const response = await api.put(`/party-members/${memberId}`, updatedData);
      setMembers(prev => 
        prev.map(member => 
          member._id === memberId ? response.data : member
        )
      );
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete member
  const deleteMember = async (memberId) => {
    try {
      setLoading(true);
      await api.delete(`/party-members/${memberId}`);
      setMembers(prev => prev.filter(member => member._id !== memberId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter members by various criteria
  const filterMembers = (filters = {}) => {
    return members.filter(member => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return member[key] === value;
      });
    });
  };


  return (
    <PartyAndYouthContext.Provider
      value={{
        members,
        loading,
        error,
        fetchMembers,
        createMember,
        updateMember,
        deleteMember,
        filterMembers
      }}
    >
      {children}
    </PartyAndYouthContext.Provider>
  );
};

export const usePartyAndYouth = () => {
  const context = useContext(PartyAndYouthContext);
  if (!context) {
    throw new Error('usePartyAndYouth must be used within a PartyAndYouthProvider');
  }
  return context;
};