// src/components/Event/EventTable.jsx
import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Filter from '../common/Filter';
import Table from '../common/Table';

const EventTable = () => {
  const { events, currentUser, updateEvent, deleteEvent } = useContext(AppContext);
  const [filteredEvents, setFilteredEvents] = useState(events);

  const columns = [
    { header: 'Event Name', accessor: 'eventName' },
    { header: 'Event Type', accessor: 'eventType' },
    { header: 'Venue', accessor: 'venue' },
    { header: 'Status', accessor: 'status' },
    { header: 'Mandal/Panchayat', accessor: 'mandalPanchayat' },
    { header: 'Requester Name', accessor: 'requesterName' },
    { header: 'Requester Contact', accessor: 'requesterContact' },
  ];

  const handleEdit = (id, field, value) => {
    const eventToUpdate = events.find(e => e.id === id);
    updateEvent({ ...eventToUpdate, [field]: value });
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Event Records</h2>
      
      <Filter 
        data={events} 
        setFilteredData={setFilteredEvents} 
        columns={columns.map(col => ({ value: col.accessor, label: col.header }))}
      />
      
      <Table
        data={filteredEvents}
        columns={columns}
        onEdit={currentUser.role === 'admin' || currentUser.role === 'user' ? handleEdit : null}
        onDelete={currentUser.role === 'admin' ? deleteEvent : null}
      />
    </div>
  );
};

export default EventTable;