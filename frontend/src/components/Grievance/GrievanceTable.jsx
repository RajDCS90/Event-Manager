import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { Edit, Trash, Calendar, Clock, MapPin, User } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { useGrievance } from '../../context/GrievanceContext';
import GrievanceEditModal from './GrievanceEditModal';

const GrievanceTable = ({ skipInitialFetch = false }) => {
  const { grievances, loading, error, deleteGrievance, fetchGrievances } = useGrievance();
  const { currentUser } = useAuth();

  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [mandalFilter, setMandalFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Extract unique values for filter dropdowns
  const statuses = [...new Set(grievances.map(g => g.status))];
  const mandals = [...new Set(grievances.map(g => g.mandal))];

  useEffect(() => {
    if (!skipInitialFetch) {
    fetchGrievancesWithFilters();
    }
  }, [statusFilter, mandalFilter, dateFilter,skipInitialFetch]);
  useEffect(() => {
    // Initialize filteredGrievances with the full list when grievances change
    setFilteredGrievances(grievances);
  }, [grievances]);

  const fetchGrievancesWithFilters = () => {
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (mandalFilter) filters.mandal = mandalFilter;
    if (dateFilter) filters.programDate = new Date(dateFilter);
    
    fetchGrievances(filters);
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'PP');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') {
      setFilteredGrievances(grievances);
    } else {
      setFilteredGrievances(
        grievances.filter((grievance) =>
          grievance.grievanceName.toLowerCase().includes(term) ||
          grievance.applicant.toLowerCase().includes(term) ||
          grievance.assignedTo.toLowerCase().includes(term)
        )
      );
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleMandalFilterChange = (e) => {
    setMandalFilter(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const resetFilters = () => {
    setStatusFilter('');
    setMandalFilter('');
    setDateFilter('');
    setSearchTerm('');
    fetchGrievances(); // Fetch all grievances without filters
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      try {
        await deleteGrievance(id);
        fetchGrievancesWithFilters(); // Refresh with current filters
      } catch (error) {
        console.error('Error deleting grievance:', error);
        alert(error.message || 'Failed to delete grievance');
      }
    }
  };
  
  useEffect(()=>{
    console.log('filteredGrievances',filteredGrievances);
  },[filteredGrievances])


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Grievance Management</h2>
          <div className="mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search grievances..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter controls */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mandal</label>
            <select
              value={mandalFilter}
              onChange={handleMandalFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Mandals</option>
              {mandals.map(mandal => (
                <option key={mandal} value={mandal}>{mandal}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition duration-150"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Loading grievances...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grievance Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mandal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrievances.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No grievances found
                  </td>
                </tr>
              ) : (
                filteredGrievances.map((grievance) => (
                  <tr key={grievance._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{grievance.grievanceName}</td>
                    <td className="px-6 py-4 capitalize">{grievance.type}</td>
                    <td className="px-6 py-4 capitalize">{grievance.mandal}</td>
                    <td className="px-6 py-4 flex items-center">
                      <User className="mr-1 text-gray-400" />
                      {grievance.applicant}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(grievance.programDate)} at {formatTime(grievance.startTime)} - {formatTime(grievance.endTime)}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={grievance.status} /></td>
                    <td className="px-6 py-4">{grievance.assignedTo}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedGrievance(grievance)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(grievance._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedGrievance && (
        <GrievanceEditModal
          grievance={selectedGrievance}
          isOpen={!!selectedGrievance}
          onClose={() => setSelectedGrievance(null)}
          onSave={(updatedGrievance) => {
            // Call your update function here (e.g., API call to save it)
            // Optional: trigger refetchGrievances() after save
            setSelectedGrievance(null);
          }}
        />
      )}
    </div>
  );
};

export default GrievanceTable;