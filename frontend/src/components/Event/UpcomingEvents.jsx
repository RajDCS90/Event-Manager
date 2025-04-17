import React from 'react';
import { useEvents } from '../../context/EventContext';
import { motion } from 'framer-motion';

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
    <motion.span 
      whileHover={{ scale: 1.05 }}
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </motion.span>
  );
};

const EventCard = ({ event, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className="flex flex-row gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Date Box */}
      <motion.div 
        whileHover={{ rotate: 2 }}
        className="flex-shrink-0 w-16 h-16"
      >
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2 h-full flex flex-col items-center justify-center shadow-sm">
          <span className="text-xl font-bold text-indigo-600">
            {new Date(event.eventDate).getDate()}
          </span>
          <span className="text-xs font-medium text-gray-500">
            {new Date(event.eventDate).toLocaleString('default', { month: 'short' })}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(event.eventDate).toLocaleString('default', { weekday: 'short' })}
          </span>
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="flex-grow overflow-hidden">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <motion.h3 
              whileHover={{ x: 3 }}
              className="text-base font-bold text-gray-800 truncate"
            >
              {event.eventName}
            </motion.h3>
            <StatusBadge status={event.status} />
          </div>
          
          <p className="text-xs text-gray-500 mb-1">{event.eventType}</p>
          
          <div className="grid grid-cols-2 gap-1 text-xs mb-2">
            <div className="flex items-center text-gray-600 truncate">
              <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.venue}
            </div>
            <div className="flex items-center text-gray-600 truncate">
              <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(event.startTime)}
            </div>
            <div className="flex items-center text-gray-600 truncate">
              <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {event.mandal}
            </div>
            <div className="flex items-center text-gray-600 truncate">
              <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {event.requesterContact?.substring(0, 10)}
            </div>
          </div>
          
          <motion.div 
            className="mt-auto pt-1 border-t border-gray-100"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            <p className="text-xs text-gray-500 truncate">
              Requested by: <span className="font-medium">{event.requesterName}</span>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-gray-50 rounded-xl"
    >
      <div className="flex justify-between items-center mb-4">
        <motion.h2 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-xl font-bold text-gray-800"
        >
          Upcoming Events
        </motion.h2>
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full"
        >
          {sortedEvents.length} {sortedEvents.length === 1 ? 'Event' : 'Events'}
        </motion.span>
      </div>
      
      {sortedEvents.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {sortedEvents.map((event, index) => (
            <EventCard key={event._id} event={event} index={index} />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <motion.svg 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="mx-auto h-10 w-10 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </motion.svg>
          <h3 className="mt-2 text-base font-medium text-gray-900">No upcoming events</h3>
          <p className="mt-1 text-sm text-gray-500">All upcoming events will appear here.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UpcomingEvents;