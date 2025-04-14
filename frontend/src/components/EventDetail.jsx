import { X, Calendar, Share2, Download } from "lucide-react";

export default function EventDetail({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl my-8 mx-4 shadow-2xl transform transition-all duration-300">
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-1 transition-colors duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
            <div className="flex space-x-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-300">
                <Calendar size={18} />
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors duration-300">
                <Share2 size={18} />
              </button>
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full transition-colors duration-300">
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-4 text-sm">
            <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
              <Calendar size={16} className="mr-2 text-orange-500" />
              <span>
                {event.date} {event.time && `| ${event.time}`}
              </span>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              {event.location}
            </div>
            {event.chiefGuest && (
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                Chief Guest: {event.chiefGuest}
              </div>
            )}
          </div>

          {event.motto && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Motto</h3>
              <p className="italic text-gray-600">{event.motto}</p>
            </div>
          )}

          {event.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>
          )}

          {event.highlights && event.highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Highlights</h3>
              <ul className="list-disc pl-5 text-gray-600">
                {event.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {event.agenda && event.agenda.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Agenda</h3>
              <div className="space-y-2">
                {event.agenda.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm w-20 text-center mr-4">
                      {item.time}
                    </div>
                    <div>
                      <h4 className="font-medium">{item.activity}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.gallery && event.gallery.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {event.gallery.slice(0, 6).map((image, index) => (
                  <div key={index} className="overflow-hidden rounded">
                    <img
                      src={image}
                      alt={`Event image ${index + 1}`}
                      className="w-full h-24 object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              Register for Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}