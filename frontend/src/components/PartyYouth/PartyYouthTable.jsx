import { useEffect, useState } from "react";
import { Edit, Trash, Phone } from "lucide-react";
import { usePartyAndYouth } from "../../context/P&YContext";

const PartyYouthTable = () => {
  const {
    members,
    fetchMembers,
    updateMember,
    deleteMember,
  } = usePartyAndYouth();
  const [filteredMembers, setFilteredMembers] = useState([]); // Add back for frontend search
  const [currentUser] = useState({ role: "admin" });
  const [searchTerm, setSearchTerm] = useState("");
  const [mandalFilter, setMandalFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Remove filteredMembers state as we'll use members directly
  // Remove handleFiltering function as filtering will be done in backend

  useEffect(() => {
    // Initial fetch without filters
    fetchMembers();
  }, []);

  useEffect(() => {
    // Debounce the filtering to avoid too many requests
      fetchMembers({
        mandal: mandalFilter,
        designation: designationFilter
      });
  }, [ mandalFilter, designationFilter]);

  // Frontend search
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = members.filter(m => 
        m.name?.toLowerCase().includes(term) || 
        m.aadharNo?.toLowerCase().includes(term)
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [searchTerm, members]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      await updateMember(editingId, editForm);
      setEditingId(null);
      setEditForm({});
      // Refresh the data after update
      fetchMembers();
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteMember(id);
        // Refresh the data after delete
        fetchMembers();
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  // Get distinct values for filters
  const mandalOptions = [
    "Mandal 1",
    "Mandal 2",
    "Mandal 3",
    "Mandal 4",
    "Mandal 5",
  ];
  const designationOptions = [
    "Member",
    "Volunteer",
  ];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Party & Youth Affair Records
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Name or Aadhar No"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />

        <select
          value={mandalFilter}
          onChange={(e) => setMandalFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Mandals</option>
          {mandalOptions.map((mandal, index) => (
            <option key={index} value={mandal}>
              {mandal}
            </option>
          ))}
        </select>

        <select
          value={designationFilter}
          onChange={(e) => setDesignationFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Designations</option>
          {designationOptions.map((designation, index) => (
            <option key={index} value={designation}>
              {designation}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold">Aadhar No</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">WhatsApp No</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Designation</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Mandal</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">
                  {editingId === member._id ? (
                    <input
                      name="aadharNo"
                      value={editForm.aadharNo || ""}
                      onChange={handleInputChange}
                      className="p-1 border rounded w-full"
                    />
                  ) : (
                    member.aadharNo || "-"
                  )}
                </td>
                <td className="py-3 px-4 text-sm">
                  {editingId === member._id ? (
                    <input
                      name="name"
                      value={editForm.name || ""}
                      onChange={handleInputChange}
                      className="p-1 border rounded w-full"
                    />
                  ) : (
                    member.name || "-"
                  )}
                </td>
                <td className="py-3 px-4 text-sm">
                  {editingId === member._id ? (
                    <input
                      name="whatsappNo"
                      value={editForm.whatsappNo || ""}
                      onChange={handleInputChange}
                      className="p-1 border rounded w-full"
                    />
                  ) : (
                    member.whatsappNo || "-"
                  )}
                </td>
                <td className="py-3 px-4 text-sm">
                  {editingId === member._id ? (
                    <input
                      name="designation"
                      value={editForm.designation || ""}
                      onChange={handleInputChange}
                      className="p-1 border rounded w-full"
                    />
                  ) : (
                    member.designation || "-"
                  )}
                </td>
                <td className="py-3 px-4 text-sm">
                  {editingId === member._id ? (
                    <select
                      name="address.mandal"
                      value={editForm.address?.mandal || ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            mandal: e.target.value,
                          },
                        }))
                      }
                      className="p-1 border rounded w-full"
                    >
                      <option value="">Select Mandal</option>
                      {mandalOptions.map((mandal, idx) => (
                        <option key={idx} value={mandal}>
                          {mandal}
                        </option>
                      ))}
                    </select>
                  ) : (
                    member.address?.mandal || "-"
                  )}
                </td>

                <td className="py-3 px-4 text-sm">
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
                              onClick={() => handleDelete(member._id)}
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

      {members.length === 0 && (
        <div className="text-center py-4 text-gray-500">No members found</div>
      )}
    </div>
  );
};

export default PartyYouthTable;