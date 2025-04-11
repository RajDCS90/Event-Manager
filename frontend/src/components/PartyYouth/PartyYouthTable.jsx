// src/components/PartyYouth/PartyYouthTable.jsx
import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Filter from '../common/Filter';
import Table from '../common/Table';

const PartyYouthTable = () => {
  const { partyYouth, currentUser, updatePartyYouth, deletePartyYouth } = useContext(AppContext);
  const [filteredPartyYouth, setFilteredPartyYouth] = useState(partyYouth);

  const columns = [
    { header: 'Member ID', accessor: 'memberId' },
    { header: 'Aadhar No', accessor: 'aadharNo' },
    { header: 'Name', accessor: 'name' },
    { header: 'WhatsApp No', accessor: 'whatsappNo' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Mandal/Panchayat', accessor: 'mandalPanchayat' },
  ];

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
        columns={columns.map(col => ({ value: col.accessor, label: col.header }))}
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