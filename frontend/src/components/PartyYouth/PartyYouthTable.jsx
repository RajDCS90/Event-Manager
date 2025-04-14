import { useState } from 'react';
import Filter from '../common/Filter';
import Table from '../common/Table';

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

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Party & Youth Affair Records</h2>
      
      <Filter 
        data={partyYouth} 
        setFilteredData={setFilteredPartyYouth} 
        columns={columns?.map(col => ({ value: col.accessor, label: col.header }))} 
      />
      
      <Table
        data={filteredPartyYouth}
        columns={columns}
        onEdit={currentUser.role === 'admin' || currentUser.role === 'user' ? handleEdit : null}
        onDelete={currentUser.role === 'admin' ? deletePartyYouth : null}
      />
    </div>
  );
};

export default PartyYouthTable;
