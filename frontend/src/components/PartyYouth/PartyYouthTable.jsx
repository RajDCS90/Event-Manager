import { useEffect, useState } from "react";
import { Edit, Trash, Phone } from "lucide-react";
import { usePartyAndYouth } from "../../context/P&YContext";

const PartyYouthTable = () => {
  const { members, fetchMembers,updateMember } = usePartyAndYouth();

  useEffect(() => {
    if (members.length === 0) fetchMembers();
  }, []);

  // State for filtered data
  const [filteredMembers, setFilteredMembers] = useState(members);
  const [currentUser] = useState({ role: "admin" });

  // Update filtered members when members data changes
  useEffect(() => {
    setFilteredMembers(members);
  }, [members]);

  // Columns for table
  const columns = [
    { header: "Aadhar No", accessor: "aadharNo" },
    { header: "Name", accessor: "name" },
    { header: "WhatsApp No", accessor: "whatsappNo" },
    { header: "Designation", accessor: "designation" },
    { header: "Mandal", accessor: "mandal" },
  ];

  // State for editing data
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});


  // Dummy delete function (replace with your actual API call)
  const deletePartyYouth = async (id) => {
    console.log("Deleting member with id:", id);
    // Add your actual delete logic here
  };

  // Handle input change for the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save after editing
  const handleSaveEdit = async () => {
    try {
      // You need to pass memberId and updatedData separately to updateMember
      await updateMember(editingId, editForm); // Fixed: passing arguments correctly
      setEditingId(null);
      setEditForm({});
      // No need to call fetchMembers() since we're already updating the state in updateMember
    } catch (error) {
      console.error("Error updating member:", error);
      // You might want to show this error to the user
    }
  };

  // Handle cancel after editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Handle search/filter input change
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setFilteredMembers(
      members.filter(
        (member) =>
          member.name?.toLowerCase().includes(term) ||
          member.aadharNo?.toLowerCase().includes(term)
    ));
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Party & Youth Affair Records
      </h2>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name or Aadhar No"
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
                <th
                  key={column.accessor}
                  className="py-3 px-4 text-left text-sm font-semibold text-gray-700"
                >
                  {column.header}
                </th>
              ))}
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member._id} className="border-b hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.accessor}
                    className="py-3 px-4 text-sm text-gray-700"
                  >
                    {editingId === member._id ? (
                      <input
                        type="text"
                        name={column.accessor}
                        value={
                          editForm[column.accessor] || member[column.accessor] || ""
                        }
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    ) : (
                      member[column.accessor] || "-"
                    )}
                  </td>
                ))}
                <td className="py-3 px-4 text-sm text-gray-700">
                  <div className="flex space-x-2">
                    {editingId === member._id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        {currentUser.role === "admin" && (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(member._id);
                                setEditForm(member);
                              }}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deletePartyYouth(member._id)}
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

      {/* Empty state */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No members found
        </div>
      )}

      {/* Edit form */}
      {editingId && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Edit Member Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {columns.map((column) => (
              <div key={column.accessor}>
                <label className="block text-sm font-medium text-gray-700">
                  {column.header}
                </label>
                <input
                  type="text"
                  name={column.accessor}
                  value={editForm[column.accessor] || ""}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyYouthTable;