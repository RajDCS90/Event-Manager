// src/components/Event/EventForm.jsx
import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import FormInput from '../common/FormInput';

const EventForm = () => {
  const { addEvent } = useContext(AppContext);
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'Political',
    venue: '',
    status: 'Pending',
    mandalPanchayat: 'Mandal 1',
    requesterName: '',
    requesterContact: ''
  });

  const mandalPanchayatOptions = ['Mandal 1', 'Mandal 2', 'Mandal 3', 'Panchayat A', 'Panchayat B'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent(formData);
    setFormData({
      eventName: '',
      eventType: 'Political',
      venue: '',
      status: 'Pending',
      mandalPanchayat: 'Mandal 1',
      requesterName: '',
      requesterContact: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Event Name"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          required
        />
        
        <FormInput
          label="Event Type"
          name="eventType"
          type="select"
          value={formData.eventType}
          onChange={handleChange}
          options={['Political', 'Social', 'Commercial', 'Welfare']}
        />
        
        <FormInput
          label="Venue"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          required
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
          label="Mandal/Panchayat"
          name="mandalPanchayat"
          type="select"
          value={formData.mandalPanchayat}
          onChange={handleChange}
          options={mandalPanchayatOptions}
        />
        
        <FormInput
          label="Requester Name"
          name="requesterName"
          value={formData.requesterName}
          onChange={handleChange}
        />
        
        <FormInput
          label="Requester Contact"
          name="requesterContact"
          value={formData.requesterContact}
          onChange={handleChange}
          type="tel"
        />
      </div>
      
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Event
      </button>
    </form>
  );
};

export default EventForm;