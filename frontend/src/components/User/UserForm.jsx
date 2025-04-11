// src/components/User/UserForm.jsx
import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { createUser } from '../../services/api';
import FormInput from '../common/FormInput';

const UserForm = () => {
  const { currentUser } = useContext(AppContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
    assignedTables: []
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
        return { ...prev, assignedTables: [...prev.assignedTables, value] };
      } else {
        return { ...prev, assignedTables: prev.assignedTables.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await createUser(formData);
      setSuccess(true);
      setFormData({
        username: '',
        password: '',
        role: 'user',
        assignedTables: []
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-2 bg-green-100 text-green-700 rounded-md">
          User created successfully! Credentials have been sent to the user.
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <FormInput
          label="Role"
          name="role"
          type="select"
          value={formData.role}
          onChange={handleChange}
          options={currentUser.role === 'admin' ? ['admin', 'user'] : ['user']}
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
                checked={formData.assignedTables.includes(option.value)}
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
        disabled={isSubmitting}
        className={`px-4 py-2 rounded ${isSubmitting ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'} text-white`}
      >
        {isSubmitting ? 'Creating User...' : 'Create User'}
      </button>
    </form>
  );
};

export default UserForm;