import { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser, updateUserPassword } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserTable = ({ refresh }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editData, setEditData] = useState({ username: '', role: '', assignedTables: [] });
  const [editingPasswordUserId, setEditingPasswordUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const accessOptions = [
    { value: 'event', label: 'Event Table' },
    { value: 'grievances', label: 'Grievance Table' },
    { value: 'party', label: 'Party & Youth Affair' },
  ];

  const columns = [
    { header: 'Username', accessor: 'username' },
    { header: 'Role', accessor: 'role' },
    {
      header: 'Assigned Tables',
      accessor: 'assignedTables',
      render: (tables) => (
        <div className="flex flex-wrap gap-1">
          {tables.map((table) => (
            <span key={table} className="bg-gray-100 px-2 py-1 text-xs rounded">
              {table}
            </span>
          ))}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        const updated = users.filter((user) => user._id !== id);
        setUsers(updated);
        setFilteredUsers(updated);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setEditData({ ...user, assignedTables: [...user.assignedTables] });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssignedTablesChange = (e) => {
    const { value, checked } = e.target;
    setEditData((prev) => {
      const updatedTables = checked
        ? [...prev.assignedTables, value]
        : prev.assignedTables.filter((table) => table !== value);
      return {
        ...prev,
        assignedTables: updatedTables,
      };
    });
  };

  const handleEditSubmit = async () => {
    try {
      const updatedUser = await updateUser(editUserId, editData);
      const updatedList = users.map((user) =>
        user._id === editUserId ? updatedUser : user
      );
      setUsers(updatedList);
      setFilteredUsers(updatedList);
      setEditUserId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordSubmit = async (userId) => {
    try {
      const res = await updateUserPassword(userId, newPassword);
      console.log('res of changepas',res)
      setEditingPasswordUserId(null);
      setNewPassword('');
      alert('Password updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Password update failed');
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">User Records</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  {column.header}
                </th>
              ))}
              {currentUser.role === 'admin' && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                {editUserId === user._id ? (
                  <>
                    <td className="px-4 py-3">
                      <input
                        name="username"
                        value={editData.username}
                        onChange={handleEditChange}
                        className="border px-2 py-1 w-full rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        name="role"
                        value={editData.role}
                        onChange={handleEditChange}
                        className="border px-2 py-1 w-full rounded"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {accessOptions.map(({ value, label }) => (
                          <label key={value} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                            <input
                              type="checkbox"
                              value={value}
                              checked={editData.assignedTables.includes(value)}
                              onChange={handleAssignedTablesChange}
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={handleEditSubmit} className="text-blue-600 hover:text-blue-800">Save</button>
                      <button onClick={() => setEditUserId(null)} className="text-gray-600 hover:text-gray-800">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    {columns.map((column) => (
                      <td key={`${user._id}-${column.accessor}`} className="px-4 py-3">
                        {column.render
                          ? column.render(user[column.accessor])
                          : user[column.accessor]}
                      </td>
                    ))}
                    {currentUser.role === 'admin' && (
                      <td className="px-4 py-3 space-y-2 space-x-2">
                        {currentUser._id !== user._id && (
                          <>
                            <div className="flex gap-2 flex-wrap">
                              <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800">
                                Edit
                              </button>
                              <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-800">
                                Delete
                              </button>
                              <button onClick={() => setEditingPasswordUserId(user._id)} className="text-yellow-600 hover:text-yellow-800">
                                Change Password
                              </button>
                            </div>
                            {editingPasswordUserId === user._id && (
                              <div className="mt-2 space-x-2">
                                <input
                                  type="password"
                                  placeholder="New password"
                                  value={newPassword}
                                  autoComplete="current-password"
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="border px-2 py-1 rounded"
                                />
                                <button
                                  onClick={() => handlePasswordSubmit(user._id)}
                                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                >
                                  Submit
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingPasswordUserId(null);
                                    setNewPassword('');
                                  }}
                                  className="text-gray-600 hover:text-gray-800"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
