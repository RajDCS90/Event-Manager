import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { Edit, Trash, Calendar, Clock, MapPin, User } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { useGrievance } from '../../context/GrievanceContext';

const GrievanceTable = () => {
  const { grievances, loading, error, updateGrievance, deleteGrievance, fetchGrievances } = useGrievance();
  const { currentUser } = useAuth();
  const [filteredGrievances, setFilteredGrievances] = useState(grievances);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (grievances.length === 0) fetchGrievances();
  }, []);

  useEffect(() => {
    setFilteredGrievances(grievances);
  }, [grievances]);

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

  const handleEditClick = (grievance) => {
    setEditingId(grievance._id);
    setEditForm({
      grievanceName: grievance.grievanceName,
      type: grievance.type,
      applicant: grievance.applicant,
      programDate: format(new Date(grievance.programDate), 'yyyy-MM-dd'), // ✅ formatted
      startTime: grievance.startTime,
      endTime: grievance.endTime,
      status: grievance.status,
      description: grievance.description,
      assignedTo: grievance.assignedTo,
      resolutionNotes: grievance.resolutionNotes,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    try {
      // Validate time fields
      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(editForm.startTime) ||
          !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(editForm.endTime)) {
        throw new Error('Please enter time in HH:MM format (24-hour)');
      }

      if (editForm.startTime >= editForm.endTime) {
        throw new Error('End time must be after start time');
      }

      const updatedGrievance = { 
        _id: editingId,
        ...editForm,
        updatedAt: new Date().toISOString()
      };
      console.log("updatedGrievance",updatedGrievance);
      await updateGrievance(editingId, updatedGrievance);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating grievance:', error);
      alert(error.message || 'Failed to update grievance');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      try {
        await deleteGrievance(id);
      } catch (error) {
        console.error('Error deleting grievance:', error);
        alert(error.message || 'Failed to delete grievance');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const grievanceToUpdate = grievances.find(g => g._id === id);
      if (!grievanceToUpdate) return;

      const updatedGrievance = { 
        ...grievanceToUpdate, 
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      await updateGrievance(updatedGrievance);
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message || 'Failed to update status');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') {
      setFilteredGrievances(grievances);
    } else {
      setFilteredGrievances(grievances.filter(grievance => 
        grievance.grievanceName.toLowerCase().includes(term) ||
        grievance.applicant.toLowerCase().includes(term) ||
        grievance.assignedTo.toLowerCase().includes(term)
      ));
    }
  };

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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grievance Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrievances.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No grievances found
                  </td>
                </tr>
              ) : (
                filteredGrievances.map((grievance) => (
                  <tr key={grievance._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === grievance._id ? (
                        <input
                          type="text"
                          name="grievanceName"
                          value={editForm.grievanceName}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="font-medium text-gray-900">{grievance.grievanceName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === grievance._id ? (
                        <select
                          name="type"
                          value={editForm.type}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        >
                          <option value="complaint">Complaint</option>
                          <option value="suggestion">Suggestion</option>
                          <option value="inquiry">Inquiry</option>
                        </select>
                      ) : (
                        <span className="capitalize">{grievance.type}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === grievance._id ? (
                        <input
                          type="text"
                          name="applicant"
                          value={editForm.applicant}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="flex items-center">
                          <User className="mr-1 text-gray-400" />
                          {grievance.applicant}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === grievance._id ? (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Calendar className="mr-2 text-gray-400" />
                            <input
                              type="date"
                              name="programDate"
                              value={editForm.programDate}
                              onChange={handleInputChange}
                              className="border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Clock className="mr-2 text-gray-400" />
                              <input
                                type="time"
                                name="startTime"
                                value={editForm.startTime}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1"
                              />
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-2 text-gray-400" />
                              <input
                                type="time"
                                name="endTime"
                                value={editForm.endTime}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>{formatDate(grievance.programDate)} at {formatTime(grievance.startTime)} - {formatTime(grievance.endTime)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === grievance._id ? (
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        >
                          <option value="pending">Pending</option>
                          <option value="resolved">Resolved</option>
                          <option value="inprogress">In Progress</option>
                        </select>
                      ) : (
                        <StatusBadge status={grievance.status} />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === grievance._id ? (
                        <input
                          type="text"
                          name="assignedTo"
                          value={editForm.assignedTo}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div>{grievance.assignedTo}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {editingId === grievance._id ? (
                        <>
                          <button onClick={handleSaveEdit} className="text-blue-600 hover:text-blue-900">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-900">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(grievance)} className="text-green-600 hover:text-green-900">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDelete(grievance._id)} className="text-red-600 hover:text-red-900">
                            <Trash className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GrievanceTable;
