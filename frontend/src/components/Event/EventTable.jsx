// src/components/Event/EventTable.jsx
import { useContext, useEffect, useState } from 'react';
import Filter from '../common/Filter';
import Table from '../common/Table';
import { format, parseISO } from 'date-fns';
import { useEvents } from '../../context/EventContext';
import { AppContext } from '../../context/AppContext';

const EventTable = () => {
  const { events, loading, error, updateEvent, deleteEvent } = useEvents();
  const { currentUser } = useContext(AppContext) // Get current user from auth context
  const [filteredEvents, setFilteredEvents] = useState(events);
  useEffect(() => {
    console.log("events: ", events)
    setFilteredEvents(events);
  }, [events]);
  
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const columns = [
    { header: 'Event Name', accessor: 'eventName' },
    { 
      header: 'Type', 
      accessor: 'eventType', 
      cell: (value) => value.charAt(0).toUpperCase() + value.slice(1) 
    },
    { header: 'Venue', accessor: 'venue' },
    { 
      header: 'Date', 
      accessor: 'eventDate',
      cell: (value) => formatDate(value)
    },
    { 
      header: 'Time', 
      accessor: (row) => `${row.startTime} - ${row.endTime}` 
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (value) => value.charAt(0).toUpperCase() + value.slice(1),
      editable: (user) => user.role === 'admin' || user.assignedTables?.includes('event')
    },
    { header: 'Mandal', accessor: 'mandal' },
    { header: 'Requester', accessor: 'requesterName' },
    { header: 'Contact', accessor: 'requesterContact' },
  ];

  const handleEdit = async (id, field, value) => {
    try {
      const eventToUpdate = events.find(e => e._id === id);
      
      if (!eventToUpdate) {
        throw new Error('Event not found');
      }

      // Special handling for date field
      if (field === 'eventDate') {
        value = new Date(value).toISOString();
      }
      
      // Validate time fields
      if ((field === 'startTime' || field === 'endTime') && 
          !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
        throw new Error('Please enter time in HH:MM format');
      }

      // Create updated event object
      const updatedEvent = { 
        ...eventToUpdate, 
        [field]: value,
        updatedAt: new Date().toISOString()
      };

      await updateEvent(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      alert(error.message || 'Failed to update event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert(error.message || 'Failed to delete event');
      }
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Event Records</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <Filter 
        data={events} 
        setFilteredData={setFilteredEvents} 
        searchableColumns={['eventName', 'venue', 'requesterName', 'mandal']}
        filterOptions={[
          {
            label: 'Event Type',
            accessor: 'eventType',
            options: ['political', 'social', 'commercial', 'welfare']
          },
          {
            label: 'Status',
            accessor: 'status',
            options: ['pending', 'completed', 'cancelled']
          },
          {
            label: 'Mandal',
            accessor: 'mandal',
            options: Array.from(new Set(events.map(e => e.mandal))).sort()
          }
        ]}
      />
      
      {loading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : (
        <Table
          data={filteredEvents}
          columns={columns}
          onEdit={currentUser?.role === 'admin' || currentUser?.assignedTables?.includes('event') ? handleEdit : null}
          onDelete={currentUser?.role === 'admin' ? handleDelete : null}
          editableFields={['eventName', 'venue', 'status', 'eventDate', 'startTime', 'endTime']}
        />
      )}
    </div>
  );
};

export default EventTable;