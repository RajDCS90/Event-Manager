import { useEffect, useState } from 'react';
import Filter from '../common/Filter';
import Table from '../common/Table';
import { format, parseISO } from 'date-fns';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';

const EventTable = () => {
  const { events, loading, error, updateEvent, deleteEvent } = useEvents();
  const { currentUser } = useAuth();
  const [filteredEvents, setFilteredEvents] = useState(events);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Convert "09:00" to "9:00 AM" format
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const columns = [
    { 
      header: 'Event Name', 
      accessor: 'eventName',
      editable: (user) => user.role === 'admin' || user.assignedTables?.includes('event')
    },
    { 
      header: 'Type', 
      accessor: 'eventType', 
      cell: (value) => value.charAt(0).toUpperCase() + value.slice(1),
      editable: (user) => user.role === 'admin',
      editType: 'select',
      editOptions: [
        { value: 'political', label: 'Political' },
        { value: 'social', label: 'Social' },
        { value: 'commercial', label: 'Commercial' },
        { value: 'welfare', label: 'Welfare' }
      ]
    },
    { 
      header: 'Venue', 
      accessor: 'venue',
      editable: (user) => user.role === 'admin' || user.assignedTables?.includes('event')
    },
    { 
      header: 'Date', 
      accessor: 'eventDate',
      cell: (value) => formatDate(value),
      editable: (user) => user.role === 'admin' || user.assignedTables?.includes('event'),
      editType: 'date'
    },
    { 
      header: 'Start Time', 
      accessor: 'startTime',
      cell: (value) => formatTime(value),
      editable: (user) => user.role === 'admin' || user.assignedTables?.includes('event'),
      editType: 'time'
    },
    { 
      header: 'End Time', 
      accessor: 'endTime',
      cell: (value) => formatTime(value),
      editable: (user) => user.role === 'admin' || user.assignedTables?.includes('event'),
      editType: 'time'
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (value) => value.charAt(0).toUpperCase() + value.slice(1),
      editable: (user) => user.role === 'admin' || user.assignedTables?.includes('event'),
      editType: 'select',
      editOptions: [
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    { 
      header: 'Mandal', 
      accessor: 'mandal',
      editable: (user) => user.role === 'admin',
      editType: 'select',
      editOptions: [
        'Mandal 1',
        'Mandal 2',
        'Mandal 3',
        'Mandal 4',
        'Mandal 5'
      ].map(m => ({ value: m, label: m }))
    },
    { 
      header: 'Requester', 
      accessor: 'requesterName',
      editable: (user) => user.role === 'admin' || user.assignedTables?.includes('event')
    },
    { 
      header: 'Contact', 
      accessor: 'requesterContact',
      editable: (user) => user.role === 'admin' || user.assignedTables?.includes('event'),
      editType: 'tel'
    },
    { 
      header: 'Actions',
      accessor: '_id',
      cell: (id) => (
        <div className="flex space-x-2">
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => handleDelete(id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          )}
        </div>
      )
    }
  ];

  const handleEdit = async (id, field, value) => {
    try {
      const eventToUpdate = events.find(e => e._id === id);
      
      if (!eventToUpdate) {
        throw new Error('Event not found');
      }

      // Validate time fields
      if ((field === 'startTime' || field === 'endTime') && 
          !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
        throw new Error('Please enter time in HH:MM format (24-hour)');
      }

      // Validate end time is after start time if both are being updated
      if (field === 'startTime' || field === 'endTime') {
        const startTime = field === 'startTime' ? value : eventToUpdate.startTime;
        const endTime = field === 'endTime' ? value : eventToUpdate.endTime;
        
        if (startTime >= endTime) {
          throw new Error('End time must be after start time');
        }
      }

      const updatedEvent = { 
        ...eventToUpdate, 
        [field]: value,
        updatedAt: new Date().toISOString()
      };

      await updateEvent(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      alert(error.message || 'Failed to update event');
      throw error; // Re-throw to prevent the table from updating
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
            options: ['Mandal 1', 'Mandal 2', 'Mandal 3', 'Mandal 4', 'Mandal 5']
          }
        ]}
      />
      
      {loading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : (
        <Table
          data={filteredEvents}
          columns={columns}
          onEdit={handleEdit}
          editableFields={['eventName', 'eventType', 'venue', 'eventDate', 'startTime', 'endTime', 'status', 'mandal', 'requesterName', 'requesterContact']}
        />
      )}
    </div>
  );
};

export default EventTable;