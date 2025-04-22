import { useState, useEffect } from 'react';
import { Calendar, Clock, X, Upload, Trash2 } from 'lucide-react';
import { useGrievance } from '../../context/GrievanceContext';

const GrievanceEditModal = ({ grievance, isOpen, onClose, onSave }) => {
    const {updateGrievance}=useGrievance();
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [grievanceImage, setGrievanceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const mandalOptions = [
    "Mandal 1",
    "Mandal 2",
    "Mandal 3",
    "Mandal 4",
    "Mandal 5",
  ];

  useEffect(() => {
    if (grievance) {
      setFormData({
        grievanceName: grievance.grievanceName,
        type: grievance.type,
        applicant: grievance.applicant,
        programDate: grievance.programDate?.slice(0, 10),
        startTime: grievance.startTime,
        endTime: grievance.endTime,
        status: grievance.status,
        description: grievance.description,
        assignedTo: grievance.assignedTo,
        resolutionNotes: grievance.resolutionNotes,
        mandal: grievance.mandal || "",
      });
      
      // Set image preview if grievance has an image
      if (grievance.imageUrl) {
        setImagePreview(grievance.imageUrl);
      }
    }
  }, [grievance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGrievanceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setGrievanceImage(null);
    setImagePreview(null);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate time fields
      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.startTime) ||
          !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.endTime)) {
        throw new Error('Please enter time in HH:MM format (24-hour)');
      }

      if (formData.startTime >= formData.endTime) {
        throw new Error('End time must be after start time');
      }

      // Create FormData for file upload
      const formDataObj = new FormData();
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataObj.append(key, formData[key]);
        }
      });

      // Append image if selected
      if (grievanceImage) {
        formDataObj.append('image', grievanceImage);
      }

      const updatedGrievance = { 
        ...grievance,
        ...formData,
        updatedAt: new Date().toISOString()
      };

      if (updateGrievance) {
        // Use FormData if there's an image, otherwise use regular object
        if (grievanceImage) {
          await updateGrievance(grievance._id, formDataObj);
        } else {
          await updateGrievance(grievance._id, updatedGrievance);
        }
      } else if (onSave) {
        onSave(updatedGrievance);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating grievance:', error);
      setError(error.message || 'Failed to update grievance');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !grievance) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">Update Grievance</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grievance Name</label>
            <input 
              name="grievanceName" 
              value={formData.grievanceName} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                disabled={isSubmitting}
              >
                <option value="complaint">Complaint</option>
                <option value="suggestion">Suggestion</option>
                <option value="inquiry">Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mandal</label>
              <select
                name="mandal"
                value={formData.mandal}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                disabled={isSubmitting}
              >
                <option value="">Select Mandal</option>
                {mandalOptions.map((mandal, index) => (
                  <option key={index} value={mandal}>{mandal}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Applicant</label>
            <input 
              name="applicant" 
              value={formData.applicant} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  name="programDate" 
                  type="date" 
                  value={formData.programDate} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  name="startTime" 
                  type="time" 
                  value={formData.startTime} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  name="endTime" 
                  type="time" 
                  value={formData.endTime} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                disabled={isSubmitting}
              >
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              <input 
                name="assignedTo" 
                value={formData.assignedTo} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Notes</label>
            <textarea 
              name="resolutionNotes" 
              value={formData.resolutionNotes} 
              onChange={handleChange} 
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isSubmitting}
            />
          </div>

          {/* Image Upload */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Grievance Image</h3>
            <div className="flex flex-col items-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-64 rounded-lg shadow border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                    disabled={isSubmitting}
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-gray-500 hover:border-blue-400 hover:text-blue-500 transition">
                  <Upload className="w-6 h-6 mb-2" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
              )}

              <label className="mt-4 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                <Upload size={16} className="mr-2" />
                {imagePreview ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center min-w-32"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrievanceEditModal;