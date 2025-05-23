import { useEffect, useState } from "react";
import { Edit, Trash, Check, FilterX } from "lucide-react";
import { usePartyAndYouth } from "../../context/P&YContext";
import axios from "axios";

const PartyYouthTable = () => {
  const {
    members: backendResponse, // Rename to be more explicit
    fetchMembers,
    updateMember,
    deleteMember,
    reactivateMember,
    loading
  } = usePartyAndYouth();

  // Extract members array from backend response
  const members = backendResponse?.data || [];
  const isLimited = backendResponse?.limited || false;

  const [designationFilter, setDesignationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentUser] = useState({ role: "admin" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filter states
  const [mandalFilter, setMandalFilter] = useState("");
  const [wardFilter, setWardFilter] = useState("");
  const [panchayatFilter, setPanchayatFilter] = useState("");
  const [villageFilter, setVillageFilter] = useState("");
  const [boothFilter, setBoothFilter] = useState("");

  // Filter options
  const [designationOptions, setDesignationOptions] = useState([]);
  const [mandalOptions, setMandalOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [panchayatOptions, setPanchayatOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [boothOptions, setBoothOptions] = useState([]);

  const WhatsAppIcon = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [messageModal, setMessageModal] = useState({
    isOpen: false,
    phoneNumbers: [],
    message: "",
    sending: false,
    error: null,
    success: false
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (statusFilter) filters.status = statusFilter;
    if (mandalFilter) filters.mandal = mandalFilter;
    if (designationFilter) filters.designation = designationFilter;
    if (wardFilter) {
      filters.ward = wardFilter;
      filters.areaType = 'Ward';
    }
    if (panchayatFilter) {
      filters.panchayat = panchayatFilter;
      filters.areaType = 'Panchayat';
    }
    if (villageFilter) filters.village = villageFilter;
    if (boothFilter) filters.booth = boothFilter;

    fetchMembers(filters);
    updateFilterOptions();
  }, [searchTerm, statusFilter, mandalFilter, designationFilter, wardFilter, panchayatFilter, villageFilter, boothFilter]);

  useEffect(() => {
    if (members.length > 0) {
      updateFilterOptions();
    }
  }, [members]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setMandalFilter("");
    setDesignationFilter("");
    setWardFilter("");
    setPanchayatFilter("");
    setVillageFilter("");
    setBoothFilter("");
    setSelectedMembers([]);
    setSelectAll(false);
  };

  const updateFilterOptions = () => {
    setMandalOptions([...new Set(members.map(m => m.address?.mandal).filter(Boolean))]);
    setDesignationOptions([...new Set(members.map(m => m.designation).filter(Boolean))]);

    const currentFiltered = members.filter(m =>
      (!mandalFilter || m.address?.mandal === mandalFilter) &&
      (!statusFilter || (statusFilter === 'active' ? m.isActive !== false : m.isActive === false))
    );

    setWardOptions([...new Set(currentFiltered.filter(m => m.address?.areaType === 'Ward').map(m => m.address?.area).filter(Boolean))]);
    setPanchayatOptions([...new Set(currentFiltered.filter(m => m.address?.areaType === 'Panchayat').map(m => m.address?.area).filter(Boolean))]);
    setVillageOptions([...new Set(currentFiltered.map(m => m.address?.village).filter(Boolean))]);
    setBoothOptions([...new Set(currentFiltered.map(m => m.address?.booth).filter(Boolean))]);
  };

  // Reset dependent filters
  useEffect(() => {
    setWardFilter("");
    setPanchayatFilter("");
    setVillageFilter("");
    setBoothFilter("");
  }, [mandalFilter]);

  useEffect(() => {
    setVillageFilter("");
    setBoothFilter("");
  }, [wardFilter, panchayatFilter]);

  useEffect(() => {
    setBoothFilter("");
  }, [villageFilter]);

  useEffect(() => {
    if (selectAll) {
      const selectableMembers = members.filter(member => member.whatsappNo);
      setSelectedMembers(selectableMembers.map(member => member._id));
    } else {
      setSelectedMembers([]);
    }
  }, [selectAll, members]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      await updateMember(editingId, editForm);
      setEditingId(null);
      setEditForm({});
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
        fetchMembers();
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  // Toggle selection for a single member
  const toggleMemberSelection = (memberId, hasWhatsApp) => {
    if (!hasWhatsApp) return;

    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // WhatsApp message functions
  const openBulkMessageModal = () => {
    const membersToUse = selectedMembers.length > 0
      ? members.filter(member => selectedMembers.includes(member._id) && member.whatsappNo)
      : members.filter(member => member.whatsappNo);

    const phoneNumbers = membersToUse.map(member => ({
      phone: member.whatsappNo,
      name: member.name
    }));

    if (phoneNumbers.length === 0) {
      alert("No members with WhatsApp numbers selected");
      return;
    }

    setMessageModal({
      isOpen: true,
      phoneNumbers,
      message: "",
      sending: false,
      error: null,
      success: false
    });
  };

  const openIndividualMessageModal = (phoneNumber, name) => {
    setMessageModal({
      isOpen: true,
      phoneNumbers: [{ phone: phoneNumber, name }],
      message: "",
      sending: false,
      error: null,
      success: false
    });
  };

  const closeMessageModal = () => {
    setMessageModal({
      isOpen: false,
      phoneNumbers: [],
      message: "",
      sending: false,
      error: null,
      success: false
    });
  };

  const handleMessageChange = (e) => {
    setMessageModal(prev => ({
      ...prev,
      message: e.target.value,
      error: null,
      success: false
    }));
  };

  const sendWhatsAppMessages = async () => {
    if (!messageModal.message.trim()) {
      setMessageModal(prev => ({ ...prev, error: "Please enter a message" }));
      return;
    }

    try {
      setMessageModal(prev => ({ ...prev, sending: true, error: null }));

      const response = await axios.post('http://localhost:5000/api/whatsapp/send-custom-messages', {
        phoneNumbers: messageModal.phoneNumbers.map(p => p.phone),
        message: messageModal.message
      });
      console.log('reees', response)

      setMessageModal(prev => ({
        ...prev,
        sending: false,
        success: true,
        error: null
      }));

      setTimeout(() => {
        closeMessageModal();
      }, 2000);
    } catch (error) {
      console.error('Error sending WhatsApp messages:', error);
      setMessageModal(prev => ({
        ...prev,
        sending: false,
        success: false,
        error: error.response?.data?.message || "Failed to send messages"
      }));
    }
  };

  // Function to show last 4 digits of Aadhar
  const getMaskedAadhar = (aadharNo) => {
    if (!aadharNo || aadharNo.length < 4) return "****";
    return `****${aadharNo.slice(-4)}`;
  };

  // const designationOptions = [...new Set(members?.map(m => m.designation))];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-4">
          Party & Youth Affair Records
          {isLimited && (
            <span className="text-sm text-gray-500 ml-2">(Showing first 30 results)</span>
          )}
        </h2>
        {selectedMembers.length > 0 && (
          <button
            onClick={openBulkMessageModal}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <WhatsAppIcon className="mr-2" />
            Send to {selectedMembers.length} selected
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Name"
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
          value={wardFilter}
          onChange={(e) => setWardFilter(e.target.value)}
          disabled={!mandalFilter}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Wards</option>
          {wardOptions.map((ward, index) => (
            <option key={index} value={ward}>
              {ward}
            </option>
          ))}
        </select>

        <select
          value={panchayatFilter}
          onChange={(e) => setPanchayatFilter(e.target.value)}
          disabled={!mandalFilter}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Panchayats</option>
          {panchayatOptions.map((panchayat, index) => (
            <option key={index} value={panchayat}>
              {panchayat}
            </option>
          ))}
        </select>

        <select
          value={villageFilter}
          onChange={(e) => setVillageFilter(e.target.value)}
          disabled={!(wardFilter || panchayatFilter)}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Villages</option>
          {villageOptions.map((village, index) => (
            <option key={index} value={village}>
              {village}
            </option>
          ))}
        </select>

        <select
          value={boothFilter}
          onChange={(e) => setBoothFilter(e.target.value)}
          disabled={!villageFilter}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Booths</option>
          {boothOptions.map((booth, index) => (
            <option key={index} value={booth}>
              {booth}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
      <div className="flex justify-end w-full mb-5">
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg shadow-sm transition-all text-sm font-medium"
          title="Reset all filters"
        >
          <span>Reset Filters</span>
          <FilterX size={18} />
        </button>
      </div>



      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => setSelectAll(e.target.checked)}
                  className="mr-2"
                />
                Select
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Aadhar No</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">WhatsApp No</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Designation</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Mandal</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Village</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Booth</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">
                <div className="flex items-center">
                  <span>Actions</span>
                  <button
                    onClick={openBulkMessageModal}
                    className="ml-2 p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                    title="Send WhatsApp message to all filtered members"
                  >
                    <WhatsAppIcon size={16} />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>

            {members?.map((member) => {
              const hasWhatsApp = !!member.whatsappNo;
              const isSelected = selectedMembers.includes(member._id);

              return (
                <tr key={member._id} className={`border-b hover:bg-gray-50 ${member.isActive === false ? 'bg-gray-100' : ''}`}>
                  <td className="py-3 px-4 text-sm">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMemberSelection(member._id, hasWhatsApp)}
                      disabled={!hasWhatsApp}
                      className={`mr-2 ${!hasWhatsApp ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {isSelected && hasWhatsApp && <Check className="inline text-green-600" size={16} />}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {editingId === member._id ? (
                      <input
                        name="aadharNo"
                        value={editForm.aadharNo || ""}
                        onChange={handleInputChange}
                        className="p-1 border rounded w-full"
                      />
                    ) : (
                      getMaskedAadhar(member.aadharNo) || "-"
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
                    {member.address?.mandal || "-"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {member.address?.village || "-"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {member.address?.booth || "-"}
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
                              {member.isActive === false ? (
                                <button
                                  onClick={() => reactivateMember(member._id)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Reactivate member"
                                >
                                  Reactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDelete(member._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash size={16} />
                                </button>
                              )}
                            </>
                          )}
                          {hasWhatsApp && (
                            <>
                              <button
                                onClick={() => openIndividualMessageModal(member.whatsappNo, member.name)}
                                className="text-green-600 hover:text-green-800"
                                title="Send WhatsApp message"
                              >
                                <WhatsAppIcon size={16} />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {members.length === 0 && (
        <div className="text-center py-4 text-gray-500">No members found</div>
      )}

      {/* Message Modal */}
      {messageModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {messageModal.phoneNumbers.length > 1
                ? `Send WhatsApp Message to ${messageModal.phoneNumbers.length} recipients`
                : `Send WhatsApp Message to ${messageModal.phoneNumbers[0]?.name || 'recipient'}`}
            </h3>

            {messageModal.error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {messageModal.error}
              </div>
            )}

            {messageModal.success && (
              <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                Messages sent successfully!
              </div>
            )}

            <textarea
              value={messageModal.message}
              onChange={handleMessageChange}
              className="w-full p-3 border border-gray-300 rounded mb-4"
              rows={5}
              placeholder="Type your message here..."
              disabled={messageModal.sending}
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeMessageModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={messageModal.sending}
              >
                Cancel
              </button>
              <button
                onClick={sendWhatsAppMessages}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                disabled={messageModal.sending}
              >
                {messageModal.sending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  `Send ${messageModal.phoneNumbers.length > 1 ? `(${messageModal.phoneNumbers.length})` : ''}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyYouthTable;