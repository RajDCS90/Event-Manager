import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatDisplayDate } from '../utils/dateUtils';

const GrievanceCard = ({ grievance }) => {
  const { grievanceName, type, applicant, status, programDate, startTime, endTime } = grievance;
  const formattedDate = formatDisplayDate(programDate);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 border-red-500 hover:shadow-lg transition-shadow duration-300 animate-fadeIn">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-800">{grievanceName}</h3>
        <StatusBadge status={status} />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <div className="flex items-center mb-1">
          <CalendarIcon size={16} className="mr-2 text-gray-500" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center mb-1">
          <Clock size={16} className="mr-2 text-gray-500" />
          <span>{startTime} - {endTime}</span>
        </div>
        <div className="flex items-center mb-1">
          <AlertCircle size={16} className="mr-2 text-gray-500" />
          <span>Applicant: {applicant}</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <span className="bg-red-50 text-red-700 px-2 py-1 rounded-md text-xs font-medium">
          {type}
        </span>
      </div>
    </div>
  );
};

export default GrievanceCard;