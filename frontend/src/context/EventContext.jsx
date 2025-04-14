import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Check if token exists in localStorage to ensure user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        // User not authenticated, don't make the API call
        return;
      }
      
      const response = await api.get('/events');
      console.log('Events response:', response);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  // Create new event
  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      const response = await api.post('/events', eventData);
      setEvents(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing event
  const updateEvent = async (updatedEvent) => {
    try {
      setLoading(true);
      const response = await api.put(`/events/${updatedEvent._id}`, updatedEvent);
      setEvents(prev => 
        prev.map(event => 
          event._id === updatedEvent._id ? response.data : event
        )
      );
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      setLoading(true);
      await api.delete(`/events/${eventId}`);
      setEvents(prev => prev.filter(event => event._id !== eventId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter events by various criteria
  const filterEvents = (filters = {}) => {
    return events.filter(event => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return event[key] === value;
      });
    });
  };

  // Initialize with first fetch when the component mounts
  useEffect(() => {
    // Check if user is authenticated before fetching events
    const token = localStorage.getItem('token');
    if (token) {
      fetchEvents();
    }
  }, []);

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        filterEvents
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};