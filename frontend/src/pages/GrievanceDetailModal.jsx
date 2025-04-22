import { Calendar, MapPin, Clock, User, X, ChevronLeft, MessageSquare } from 'lucide-react';

export default function GrievanceDetailModal({ grievance, onClose }) {
  if (!grievance) return null;

  const {
    programName,
    programDate,
    startTime,
    endTime,
    venue,
    mandal,
    description,
    imageUrl,
    grievanceType,
  } = grievance;

  const formattedDate = new Date(programDate).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeRange = `${startTime || 'N/A'} - ${endTime || 'N/A'}`;
  const fallbackImage = 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-lg animate-fadeIn relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded-full hover:bg-white shadow"
        >
          <X size={22} className="text-gray-700" />
        </button>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 bg-white/90 p-2 px-3 rounded-full hover:bg-white flex items-center shadow"
        >
          <ChevronLeft size={18} className="text-gray-700" />
          <span className="ml-1 text-gray-700 text-sm font-medium">Back</span>
        </button>

        {/* Grievance Image */}
        <div className="w-full h-42 md:h-80 bg-gray-100">
          <img
            src={imageUrl || fallbackImage}
            alt={programName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Grievance Content */}
        <div className="p-6 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{programName}</h1>
            <p className="text-sm text-gray-500 capitalize">{grievanceType}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start">
              <Calendar size={16} className="text-red-500 mt-1 mr-2" />
              <div>
                <h3 className="font-medium">Date</h3>
                <p>{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock size={16} className="text-red-500 mt-1 mr-2" />
              <div>
                <h3 className="font-medium">Time</h3>
                <p>{timeRange}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar size={16} className="text-red-500 mt-1 mr-2" />
              <div>
                <h3 className="font-medium">Program Date</h3>
                <p>
                  {programDate ? new Date(programDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <User size={16} className="text-red-500 mt-1 mr-2" />
              <div>
                <h3 className="font-medium">Mandal</h3>
                <p>{mandal}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium text-gray-800 mb-1">Grievance Details</h3>
            <p className="text-gray-700 text-sm">
              {description?.trim() ? description : 'No details added'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}