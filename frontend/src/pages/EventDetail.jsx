import { Calendar, MapPin, Clock, User, X, ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function EventDetail({ event, onClose }) {
  if (!event) return null;

  const {
    eventName,
    eventDate,
    startTime,
    endTime,
    venue,
    eventType,
    imageUrl,
    description,
    requesterName,
    requesterContact,
    status,
    mandal
  } = event;

  // Handle address data safely
  const address = event.address || {};

  // Safely get mandal name from different possible structures
  const getMandalName = () => {
    if (typeof address.mandal === 'string') return address.mandal;
    if (address.mandal?.mandalName) return address.mandal.mandalName;
    if (typeof mandal === 'string') return mandal;
    if (mandal?.mandalName) return mandal.mandalName;
    if (address.mandalName) return address.mandalName;
    return 'N/A';
  };

  // Format date safely
  const formattedDate = eventDate ? new Date(eventDate).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'N/A';

  const timeRange = `${startTime || 'N/A'} - ${endTime || 'N/A'}`;
  const fallbackImage = 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  // Close modal when clicking on overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-lg animate-fadeIn relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 p-2 rounded-full hover:bg-white shadow"
          aria-label="Close"
        >
          <X size={22} className="text-gray-700" />
        </button>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 bg-white/90 p-2 px-3 rounded-full hover:bg-white flex items-center shadow"
          aria-label="Go back"
        >
          <ChevronLeft size={18} className="text-gray-700" />
          <span className="ml-1 text-gray-700 text-sm font-medium">Back</span>
        </button>

        {/* Event Image */}
        <div className="w-full h-42 md:h-80 bg-gray-100">
          <img
            src={imageUrl || fallbackImage}
            alt={eventName || 'Event'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = fallbackImage;
            }}
          />
        </div>

        {/* Event Content */}
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{eventName || 'Unnamed Event'}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {eventType && (
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                  {eventType}
                </span>
              )}
              {status && (
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${
                  status === 'approved' ? 'bg-green-100 text-green-800' : 
                  status === 'rejected' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {status}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start">
              <Calendar size={16} className="text-orange-500 mt-1 mr-2" />
              <div>
                <h3 className="font-medium">Date</h3>
                <p>{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock size={16} className="text-orange-500 mt-1 mr-2" />
              <div>
                <h3 className="font-medium">Time</h3>
                <p>{timeRange}</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin size={16} className="text-orange-500 mt-1 mr-2" />
              <div>
                <h3 className="font-medium">Venue</h3>
                <p>{venue || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start">
              <User size={16} className="text-orange-500 mt-1 mr-2" />
              <div>
                <h3 className="font-medium">Mandal</h3>
                <p>{getMandalName()}</p>
              </div>
            </div>

            {address.area && (
              <div className="flex items-start">
                <MapPin size={16} className="text-orange-500 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Area</h3>
                  <p>{address.area}</p>
                </div>
              </div>
            )}

            {address.village && (
              <div className="flex items-start">
                <MapPin size={16} className="text-orange-500 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Village</h3>
                  <p>{address.village}</p>
                </div>
              </div>
            )}

            {address.booth && (
              <div className="flex items-start">
                <MapPin size={16} className="text-orange-500 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Booth</h3>
                  <p>{address.booth}</p>
                </div>
              </div>
            )}

            {requesterName && (
              <div className="flex items-start">
                <User size={16} className="text-orange-500 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Requester</h3>
                  <p>{requesterName}</p>
                </div>
              </div>
            )}

            {requesterContact && (
              <div className="flex items-start">
                <User size={16} className="text-orange-500 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Contact</h3>
                  <p>{requesterContact}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Event Description</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  {description.trim() ? description : 'No description provided'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}