// src/components/Grievance/GrievanceTable.jsx
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const GrievanceTable = () => {
  const { grievances, currentUser, updateGrievance, deleteGrievance } = useContext(AppContext);
  const [filteredGrievances, setFilteredGrievances] = useState(grievances);
  const [filterField, setFilterField] = useState('grievanceName');
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    if (filterQuery) {
      setFilteredGrievances(
        grievances.filter(grievance =>
          grievance[filterField]?.toString().toLowerCase().includes(filterQuery.toLowerCase())
        )
      );
    } else {
      setFilteredGrievances(grievances);
    }
  }, [filterQuery, filterField, grievances]);

  const columns = [
    { header: 'Grievance ID', accessor: 'grievanceId' },
    { header: 'Grievance Name', accessor: 'grievanceName' },
    { header: 'Type', accessor: 'type' },
    { header: 'Applicant', accessor: 'applicant' },
    { header: 'Registered On', accessor: 'registeredOn' },
    { header: 'Status', accessor: 'status' },
    { header: 'Assigned To', accessor: 'assignedTo' },
  ];

  const handleEdit = (id, field, value) => {
    const grievanceToUpdate = grievances.find(g => g._id === id);
    updateGrievance(grievanceToUpdate._id, { ...grievanceToUpdate, [field]: value });
  };

  const handleDelete = (id) => {
    deleteGrievance(id);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Grievance Records</h2>

      <div className="flex items-center gap-2 mb-4">
        <select
          value={filterField}
          onChange={(e) => setFilterField(e.target.value)}
          className="border rounded p-2"
        >
          {columns?.map(col => (
            <option key={col.accessor} value={col.accessor}>
              {col.header}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {columns?.map(col => (
                <th key={col.accessor} className="py-2 px-4 text-left border-b">{col.header}</th>
              ))}
              <th className="py-2 px-4 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrievances.map(grievance => (
              <tr key={grievance._id} className="border-b">
                {columns?.map(col => (
                  <td key={col.accessor} className="py-2 px-4">
                    {grievance[col.accessor]}
                  </td>
                ))}
                <td className="py-2 px-4">
                  {(currentUser.role === 'admin' || currentUser.role === 'user') && (
                    <>
                      <button
                        onClick={() => handleEdit(grievance._id, 'status', 'Completed')}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleDelete(grievance._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GrievanceTable;
