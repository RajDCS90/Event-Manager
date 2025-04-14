import { useState } from 'react';
import { Calendar, MapPin, Clock, User, Award, X, Share2, Facebook, Twitter, ChevronLeft } from 'lucide-react';

// EventDetail Component that shows when an event is clicked
export default function EventDetail({ event, onClose }) {
  const [activeTab, setActiveTab] = useState('details');

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fadeIn">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="sticky right-4 top-4 z-10 float-right bg-white/80 p-2 rounded-full hover:bg-white"
        >
          <X size={24} className="text-gray-800" />
        </button>

        {/* Back Button */}
        <button 
          onClick={onClose}
          className="sticky left-4 top-4 z-10 float-left bg-white/80 p-2 rounded-full hover:bg-white flex items-center"
        >
          <ChevronLeft size={20} className="text-gray-800" />
          <span className="ml-1 text-gray-800">Back</span>
        </button>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Image */}
          <div className="w-full md:w-2/5">
            <div className="relative h-64 md:h-80 lg:h-96">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:hidden">
                <h1 className="text-white text-xl font-bold">{event.title}</h1>
                <p className="text-white/90 text-sm">{event.date}</p>
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="w-full md:w-3/5 p-4 md:p-6">
            <div className="hidden md:block mb-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">{event.title}</h1>
              <p className="text-gray-500">{event.date}</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4 md:mb-6">
              <div className="flex space-x-2 md:space-x-4">
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`py-2 px-1 text-sm md:text-base ${activeTab === 'details' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500'}`}
                >
                  Event Details
                </button>
                <button 
                  onClick={() => setActiveTab('agenda')}
                  className={`py-2 px-1 text-sm md:text-base ${activeTab === 'agenda' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500'}`}
                >
                  Agenda
                </button>
                <button 
                  onClick={() => setActiveTab('gallery')}
                  className={`py-2 px-1 text-sm md:text-base ${activeTab === 'gallery' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500'}`}
                >
                  Gallery
                </button>
              </div>
            </div>

            {/* Details Tab Content */}
            {activeTab === 'details' && (
              <div className="space-y-3 md:space-y-4">
                <div className="bg-orange-50 p-3 md:p-4 rounded-lg border border-orange-100">
                  <h3 className="font-medium text-orange-800 mb-1 md:mb-2 text-sm md:text-base">Event Motto</h3>
                  <p className="text-gray-700 text-sm md:text-base">{event.motto}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-start">
                    <Calendar size={16} className="text-orange-500 mt-1 mr-2" />
                    <div>
                      <h3 className="font-medium text-sm md:text-base">Date</h3>
                      <p className="text-gray-600 text-sm">{event.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock size={16} className="text-orange-500 mt-1 mr-2" />
                    <div>
                      <h3 className="font-medium text-sm md:text-base">Time</h3>
                      <p className="text-gray-600 text-sm">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin size={16} className="text-orange-500 mt-1 mr-2" />
                    <div>
                      <h3 className="font-medium text-sm md:text-base">Venue</h3>
                      <p className="text-gray-600 text-sm">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User size={16} className="text-orange-500 mt-1 mr-2" />
                    <div>
                      <h3 className="font-medium text-sm md:text-base">Chief Guest</h3>
                      <p className="text-gray-600 text-sm">{event.chiefGuest}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-1 md:mb-2 text-sm md:text-base">Description</h3>
                  <p className="text-gray-700 text-sm md:text-base">{event.description}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1 md:mb-2 text-sm md:text-base">Highlights</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm md:text-base">
                    {event.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Agenda Tab Content */}
            {activeTab === 'agenda' && (
              <div className="space-y-3 md:space-y-4">
                <h3 className="font-medium mb-2 text-sm md:text-base">Event Schedule</h3>
                <div className="space-y-2 md:space-y-3">
                  {event.agenda.map((item, index) => (
                    <div key={index} className="flex border-l-2 border-orange-500 pl-3 md:pl-4">
                      <div className="w-16 md:w-20 text-orange-600 font-medium text-sm">{item.time}</div>
                      <div>
                        <h4 className="font-medium text-sm md:text-base">{item.activity}</h4>
                        <p className="text-gray-600 text-xs md:text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Tab Content */}
            {activeTab === 'gallery' && (
              <div className="space-y-3 md:space-y-4">
                <h3 className="font-medium mb-2 text-sm md:text-base">Event Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {event.gallery.map((img, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                      <img src={img} alt={`Event photo ${index+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                {event.gallery.length === 0 && (
                  <p className="text-gray-500 italic text-center text-sm">Photos will be available after the event</p>
                )}
              </div>
            )}

            {/* Registration Button */}
            <div className="mt-4 md:mt-6">
              <button className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 md:px-8 rounded-lg w-full text-sm md:text-base">
                Register for this Event
              </button>
            </div>

            {/* Share Section */}
            <div className="mt-4 md:mt-6 flex items-center space-x-3 md:space-x-4">
              <span className="text-gray-500 text-sm md:text-base">Share:</span>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                <Facebook size={16} />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600">
                <Twitter size={16} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <Share2 size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}