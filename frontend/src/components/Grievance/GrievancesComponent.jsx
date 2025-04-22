import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock4 } from 'lucide-react';
import { useGrievance } from '../../context/GrievanceContext';
import GrievanceDetailModal from '../../pages/GrievanceDetailModal';

const GrievancesComponent = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { grievances, loading, fetchGrievances } = useGrievance();

  useEffect(() => {
    fetchGrievances();
  }, []);

  const filteredGrievances = grievances.filter(grievance => grievance.status === activeTab);

  const getTypeColor = (type) => {
    switch (type) {
      case 'complaint': return 'bg-red-100 text-red-800';
      case 'request': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock4 className="w-4 h-4 text-yellow-500" />;
    }
  };

  const handleCardClick = (grievance) => {
    setSelectedGrievance(grievance);
    setShowDetailModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Grievances</h2>
        <div className="flex space-x-2">
          {['pending', 'resolved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-2 rounded-md capitalize ${
                activeTab === status ? 'bg-[#00B8DB] text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00B8DB]"></div>
        </div>
      ) : filteredGrievances.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No {activeTab} grievances found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrievances.map(grievance => {
            const programDate = new Date(grievance.programDate);

            return (
              <div
                key={grievance._id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCardClick(grievance)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{grievance.grievanceName}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(grievance.type)}`}>
                      {grievance.type}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {programDate.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    {grievance.startTime} - {grievance.endTime}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    {grievance.mandal}
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      {getStatusIcon(grievance.status)}
                      <span className="ml-2 capitalize">{grievance.status}</span>
                    </div>
                    <span className="text-gray-500">By: {grievance.applicant}</span>
                  </div>
                </div>
              </div>
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
    </div>
  );
};

export default GrievancesComponent;