// src/components/Grievance/GrievanceTable.jsx
import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Filter from '../common/Filter';
import Table from '../common/Table';

const GrievanceTable = () => {
  const { grievances, currentUser, updateGrievance, deleteGrievance } = useContext(AppContext);
  const [filteredGrievances, setFilteredGrievances] = useState(grievances);

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
    const grievanceToUpdate = grievances.find(g => g.id === id);
    updateGrievance({ ...grievanceToUpdate, [field]: value });
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Grievance Records</h2>
      
      <Filter 
        data={grievances} 
        setFilteredData={setFilteredGrievances} 
        columns={columns.map(col => ({ value: col.accessor, label: col.header }))}
      />
      
      <Table
        data={filteredGrievances}
        columns={columns}
        onEdit={currentUser.role === 'admin' || currentUser.role === 'user' ? handleEdit : null}
        onDelete={currentUser.role === 'admin' ? deleteGrievance : null}
      />
    </div>
  );
};

export default GrievanceTable;