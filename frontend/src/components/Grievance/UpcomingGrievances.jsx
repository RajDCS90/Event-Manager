import React from 'react';
import { useGrievance } from '../../context/GrievanceContext';

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
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  );
};

const GrievanceCard = ({ grievance }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="flex-shrink-0 w-full md:w-48">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 h-full flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-amber-600">
            {new Date(grievance.programDate).getDate()}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {new Date(grievance.programDate).toLocaleString('default', { month: 'short' })}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            {new Date(grievance.programDate).toLocaleString('default', { weekday: 'short' })}
          </span>
        </div>
      </div>
      
      <div className="flex-grow">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{grievance.grievanceName}</h3>
            <StatusBadge status={grievance.status} />
          </div>
          
          <p className="text-sm text-gray-500 mb-2 capitalize">{grievance.type}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {grievance.applicant}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(grievance.startTime)} - {formatTime(grievance.endTime)}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Assigned to: {grievance.assignedTo}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Registered: {formatDate(grievance.registeredOn)}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Description:</span> {grievance.description}
            </p>
          </div>
          
          {grievance.resolutionNotes && (
            <div className="mt-auto pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Resolution Notes:</span> {grievance.resolutionNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
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
    <div className="p-6 bg-gray-50 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upcoming Grievances</h2>
        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
          {sortedGrievances.length} {sortedGrievances.length === 1 ? 'Grievance' : 'Grievances'}
        </span>
      </div>
      
      {sortedGrievances.length > 0 ? (
        <div className="space-y-4">
          {sortedGrievances.map(grievance => (
            <GrievanceCard key={grievance._id} grievance={grievance} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming grievances</h3>
          <p className="mt-1 text-gray-500">All upcoming grievances will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingGrievances;