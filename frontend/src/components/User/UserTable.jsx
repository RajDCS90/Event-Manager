// src/components/User/UserTable.jsx
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { getUsers, deleteUser } from '../../services/api';
import Filter from '../common/Filter';
import Table from '../common/Table';

const UserTable = () => {
  const { currentUser } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const columns = [
    { header: 'Username', accessor: 'username' },
    { header: 'Role', accessor: 'role' },
    { 
      header: 'Assigned Tables', 
      accessor: 'assignedTables', 
      render: (tables) => (
        <div className="flex flex-wrap gap-1">
          {tables.map(table => (
            <span key={table} className="bg-gray-100 px-2 py-1 text-xs rounded">
              {table}
            </span>
          ))}
        </div>
      ) 
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        console.log("userData: ", usersData);
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user._id !== id));
        setFilteredUsers(filteredUsers.filter(user => user._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">User Records</h2>
      
      <Filter 
        data={users} 
        setFilteredData={setFilteredUsers} 
        columns={columns.map(col => ({ value: col.accessor, label: col.header }))}
      />
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.accessor}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {currentUser.role === 'admin' && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  {columns.map(column => (
                    <td key={`${user._id}-${column.accessor}`} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(user[column.accessor]) : user[column.accessor]}
                    </td>
                  ))}
                  {currentUser.role === 'admin' && currentUser._id !== user._id && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (currentUser.role === 'admin' ? 1 : 0)} className="px-6 py-4 text-center text-gray-500">
                  No users available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;