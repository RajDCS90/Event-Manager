// src/components/User/UserForm.jsx
import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import FormInput from '../common/FormInput';

const UserForm = () => {
  const { addUser } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    role: 'user',
    access: []
  });

  const accessOptions = [
    { value: 'events', label: 'Event Table' },
    { value: 'grievances', label: 'Grievance Table' },
    { value: 'partyYouth', label: 'Party & Youth Affair' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAccessChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, access: [...prev.access, value] };
      } else {
        return { ...prev, access: prev.access.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(formData);
    setFormData({
      name: '',
      role: 'user',
      access: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="User Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <FormInput
          label="Role"
          name="role"
          type="select"
          value={formData.role}
          onChange={handleChange}
          options={['admin', 'user']}
        />
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Access Permissions</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {accessOptions.map(option => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`access-${option.value}`}
                value={option.value}
                checked={formData.access.includes(option.value)}
                onChange={handleAccessChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`access-${option.value}`} className="ml-2 block text-sm text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Create User
      </button>
    </form>
  );
};

export default UserForm;