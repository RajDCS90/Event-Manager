import EventForm from "../Event/EventForm";
import EventTable from "../Event/EventTable";
import GrievanceForm from "../Grievance/GrievanceForm";
import GrievanceTable from "../Grievance/GrievanceTable";
import PartyYouthForm from "../PartyYouth/PartyYouthForm";
import PartyYouthTable from "../PartyYouth/PartyYouthTable";
import UserManagement from "../User/UserManagement";
import { useAuth } from "../../context/AuthContext";
import UpcomingEvents from "../Event/UpcomingEvents";
import UpcomingGrievances from "../Grievance/UpcomingGrievances";
import { useState } from "react";
import { X, Plus } from "lucide-react";

// Modal
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { currentUser, activeTab } = useAuth();
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isGrievanceFormOpen, setIsGrievanceFormOpen] = useState(false);
  const [isPartyYouthFormOpen, setIsPartyYouthFormOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false); // Optional: If you have Add User Modal

  return (
    <div className=" relative">
      {/* EVENTS */}
      {activeTab === "events" &&
        currentUser?.assignedTables?.includes("event") && (
          <>
            <div className="bg-gray-100 p-4 rounded-lg">
              <UpcomingEvents />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <EventTable />
            </div>

            <Modal isOpen={isEventFormOpen} onClose={() => setIsEventFormOpen(false)}>
              <EventForm onClose={() => setIsEventFormOpen(false)} />
            </Modal>
          </>
        )}

      {/* GRIEVANCES */}
      {activeTab === "grievance" &&
        currentUser?.assignedTables?.includes("grievances") && (
          <>
            <div className="bg-gray-100 p-4 rounded-lg">
              <UpcomingGrievances />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <GrievanceTable />
            </div>

            <Modal isOpen={isGrievanceFormOpen} onClose={() => setIsGrievanceFormOpen(false)}>
              <GrievanceForm onClose={() => setIsGrievanceFormOpen(false)} />
            </Modal>
          </>
        )}

      {/* PARTY YOUTH */}
      {activeTab === "partyYouth" &&
        currentUser?.assignedTables?.includes("party") && (
          <>
            <div className="bg-white p-4 rounded-lg shadow">
              <PartyYouthTable />
            </div>

            <Modal isOpen={isPartyYouthFormOpen} onClose={() => setIsPartyYouthFormOpen(false)}>
              <PartyYouthForm onClose={() => setIsPartyYouthFormOpen(false)} />
            </Modal>
          </>
        )}

      {/* USER MANAGEMENT */}
      {activeTab === "userManagement" && currentUser?.role === "admin" && (
        <div className="bg-white p-4 rounded-lg shadow">
          <UserManagement />
        </div>
      )}

      {/* FLOATING BUTTONS */}
      {activeTab === "events" && currentUser?.assignedTables?.includes("event") && (
        <button
          onClick={() => setIsEventFormOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-40"
          title="Add Event"
        >
          <Plus />
        </button>
      )}

      {activeTab === "grievance" && currentUser?.assignedTables?.includes("grievances") && (
        <button
          onClick={() => setIsGrievanceFormOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg z-40"
          title="Add Grievance"
        >
          <Plus />
        </button>
      )}

      {activeTab === "partyYouth" && currentUser?.assignedTables?.includes("party") && (
        <button
          onClick={() => setIsPartyYouthFormOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg z-40"
          title="Add New Member"
        >
          <Plus />
        </button>
      )}

      {activeTab === "userManagement" && currentUser?.role === "admin" && (
        <button
          onClick={() => setIsUserFormOpen(true)}
          className="fixed bottom-6 right-6 bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-full shadow-lg z-40"
          title="Add User"
        >
          <Plus />
        </button>
      )}
    </div>
  );
};

export default Dashboard;
