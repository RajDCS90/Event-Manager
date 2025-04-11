// src/components/User/UserTable.jsx
import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Filter from '../common/Filter';
import Table from '../common/Table';

const UserTable = () => {
  const { users, currentUser, deleteUser } = useContext(AppContext);
  const [filteredUsers, setFilteredUsers] = useState(users);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { 
      header: 'Access', 
      accessor: 'access', 
      render: (access) => (
        <div className="flex flex-wrap gap-1">
          {access.map(item => (
            <span key={item} className="bg-gray-100 px-2 py-1 text-xs rounded">
              {item}
            </span>
          ))}
        </div>
      ) 
    },
  ];

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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  {columns.map(column => (
                    <td key={`${user.id}-${column.accessor}`} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(user[column.accessor]) : user[column.accessor]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {currentUser.role === 'admin' && currentUser.id !== user.id && (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
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