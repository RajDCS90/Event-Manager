import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock4, X, Image as ImageIcon } from 'lucide-react';
import { useGrievance } from '../../context/GrievanceContext';
import { motion } from 'framer-motion';
import GrievanceDetailModal from '../../pages/GrievanceDetailModal';

const GrievancesComponent = ({ defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || 'upcoming');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const { grievances, loading, fetchGrievances } = useGrievance();

  useEffect(() => {
    fetchGrievances();
  }, []);

  // Set active tab when defaultTab prop changes
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim() || !selectedGrievance) return;

    // Handle feedback submission logic here
    console.log('Feedback submitted:', {
      grievanceId: selectedGrievance._id,
      feedback: feedback.trim()
    });

    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedback('');
      setSelectedGrievance(null);
    }, 3000);
  };

  const filteredGrievances = grievances.filter(grievance => {
    const now = new Date();
    const programDate = new Date(grievance.programDate);

    if (activeTab === 'upcoming') {
      return programDate >= now && grievance.status !== 'rejected';
    } else {
      return programDate < now || grievance.status === 'resolved' || grievance.status === 'rejected';
    }
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'complaint': return 'bg-red-100 text-red-800 border-red-200';
      case 'request': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeBg = (type) => {
    switch (type) {
      case 'complaint': return 'from-red-50 to-white';
      case 'request': return 'from-blue-50 to-white';
      default: return 'from-gray-50 to-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock4 className="w-4 h-4 text-yellow-500" />;
    }
  };

  // Placeholder images based on grievance type
  const getPlaceholderImage = (type) => {
    switch (type) {
      case 'complaint':
        return 'https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=500&h=250';
      case 'request':
        return 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=500&h=250';
      default:
        return 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&h=250';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleCardClick = (grievance) => {
    setSelectedGrievance(grievance);
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
          Grievances
        </motion.h2>
        <motion.div 
          className="flex space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
              activeTab === 'upcoming' 
                ? 'bg-[#00B8DB] text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upcoming Grievances
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
              activeTab === 'past' 
                ? 'bg-[#00B8DB] text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Past Grievances
          </button>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00B8DB]"></div>
        </div>
      ) : filteredGrievances.length === 0 ? (
        <motion.div 
          className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ImageIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No {activeTab} grievances found</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrievances.map((grievance, index) => {
            const programDate = new Date(grievance.programDate);
            const isPast = programDate < new Date() || grievance.status === 'resolved' || grievance.status === 'rejected';
            const imageUrl = grievance.imageUrl || getPlaceholderImage(grievance.type);
            const gradientBg = getTypeBg(grievance.type);

            return (
              <motion.div
                key={grievance._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100"
                onClick={() => handleCardClick(grievance)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={grievance.grievanceName}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                  />
                  <div className="absolute top-0 left-0 p-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTypeColor(grievance.type)}`}>
                      {grievance.type}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                    <h3 className="text-lg font-semibold">{grievance.grievanceName}</h3>
                  </div>
                </div>

                <div className={`p-4 bg-gradient-to-b ${gradientBg}`}>
                  <div className="flex items-center text-sm text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-[#00B8DB]" />
                    {programDate.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>

                  <div className="flex items-center text-sm text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2 text-[#00B8DB]" />
                    {grievance.startTime} - {grievance.endTime}
                  </div>

                  <div className="flex items-center text-sm text-gray-700 mb-3">
                    <MapPin className="w-4 h-4 mr-2 text-[#00B8DB]" />
                    <span className="truncate">{grievance.mandal}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
                    <div className="flex items-center">
                      {getStatusIcon(grievance.status)}
                      <span className="ml-2 capitalize font-medium">{grievance.status}</span>
                    </div>
                    <span className="text-gray-500">By: {grievance.applicant}</span>
                  </div>

                  {isPast && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card click
                        setSelectedGrievance(grievance);
                        setShowDetailModal(false); // Close detail modal if open
                        setFeedbackSubmitted(false); // Reset feedback submission state
                      }}
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

      {/* Grievance Detail Modal */}
      {showDetailModal && (
        <GrievanceDetailModal
          grievance={selectedGrievance}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* Feedback Modal */}
      {selectedGrievance && !showDetailModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => {
            setSelectedGrievance(null);
            setFeedback('');
          }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Grievance Feedback</h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSelectedGrievance(null);
                  setFeedback('');
                }}
                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-1">{selectedGrievance.grievanceName}</h4>
              <p className="text-sm text-gray-600">
                {new Date(selectedGrievance.programDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })} • {selectedGrievance.mandal}
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
                  placeholder="Share your experience about this grievance..."
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
    </div>
  );
};

export default GrievancesComponent;