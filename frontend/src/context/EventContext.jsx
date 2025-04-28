import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api, { putWithFormData } from '../services/api';
import { useToast } from './ToastContext';

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
  const { notify } = useToast(); // Get the notify function from ToastContext

  // Memoized fetchEvents with useCallback

const fetchEvents = useCallback(async (filters = {}) => {
  try {
    setLoading(true);
    
    console.log(filters);
    
    // Only include page in params initially
    const params = {
      ...filters
    };
    
    // Remove empty filters to ensure backend defaults are used
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });

    // Handle date range filters
    if (filters.dateRange) {
      if (filters.dateRange.eventDate) {
        params.eventDate = filters.dateRange.eventDate;
      } else if (filters.dateRange.startDate && filters.dateRange.endDate) {
        params.dateRange = `${filters.dateRange.startDate},${filters.dateRange.endDate}`;
      }
    }

    const response = await api.get('/events', { params });
    
    setEvents(response.data.events || []);
    setPagination({
      page: response.data.page,
      limit: response.data.limit,
      totalCount: response.data.totalCount,
      totalPages: response.data.totalPages
    });
    setError(null);
  } catch (err) {
    console.error('Error fetching events:', err);
    setError(err.response?.data?.message || 'Failed to fetch events');
  } finally {
    setLoading(false);
  }
}, []);

  // Memoized createEvent
  const createEvent = useCallback(async (eventData) => {
    try {
      setLoading(true);
      const response = await api.post('/events', eventData);
      await fetchEvents({}, pagination.page, pagination.limit);
      setError(null);
      notify('Event created successfully!', 'success');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create event';
      setError(errorMessage);
      notify(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents, pagination.page, pagination.limit]);

  // Memoized updateEvent
  const updateEvent = useCallback(async (updatedEvent) => {
    try {
      setLoading(true);
      
      // Remove the wrapping object and send FormData directly
      const response = await api.put(
        `/events/${updatedEvent._id}`,
        updatedEvent.formData, // Send FormData directly
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      await fetchEvents({}, pagination.page, pagination.limit);
      setError(null);
      notify('Event updated successfully!', 'success');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update event';
      setError(errorMessage);
      notify(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents, pagination.page, pagination.limit]);
  

  // Memoized deleteEvent
  const deleteEvent = useCallback(async (eventId) => {
    try {
      setLoading(true);
      await api.delete(`/events/${eventId}`);
      await fetchEvents({}, pagination.page, pagination.limit);
      setError(null);
      notify('Event deleted successfully!', 'success');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete event';
      setError(errorMessage);
      notify(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents, pagination.page, pagination.limit]);

  // Memoized filterEvents
  const filterEvents = useCallback((filters = {}) => {
    return events.filter(event => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        if (key.startsWith('address.')) {
          const addressKey = key.split('.')[1];
          return event.address[addressKey]?.toLowerCase().includes(value.toLowerCase());
        }
        
        if (key === 'eventDate' && value instanceof Date) {
          const eventDate = new Date(event[key]);
          return eventDate.toDateString() === value.toDateString();
        }
        
        if (typeof event[key] === 'string') {
          return event[key].toLowerCase().includes(value.toLowerCase());
        }
        
        return event[key] === value;
      });
    });
  }, [events]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    events,
    pagination,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    filterEvents
  }), [
    events,
    pagination,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    filterEvents
  ]);

  return (
    <EventContext.Provider value={contextValue}>
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