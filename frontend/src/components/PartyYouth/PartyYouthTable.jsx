import { useState } from 'react';
import { Edit, Trash, Phone, User } from 'lucide-react';
import StatusBadge from '../common/StatusBadge'; // Assuming you have a StatusBadge component

const PartyYouthTable = () => {
  // Dummy data for Party Youth
  const partyYouth = [
    { id: 1, memberId: 'M001', aadharNo: '123456789012', name: 'John Doe', whatsappNo: '9876543210', designation: 'Member', mandalPanchayat: 'Mandal A' },
    { id: 2, memberId: 'M002', aadharNo: '234567890123', name: 'Jane Smith', whatsappNo: '9123456789', designation: 'Leader', mandalPanchayat: 'Mandal B' },
    { id: 3, memberId: 'M003', aadharNo: '345678901234', name: 'Robert Brown', whatsappNo: '9801234567', designation: 'Member', mandalPanchayat: 'Mandal C' },
    { id: 4, memberId: 'M004', aadharNo: '456789012345', name: 'Emily White', whatsappNo: '9879879876', designation: 'Coordinator', mandalPanchayat: 'Mandal D' },
  ];

  // State for filtered data
  const [filteredPartyYouth, setFilteredPartyYouth] = useState(partyYouth);
  const [currentUser] = useState({ role: 'admin' }); // Dummy current user (Admin role)

  // Columns for table
  const columns = [
    { header: 'Member ID', accessor: 'memberId' },
    { header: 'Aadhar No', accessor: 'aadharNo' },
    { header: 'Name', accessor: 'name' },
    { header: 'WhatsApp No', accessor: 'whatsappNo' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Mandal/Panchayat', accessor: 'mandalPanchayat' },
  ];

  // State for editing data
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Dummy update function (simulating API call)
  const updatePartyYouth = (updatedMember) => {
    console.log('Updating Party Youth member:', updatedMember);
  };

  // Dummy delete function (simulating API call)
  const deletePartyYouth = (id) => {
    console.log('Deleting Party Youth member with id:', id);
  };

  // Edit handler
  const handleEdit = (id, field, value) => {
    const memberToUpdate = partyYouth.find(m => m.id === id);
    updatePartyYouth({ ...memberToUpdate, [field]: value });
  };

  // Handle save after editing
  const handleSaveEdit = () => {
    const updatedMember = { ...editForm, id: editingId };
    updatePartyYouth(updatedMember);
    setEditingId(null);
    setEditForm({});
  };

  // Handle cancel after editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Handle input change for the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle search/filter input change
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setFilteredPartyYouth(partyYouth.filter(member => 
      member.name.toLowerCase().includes(term) || 
      member.memberId.toLowerCase().includes(term)
    ));
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Party & Youth Affair Records</h2>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name or Member ID"
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column) => (
                <th key={column.accessor} className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  {column.header}
                </th>
              ))}
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartyYouth.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.accessor} className="py-3 px-4 text-sm text-gray-700">
                    {editingId === member.id ? (
                      <input
                        type="text"
                        name={column.accessor}
                        value={editForm[column.accessor] || member[column.accessor]}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    ) : (
                      member[column.accessor]
                    )}
                  </td>
                ))}
                <td className="py-3 px-4 text-sm text-gray-700">
                  <div className="flex space-x-2">
                    {editingId === member.id ? (
                      <>
                        <button onClick={handleSaveEdit} className="text-blue-600 hover:text-blue-800">
                          Save
                        </button>
                        <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-800">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        {currentUser.role === 'admin' && (
                          <>
                            <button
                              onClick={() => setEditingId(member.id) || setEditForm(member)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deletePartyYouth(member.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash size={16} />
                            </button>
                          </>
                        )}
                        {member.whatsappNo && (
                          <a
                            href={`https://wa.me/${member.whatsappNo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800"
                          >
                            <Phone size={16} />
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit form (for editing fields) */}
      {editingId && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Edit Party Youth Member</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp No</label>
              <input
                type="text"
                name="whatsappNo"
                value={editForm.whatsappNo}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                name="designation"
                value={editForm.designation}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mandal/Panchayat</label>
              <input
                type="text"
                name="mandalPanchayat"
                value={editForm.mandalPanchayat}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyYouthTable;
