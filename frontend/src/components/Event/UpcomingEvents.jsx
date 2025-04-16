import React from 'react';
import { useEvents } from '../../context/EventContext';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const formatTime = (time) => {
  const [hour, minute] = time.split(':');
  const formattedTime = new Date(0, 0, 0, hour, minute);
  return formattedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const StatusBadge = ({ status }) => {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-rose-100 text-rose-800'
  };
  
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const EventCard = ({ event }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="flex-shrink-0 w-full md:w-48">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 h-full flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-indigo-600">
            {new Date(event.eventDate).getDate()}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {new Date(event.eventDate).toLocaleString('default', { month: 'short' })}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            {new Date(event.eventDate).toLocaleString('default', { weekday: 'short' })}
          </span>
        </div>
      </div>
      
      <div className="flex-grow">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{event.eventName}</h3>
            <StatusBadge status={event.status} />
          </div>
          
          <p className="text-sm text-gray-500 mb-2">{event.eventType}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.venue}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {event.mandal}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {event.requesterContact}
            </div>
          </div>
          
          <div className="mt-auto pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Requested by: <span className="font-medium">{event.requesterName}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpcomingEvents = () => {
  const { events } = useEvents();
  
  // Sort events by date (closest first)
  const sortedEvents = [...events]
    .map(event => ({
      ...event,
      eventDate: new Date(event.eventDate),
    }))
    .sort((a, b) => a.eventDate - b.eventDate)
    .filter(event => event.eventDate >= new Date()); // Only show future events

  return (
    <div className="p-6 bg-gray-50 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
          {sortedEvents.length} {sortedEvents.length === 1 ? 'Event' : 'Events'}
        </span>
      </div>
      
      {sortedEvents.length > 0 ? (
        <div className="space-y-4">
          {sortedEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming events</h3>
          <p className="mt-1 text-gray-500">All upcoming events will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;