import { useState } from 'react';
import FormInput from '../common/FormInput';
import { useGrievance } from '../../context/GrievanceContext';

const GrievanceForm = () => {
  const { addGrievance } = useGrievance();

  // Sample mandal array - you can replace this with your actual data source
  const mandals = [
    'Adilabad',
    'Bhadradri Kothagudem',
    'Hyderabad',
    'Jagtial',
    'Jangaon',
    'Jayashankar Bhupalpally',
    'Jogulamba Gadwal',
    'Kamareddy',
    'Karimnagar',
    'Khammam',
    'Komaram Bheem Asifabad',
    'Mahabubabad',
    'Mahabubnagar',
    'Mancherial',
    'Medak',
    'Medchal-Malkajgiri',
    'Mulugu',
    'Nagarkurnool',
    'Nalgonda',
    'Narayanpet',
    'Nirmal',
    'Nizamabad',
    'Peddapalli',
    'Rajanna Sircilla',
    'Rangareddy',
    'Sangareddy',
    'Siddipet',
    'Suryapet',
    'Vikarabad',
    'Wanaparthy',
    'Warangal Rural',
    'Warangal Urban',
    'Yadadri Bhuvanagiri'
  ];

  const [formData, setFormData] = useState({
    grievanceName: '',
    type: '',
    applicant: '',
    registeredOn: new Date().toISOString().split('T')[0],
    programDate: '',
    startTime: '',
    endTime: '',
    status: 'pending',
    description: '',
    assignedTo: '',
    resolutionNotes: '',
    mandal: '' // Added mandal field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call context method to send data to API
      await addGrievance({
        grievanceName: formData.grievanceName,
        type: formData.type,
        applicant: formData.applicant,
        programDate: formData.programDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: formData.status,
        description: formData.description,
        assignedTo: formData.assignedTo,
        resolutionNotes: formData.resolutionNotes,
        mandal: formData.mandal // Include mandal in the submitted data
      });

      // Reset form
      setFormData({
        grievanceName: '',
        type: '',
        applicant: '',
        registeredOn: new Date().toISOString().split('T')[0],
        programDate: '',
        startTime: '',
        endTime: '',
        status: 'pending',
        description: '',
        assignedTo: '',
        resolutionNotes: '',
        mandal: '' // Reset mandal field
      });
    } catch (error) {
      console.error('Failed to submit grievance:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Grievance Name"
          name="grievanceName"
          value={formData.grievanceName}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Type"
          name="type"
          type="select"
          value={formData.type}
          onChange={handleChange}
          options={['complaint', 'request', 'feedback', 'other']}
          required
        />

        <FormInput
          label="Applicant"
          name="applicant"
          value={formData.applicant}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Mandal"
          name="mandal"
          type="select"
          value={formData.mandal}
          onChange={handleChange}
          options={mandals}
          required
          placeholder="Select Mandal"
        />

        <FormInput
          label="Registered On"
          name="registeredOn"
          type="date"
          value={formData.registeredOn}
          onChange={handleChange}
          disabled
        />

        <FormInput
          label="Program Date"
          name="programDate"
          type="date"
          value={formData.programDate}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Start Time"
          name="startTime"
          type="time"
          value={formData.startTime}
          onChange={handleChange}
          required
        />

        <FormInput
          label="End Time"
          name="endTime"
          type="time"
          value={formData.endTime}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Status"
          name="status"
          type="select"
          value={formData.status}
          onChange={handleChange}
          options={['pending', 'in_progress', 'completed', 'cancelled']}
        />

        <FormInput
          label="Assigned To"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
        />
      </div>

      <div>
        <label htmlFor="resolutionNotes" className="block text-sm font-medium text-gray-700">
          Resolution Notes (optional)
        </label>
        <textarea
          id="resolutionNotes"
          name="resolutionNotes"
          rows={2}
          value={formData.resolutionNotes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Grievance
      </button>
    </form>
  );
};

export default GrievanceForm;