import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    pages: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch events with filtering and pagination
const fetchEvents = async (filters = {}, page = 1, limit = 100) => {
    try {
      setLoading(true);
      
      // Prepare query params
      const params = {
        page,
        limit,
        ...filters
      };

      // Convert date range to server format if present
      if (filters.startDate && filters.endDate) {
        params.dateRange = `${filters.startDate},${filters.endDate}`;
        delete params.startDate;
        delete params.endDate;
      }

      const response = await api.get('/events', { params });
      
      setEvents(response.data.events || []);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        pages: response.data.pages
      });
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
      // Refresh events list after creation
      await fetchEvents({}, pagination.page, pagination.limit);
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
      // Refresh events list after update
      await fetchEvents({}, pagination.page, pagination.limit);
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
      // Refresh events list after deletion
      await fetchEvents({}, pagination.page, pagination.limit);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering (optional)
  const filterEvents = (filters = {}) => {
    return events.filter(event => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        // Handle nested address fields
        if (key.startsWith('address.')) {
          const addressKey = key.split('.')[1];
          return event.address[addressKey]?.toLowerCase().includes(value.toLowerCase());
        }
        
        // Handle date filtering
        if (key === 'eventDate' && value instanceof Date) {
          const eventDate = new Date(event[key]);
          return eventDate.toDateString() === value.toDateString();
        }
        
        // Case-insensitive string matching
        if (typeof event[key] === 'string') {
          return event[key].toLowerCase().includes(value.toLowerCase());
        }
        
        // Exact matching for other types
        return event[key] === value;
      });
    });
  };

  return (
    <EventContext.Provider
      value={{
        events,
        pagination,
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