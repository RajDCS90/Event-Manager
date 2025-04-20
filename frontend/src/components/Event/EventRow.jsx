import { format, parseISO } from "date-fns";
import { Edit, Trash, MapPin, User, Calendar, Clock } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

const EventRow = ({ event, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "PP");
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "PM" : "AM";
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">{event.eventName}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="capitalize">{event.eventType}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <MapPin size={16} className="mr-1 text-gray-400" />
          {event.venue}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-1 text-gray-400" />
            {formatDate(event.eventDate)}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Clock size={14} className="mr-1 text-gray-400" />
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={event.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <User size={16} className="mr-1 text-gray-400" />
          {event.requesterName}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(event)}
            className="text-blue-600 hover:text-blue-900"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(event._id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default EventRow;