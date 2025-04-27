import { Calendar, MapPin, Clock, User, X, ChevronLeft, MessageSquare, Mail, Phone, Home, Navigation, FileText } from 'lucide-react';
import { useEffect } from 'react';

export default function GrievanceDetailModal({ grievance, onClose }) {

  console.log(grievance)

  if (!grievance) return null;

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

  const {
    grievanceName,
    programDate,
    startTime,
    endTime,
    venue,
    mandal,
    description,
    imageUrl,
    type,
    status,
    applicant,
    assignedTo,
    address = {},
    resolution,
    requesterContact,
    requesterName
  } = grievance;

  // Safely get mandal name from different possible structures
  const getMandalName = () => {
    if (typeof address.mandal === 'string') return address.mandal;
    if (address.mandal?.mandalName) return address.mandal.mandalName;
    if (typeof mandal === 'string') return mandal;
    if (mandal?.mandalName) return mandal.mandalName;
    return 'N/A';
  };

  const formattedDate = new Date(programDate).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeRange = `${startTime || 'N/A'} - ${endTime || 'N/A'}`;
  const fallbackImage = 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-lg animate-fadeIn relative max-h-[90vh] overflow-y-auto">

        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-2 z-20 bg-white/90 p-2 px-3 rounded-full hover:bg-white flex items-center shadow"
          aria-label="Go back"
        >
          <ChevronLeft size={18} className="text-orange-500" />
          <span className="ml-1 text-gray-700 text-sm font-medium">Close</span>
        </button>

        {/* Header with Status */}
        <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-start items-center">
          <h1 className="text-xl font-bold text-gray-800">{grievanceName}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.replace('_', ' ')}
          </span>
        </div>

        {/* Grievance Image */}
        <div className="w-full h-42 md:h-80 bg-gray-100">
          <img
            src={imageUrl || fallbackImage}
            alt={grievanceName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Grievance Content */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Grievance Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-start">
                <FileText size={16} className="text-orange-500 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Type</h3>
                  <p className="capitalize">{type}</p>
                </div>
              </div>

              <div className="flex items-start">
                <User size={16} className="text-orange-500 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Applicant</h3>
                  <p>{requesterName || applicant || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar size={16} className="text-orange-500 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Program Date</h3>
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
                  <h3 className="font-medium">Assigned To</h3>
                  <p>{assignedTo || 'Not assigned'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-start">
                <MapPin size={16} className="text-orange-500 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Mandal</h3>
                  <p>{getMandalName()}</p>
                </div>
              </div>

              {address?.area && (
                <div className="flex items-start">
                  <Navigation size={16} className="text-orange-500 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium">Area</h3>
                    <p>{address.area}</p>
                  </div>
                </div>
              )}

              {address?.village && (
                <div className="flex items-start">
                  <Home size={16} className="text-orange-500 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium">Village</h3>
                    <p>{address.village}</p>
                  </div>
                </div>
              )}

              {address?.booth && (
                <div className="flex items-start">
                  <MapPin size={16} className="text-orange-500 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium">Booth</h3>
                    <p>{address.booth}</p>
                  </div>
                </div>
              )}

              {address?.postOffice && (
                <div className="flex items-start">
                  <Mail size={16} className="text-orange-500 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium">Post Office</h3>
                    <p>{address.postOffice}</p>
                  </div>
                </div>
              )}

              {address?.policeStation && (
                <div className="flex items-start">
                  <MapPin size={16} className="text-orange-500 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium">Police Station</h3>
                    <p>{address.policeStation}</p>
                  </div>
                </div>
              )}

              {address?.pincode && (
                <div className="flex items-start">
                  <Mail size={16} className="text-orange-500 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium">Pincode</h3>
                    <p>{address.pincode}</p>
                  </div>
                </div>
              )}

              {requesterContact && (
                <div className="flex items-start">
                  <Phone size={16} className="text-orange-500 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium">Contact Number</h3>
                    <p>{requesterContact}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {description?.trim() ? description : 'No description provided'}
              </p>
            </div>
          </div>

          {/* Resolution */}
          {resolution && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Resolution</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">{resolution}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}