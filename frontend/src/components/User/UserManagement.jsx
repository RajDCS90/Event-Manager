// src/components/User/UserManagement.jsx
import { useState } from 'react';
import UserForm from './UserForm';
import UserTable from './UserTable';

const UserManagement = () => {
  const [refresh, setRefresh] = useState(false);

  const handleUserCreated = () => {
    setRefresh(prev => !prev); // trigger re-fetch in UserTable
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Add New User</h2>
        <UserForm onUserCreated={handleUserCreated} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <UserTable refresh={refresh} />
      </div>
    </div>
  );
};

export default UserManagement;
