import React from 'react';
import { useGrievance } from '../../context/GrievanceContext';
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
    resolved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-rose-100 text-rose-800',
    in_progress: 'bg-blue-100 text-blue-800'
  };
  
  return (
    <motion.span 
      whileHover={{ scale: 1.05 }}
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </motion.span>
  );
};

const GrievanceCard = ({ grievance, index }) => {
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
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-2 h-full flex flex-col items-center justify-center shadow-sm">
          <span className="text-xl font-bold text-amber-600">
            {new Date(grievance.programDate).getDate()}
          </span>
          <span className="text-xs font-medium text-gray-500">
            {new Date(grievance.programDate).toLocaleString('default', { month: 'short' })}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(grievance.programDate).toLocaleString('default', { weekday: 'short' })}
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
              {grievance.grievanceName}
            </motion.h3>
            <StatusBadge status={grievance.status} />
          </div>
          
          <p className="text-xs text-gray-500 mb-1 capitalize">{grievance.type}</p>
          
          <div className="grid grid-cols-2 gap-1 text-xs mb-2">
            <div className="flex items-center text-gray-600 truncate">
              <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {grievance.applicant}
            </div>
            <div className="flex items-center text-gray-600 truncate">
              <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(grievance.startTime)}
            </div>
            <div className="flex items-center text-gray-600 truncate">
              <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {grievance.assignedTo}
            </div>
            <div className="flex items-center text-gray-600 truncate">
              <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(grievance.registeredOn).split(',')[0]}
            </div>
          </div>
          
          <motion.div 
            className="mb-1 relative overflow-hidden"
            whileHover={{ height: "auto" }}
            style={{ height: "1.5rem" }}
          >
            <p className="text-xs text-gray-600 line-clamp-1">
              <span className="font-medium">Description:</span> {grievance.description}
            </p>
            <div className="absolute bottom-0 right-0 bg-gradient-to-l from-white to-transparent w-8 h-full"></div>
          </motion.div>
          
          {grievance.resolutionNotes && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-1 border-t border-gray-100"
            >
              <p className="text-xs text-gray-500 line-clamp-1">
                <span className="font-medium">Resolution:</span> {grievance.resolutionNotes}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const UpcomingGrievances = () => {
  const { grievances } = useGrievance();
  
  // Sort grievances by date (closest first)
  const sortedGrievances = [...grievances]
    .map(grievance => ({
      ...grievance,
      programDate: new Date(grievance.programDate),
    }))
    .sort((a, b) => a.programDate - b.programDate)
    .filter(grievance => grievance.programDate >= new Date()); // Only show future grievances

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
          Upcoming Grievances
        </motion.h2>
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full"
        >
          {sortedGrievances.length} {sortedGrievances.length === 1 ? 'Grievance' : 'Grievances'}
        </motion.span>
      </div>
      
      {sortedGrievances.length > 0 ? (
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
          {sortedGrievances.map((grievance, index) => (
            <GrievanceCard key={grievance._id} grievance={grievance} index={index} />
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </motion.svg>
          <h3 className="mt-2 text-base font-medium text-gray-900">No upcoming grievances</h3>
          <p className="mt-1 text-sm text-gray-500">All upcoming grievances will appear here.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UpcomingGrievances;