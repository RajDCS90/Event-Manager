// src/components/Grievance/GrievanceForm.jsx
import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import FormInput from '../common/FormInput';

const GrievanceForm = () => {
  const { addGrievance } = useContext(AppContext);
  const [formData, setFormData] = useState({
    grievanceName: '',
    type: '',
    applicant: '',
    registeredOn: new Date().toISOString().split('T')[0],
    status: 'Pending',
    description: '',
    assignedTo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addGrievance({
      ...formData,
      id: Date.now(),
      grievanceId: `GRV-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setFormData({
      grievanceName: '',
      type: '',
      applicant: '',
      registeredOn: new Date().toISOString().split('T')[0],
      status: 'Pending',
      description: '',
      assignedTo: ''
    });
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
          value={formData.type}
          onChange={handleChange}
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
          label="Registered On"
          name="registeredOn"
          type="date"
          value={formData.registeredOn}
          onChange={handleChange}
        />
        
        <FormInput
          label="Status"
          name="status"
          type="select"
          value={formData.status}
          onChange={handleChange}
          options={['Pending', 'Completed', 'Cancelled']}
        />
        
        <FormInput
          label="Assigned To"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
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