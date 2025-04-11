// src/components/User/UserManagement.jsx
import UserForm from './UserForm';
import UserTable from './UserTable';

const UserManagement = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Add New User</h2>
        <UserForm />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <UserTable />
      </div>
    </div>
  );
};

export default UserManagement;