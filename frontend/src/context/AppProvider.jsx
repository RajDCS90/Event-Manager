// src/context/AppProvider.js
import { useState, useEffect } from 'react';
import { AppContext } from './AppContext';
import { initialEvents, initialGrievances, initialPartyYouth, initialUsers } from '../data/initialData';
import { getMe } from '../services/api';

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState(initialEvents);
  const [grievances, setGrievances] = useState(initialGrievances);
  const [partyYouth, setPartyYouth] = useState(initialPartyYouth);
  const [activeTab, setActiveTab] = useState('events');

  // Initialize with admin user
  // useEffect(() => {
  //   const adminUser = users.find(user => user.role === 'admin');
  //   setCurrentUser(adminUser);
  // }, []);

   // Check for logged in user on initial load
   useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const user = await getMe();
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const loginUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };


  // // Switch user role for demo purposes
  // const switchUser = (userId) => {
  //   const user = users.find(u => u.id === userId);
  //   setCurrentUser(user);
  // };

  // Common CRUD operations
  const addEvent = (event) => {
    setEvents([...events, { ...event, id: Date.now() }]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  // Grievance CRUD operations
  const addGrievance = (grievance) => {
    setGrievances([...grievances, grievance]);
  };

  const updateGrievance = (updatedGrievance) => {
    setGrievances(grievances.map(g => g.id === updatedGrievance.id ? updatedGrievance : g));
  };

  const deleteGrievance = (id) => {
    setGrievances(grievances.filter(g => g.id !== id));
  };

  // Party & Youth CRUD operations
  const addPartyYouth = (member) => {
    setPartyYouth([...partyYouth, member]);
  };

  const updatePartyYouth = (updatedMember) => {
    setPartyYouth(partyYouth.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const deletePartyYouth = (id) => {
    setPartyYouth(partyYouth.filter(m => m.id !== id));
  };

  // User management
  const addUser = (user) => {
    setUsers([...users, { ...user, id: Date.now() }]);
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    // If we're deleting the current user, switch back to admin
    if (currentUser.id === id) {
      const adminUser = users.find(user => user.role === 'admin' && user.id !== id);
      if (adminUser) {
        setCurrentUser(adminUser);
      }
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    isLoading,
    users,
    deleteUser,
    loginUser,
    logoutUser,
    events,
    grievances,
    partyYouth,
    activeTab,
    setActiveTab,
    // switchUser,
    addEvent,
    updateEvent,
    deleteEvent,
    addUser,
    addGrievance,
    updateGrievance,
    deleteGrievance,
    addPartyYouth,
    updatePartyYouth,
    deletePartyYouth,
    // Add other CRUD operations
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};