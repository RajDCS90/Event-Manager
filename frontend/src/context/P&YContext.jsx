import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const PartyAndYouthContext = createContext();

export const PartyAndYouthProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { notify } = useToast(); // Get the notify function from ToastContext
  

  // Fetch all members (with optional filters)
  const fetchMembers = async (filters = {}) => {
    try {
      setLoading(true);
      
      // Convert filters object to query parameters
      const params = new URLSearchParams();
      
      // if ( filters.search) params.append('search', filters.search);
      if (filters.status) params.append("status", filters.status);
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
      notify('Member created successfully!', 'success');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create member';
      setError(errorMessage);
      notify(errorMessage, 'error');
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
      notify('Member updated successfully!', 'success');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update member';
      setError(errorMessage);
      notify(errorMessage, 'error');
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
      notify('Member deleted successfully!', 'success');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete member';
      setError(errorMessage);
      notify(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reactivate an inactive member
const reactivateMember = async (memberId) => {
  try {
    setLoading(true);
    const response = await api.put(`/party-members/reactivate/${memberId}`);
    setMembers(prev =>
      prev.map(member =>
        member._id === memberId ? response.data.member : member
      )
    );
    setError(null);
    notify('Member reactivated successfully!', 'success');
    return response.data.member;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to reactivate member';
    setError(errorMessage);
    notify(errorMessage, 'error');
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
        reactivateMember, 
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