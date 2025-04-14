// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import EventForm from '../components/Event/EventForm';
import EventTable from '../components/Event/EventTable';
import GrievanceForm from '../components/Grievance/GrievanceForm';
import GrievanceTable from '../components/Grievance/GrievanceTable';
import PartyYouthForm from '../components/PartyYouth/PartyYouthForm';
import PartyYouthTable from '../components/PartyYouth/PartyYouthTable';
import UserManagement from '../components/User/UserManagement';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser, activeTab } = useAuth();
  
  useEffect(() => {
    console.log("currentUser", currentUser);
  }, [currentUser]);

  return (
    <div className="space-y-6">
      {activeTab === 'events' && currentUser?.assignedTables?.includes('event') && (
        <>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Add New Event</h2>
            <EventForm />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <EventTable />
          </div>
        </>
      )}

      {activeTab === 'grievance' && currentUser?.assignedTables?.includes("grievance") && (
        <>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Add New Grievance</h2>
            <GrievanceForm />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <GrievanceTable />
          </div>
        </>
      )}

      {activeTab === 'partyYouth' && currentUser?.assignedTables?.includes("party") && (
        <>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Add New Member</h2>
            <PartyYouthForm />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <PartyYouthTable />
          </div>
        </>
      )}

      {activeTab === 'userManagement' && currentUser?.role === 'admin' && (
        <div className="bg-white p-4 rounded-lg shadow">
          <UserManagement />
        </div>
      )}
    </div>
  );
};

export default Dashboard;