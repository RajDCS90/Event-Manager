// src/components/PartyYouth/PartyYouthForm.jsx
import { useState } from 'react';
import FormInput from '../common/FormInput';
import { usePartyAndYouth } from '../../context/P&YContext';

const PartyYouthForm = () => {
  const {createMember} = usePartyAndYouth();
  const [formData, setFormData] = useState({
    aadharNo: '',
    name: '',
    whatsappNo: '',
    designation: '',
    mandal: 'Mandal 1'
  });

  const mandalPanchayatOptions = ['Mandal 1', 'Mandal 2', 'Mandal 3', 'Panchayat A', 'Panchayat B'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   await createMember({
      ...formData,
      id: Date.now(),
      memberId: `PY-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setFormData({
      aadharNo: '',
      name: '',
      whatsappNo: '',
      designation: '',
      mandal: 'Mandal 1'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Aadhar Number"
          name="aadharNo"
          value={formData.aadharNo}
          onChange={handleChange}
          required
          type="number"
          maxLength="12"
        />
        
        <FormInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <FormInput
          label="WhatsApp Number"
          name="whatsappNo"
          value={formData.whatsappNo}
          onChange={handleChange}
          required
          type="tel"
        />
        
        <FormInput
          label="Designation"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        />
        
        <FormInput
          label="Mandal/Panchayat"
          name="mandal"
          type="select"
          value={formData.mandal}
          onChange={handleChange}
          options={mandalPanchayatOptions}
        />
      </div>
      
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Member
      </button>
    </form>
  );
};

export default PartyYouthForm;