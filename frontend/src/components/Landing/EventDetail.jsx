import {
  X,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Navigation,
} from "lucide-react";

export default function EventDetail({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-hidden shadow-2xl">
        {/* Image and Close Button */}
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : event.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {event.status}
            </span>
          </div>

          <div className="mb-4 flex flex-wrap gap-3 text-sm">
            <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
              <Calendar size={16} className="mr-2 text-orange-500" />
              <span>
                {event.date} | {event.time}
              </span>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
              <MapPin size={16} className="mr-2 text-orange-500" />
              <span>{event.location}</span>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
              <User size={16} className="mr-2 text-orange-500" />
              <span>Requester: {event.requesterName}</span>
            </div>
          </div>

          {/* Address Section */}
          {event.address && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Address Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AddressField
                  icon={<Home size={16} className="text-orange-500 mt-1 mr-2" />}
                  label="Village"
                  value={event.address.village}
                />
                <AddressField
                  icon={<Navigation size={16} className="text-orange-500 mt-1 mr-2" />}
                  label="Post Office"
                  value={event.address.postOffice}
                />
                <AddressField
                  icon={<MapPin size={16} className="text-orange-500 mt-1 mr-2" />}
                  label="Police Station"
                  value={event.address.policeStation}
                />
                <AddressField
                  icon={<MapPin size={16} className="text-orange-500 mt-1 mr-2" />}
                  label="Mandal"
                  value={event.address.mandal}
                />
                <AddressField
                  icon={<Mail size={16} className="text-orange-500 mt-1 mr-2" />}
                  label="Pincode"
                  value={event.address.pincode}
                />
                {event.requesterContact && (
                  <AddressField
                    icon={<Phone size={16} className="text-orange-500 mt-1 mr-2" />}
                    label="Contact Number"
                    value={event.requesterContact}
                  />
                )}
              </div>
            </div>
          )}

          {/* Event Details */}
          <div className="space-y-4 text-sm">
            <DetailSection title="Event Type" content={event.eventType} />
            {event.description && (
              <DetailSection title="Description" content={event.description} />
            )}
            {event.gallery && event.gallery.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {event.gallery.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-lg border">
                      <img
                        src={image}
                        alt={`Event image ${index + 1}`}
                        className="w-full h-28 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable subcomponent for address fields
function AddressField({ icon, label, value }) {
  return (
    <div className="flex items-start">
      {icon}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium">{value || "N/A"}</p>
      </div>
    </div>
  );
}

// Reusable subcomponent for simple detail sections
function DetailSection({ title, content }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-gray-600 capitalize">{content}</p>
    </div>
  );
}
