import { Calendar, Clock, MapPin } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatDisplayDate } from '../utils/dateUtils';

const EventCard = ({ event }) => {
  const { eventName, eventType, venue, status, eventDate, startTime, endTime } = event;
  const formattedDate = formatDisplayDate(eventDate);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300 animate-fadeIn">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-800">{eventName}</h3>
        <StatusBadge status={status} />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <div className="flex items-center mb-1">
          <Calendar size={16} className="mr-2 text-gray-500" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center mb-1">
          <Clock size={16} className="mr-2 text-gray-500" />
          <span>{startTime} - {endTime}</span>
        </div>
        <div className="flex items-center mb-1">
          <MapPin size={16} className="mr-2 text-gray-500" />
          <span>{venue}</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
          {eventType}
        </span>
      </div>
    </div>
  );
};

export default EventCard;