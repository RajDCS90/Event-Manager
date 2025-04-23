import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock4, X, Image as ImageIcon } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { motion } from 'framer-motion';
import EventDetail from '../../pages/EventDetail';

const EventsComponent = ({ defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || 'upcoming');
  const [feedback, setFeedback] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const { events, loading, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, []);

  // Set active tab when defaultTab prop changes
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim() || !selectedEvent) return;

    // Handle feedback submission logic here
    console.log('Feedback submitted:', {
      eventId: selectedEvent._id,
      feedback: feedback.trim()
    });

    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedback('');
      setSelectedEvent(null);
    }, 3000);
  };

  const filteredEvents = events.filter(event => {
    const now = new Date();
    const eventDate = new Date(event.eventDate);

    if (activeTab === 'upcoming') {
      return eventDate >= now && event.status !== 'cancelled';
    } else {
      return eventDate < now || event.status === 'completed';
    }
  });

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'political': return 'bg-red-100 text-red-800 border-red-200';
      case 'social': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'commercial': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'welfare': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeBg = (type) => {
    switch (type) {
      case 'political': return 'from-red-50 to-white';
      case 'social': return 'from-blue-50 to-white';
      case 'commercial': return 'from-purple-50 to-white';
      case 'welfare': return 'from-green-50 to-white';
      default: return 'from-gray-50 to-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock4 className="w-4 h-4 text-yellow-500" />;
    }
  };

  // Placeholder images based on event type
  const getPlaceholderImage = (type) => {
    switch (type) {
      case 'political':
        return 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=500&h=250';
      case 'social':
        return 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&h=250';
      case 'commercial':
        return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=500&h=250';
      case 'welfare':
        return 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=500&h=250';
      default:
        return 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=500&h=250';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <motion.h2
          className="text-2xl font-bold text-gray-800 mb-4 md:mb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Events
        </motion.h2>
        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${activeTab === 'upcoming'
                ? 'bg-[#00B8DB] text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${activeTab === 'past'
                ? 'bg-[#00B8DB] text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Past Events
          </button>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00B8DB]"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <motion.div
          className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ImageIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No {activeTab} events found</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => {
            const eventDate = new Date(event.eventDate);
            const isPast = eventDate < new Date() || event.status === 'completed';
            const imageUrl = event.imageUrl || getPlaceholderImage(event.eventType);
            const gradientBg = getEventTypeBg(event.eventType);

            return (
              <motion.div
                key={event._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100"
                onClick={() => handleCardClick(event)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={event.eventName}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                  />
                  <div className="absolute top-0 left-0 p-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getEventTypeColor(event.eventType)}`}>
                      {event.eventType}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                    <h3 className="text-lg font-semibold">{event.eventName}</h3>
                  </div>
                </div>

                <div className={`p-4 bg-gradient-to-b ${gradientBg}`}>
                  <div className="flex items-center text-sm text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-[#00B8DB]" />
                    {eventDate.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>

                  <div className="flex items-center text-sm text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2 text-[#00B8DB]" />
                    {event.startTime} - {event.endTime}
                  </div>

                  <div className="flex items-center text-sm text-gray-700 mb-3">
                    <MapPin className="w-4 h-4 mr-2 text-[#00B8DB]" />
                    <span className="truncate">{event.venue}, {event.mandal}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
                    <div className="flex items-center">
                      {getStatusIcon(event.status)}
                      <span className="ml-2 capitalize font-medium">{event.status}</span>
                    </div>
                    <span className="text-gray-500">By: {event.requesterName}</span>
                  </div>

                  {isPast && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedEvent(event)}
                      className="mt-3 w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors duration-300"
                    >
                      Provide Feedback
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Feedback Modal */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Event Feedback</h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSelectedEvent(null);
                  setFeedback('');
                }}
                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-1">{selectedEvent.eventName}</h4>
              <p className="text-sm text-gray-600">
                {new Date(selectedEvent.eventDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })} • {selectedEvent.venue}
              </p>
            </div>

            {feedbackSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-green-50 text-green-700 rounded-lg text-center"
              >
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p className="font-medium">Thank you for your feedback!</p>
              </motion.div>
            ) : (
              <form onSubmit={handleFeedbackSubmit}>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience about this event..."
                  className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  rows={4}
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="mt-4 w-full bg-[#00B8DB] hover:bg-[#00a5c5] text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Submit Feedback
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}

      {showDetailModal && (
              <EventDetail
                event={selectedEvent}
                onClose={() => setShowDetailModal(false)}
              />
            )}
    </div>
  );
};

export default EventsComponent;