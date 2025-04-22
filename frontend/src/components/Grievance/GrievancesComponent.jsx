import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock4, X } from 'lucide-react';
import { useGrievance } from '../../context/GrievanceContext';

const GrievancesComponent = () => {
  
  const [activeTab, setActiveTab] = useState('pending');
  const [note, setNote] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [noteSubmitted, setNoteSubmitted] = useState(false);

  const { grievances, loading, fetchGrievances } = useGrievance();

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!note.trim() || !selectedGrievance) return;

    console.log('Note submitted:', {
      grievanceId: selectedGrievance._id,
      resolutionNote: note.trim()
    });

    setNoteSubmitted(true);
    setTimeout(() => {
      setNoteSubmitted(false);
      setNote('');
      setSelectedGrievance(null);
    }, 3000);
  };

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
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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

                  {grievance.status === 'resolved' && (
                    <button
                      onClick={() => setSelectedGrievance(grievance)}
                      className="mt-3 w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium"
                    >
                      View Resolution
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resolution Notes Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Resolution Notes</h3>
              <button
                onClick={() => {
                  setSelectedGrievance(null);
                  setNote('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-1">{selectedGrievance.grievanceName}</h4>
              <p className="text-sm text-gray-600">
                {new Date(selectedGrievance.programDate).toLocaleDateString()} • {selectedGrievance.mandal}
              </p>
              <p className="mt-2 text-gray-700 text-sm">{selectedGrievance.description}</p>
            </div>

            {noteSubmitted ? (
              <div className="p-4 bg-green-50 text-green-700 rounded-md text-center">
                Resolution noted. Thank you!
              </div>
            ) : (
              <form onSubmit={handleNoteSubmit}>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write resolution note..."
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  className="mt-4 w-full bg-[#00B8DB] hover:bg-[#6eb7c6] text-white py-2 rounded-md font-medium"
                >
                  Submit Note
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievancesComponent;
