import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock4, X } from 'lucide-react';
import { useEvents } from '../../context/EventContext';

const EventsComponent = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [feedback, setFeedback] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const { events, loading, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, []);

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
      case 'political': return 'bg-red-100 text-red-800';
      case 'social': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-purple-100 text-purple-800';
      case 'welfare': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock4 className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Events</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-md ${activeTab === 'upcoming' ? 'bg-[#00B8DB] text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-md ${activeTab === 'past' ? 'bg-[#00B8DB] text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Past Events
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00B8DB]"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No {activeTab} events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const eventDate = new Date(event.eventDate);
            const isPast = eventDate < new Date() || event.status === 'completed';

            return (
              <div
                key={event._id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{event.eventName}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(event.eventType)}`}>
                      {event.eventType}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {eventDate.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.startTime} - {event.endTime}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.venue}, {event.mandal}
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      {getStatusIcon(event.status)}
                      <span className="ml-2 capitalize">{event.status}</span>
                    </div>
                    <span className="text-gray-500">By: {event.requesterName}</span>
                  </div>

                  {isPast && (
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="mt-3 w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium"
                    >
                      Provide Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Event Feedback</h3>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setFeedback('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-1">{selectedEvent.eventName}</h4>
              <p className="text-sm text-gray-600">
                {new Date(selectedEvent.eventDate).toLocaleDateString()} • {selectedEvent.venue}
              </p>
            </div>

            {feedbackSubmitted ? (
              <div className="p-4 bg-green-50 text-green-700 rounded-md text-center">
                Thank you for your feedback!
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit}>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience about this event..."
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsComponent;
