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
import { useState, useEffect } from "react";
import { X, Plus, Menu } from "lucide-react";
import MandalManagementModal from "../PartyYouth/MandalManagementModal";

// Modal with improved mobile handling
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    // Prevent background scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 md:p-6">
      <div className="relative bg-white rounded-lg w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="sticky top-3 float-right text-gray-500 hover:text-gray-700 p-2 z-10 bg-white/80 rounded-full"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { currentUser, activeTab } = useAuth();
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isGrievanceFormOpen, setIsGrievanceFormOpen] = useState(false);
  const [isPartyYouthFormOpen, setIsPartyYouthFormOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="relative pb-20">
      {/* EVENTS */}
      {activeTab === "events" &&
        currentUser?.assignedTables?.includes("event") && (
          <>
            <div className="bg-gray-100 p-3 md:p-4  rounded-lg mb-4">
              <UpcomingEvents />
            </div>

            <div className="bg-white p-3 md:p-4 rounded-lg shadow overflow-x-auto">
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
            <div className="bg-gray-100 p-3 md:p-4 rounded-lg mb-4">
              <UpcomingGrievances />
            </div>

            <div className="bg-white p-3 md:p-4 rounded-lg shadow overflow-x-auto">
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
            <div className="bg-white p-3 md:p-4 rounded-lg shadow overflow-x-auto">
              <PartyYouthTable />
            </div>

            <Modal isOpen={isPartyYouthFormOpen} onClose={() => setIsPartyYouthFormOpen(false)}>
              <PartyYouthForm onClose={() => setIsPartyYouthFormOpen(false)} />
            </Modal>
          </>
        )}

      {/* USER MANAGEMENT */}
      {activeTab === "userManagement" && currentUser?.role === "admin" && (
        <div className="bg-white p-3 md:p-4 rounded-lg shadow overflow-x-auto">
          <UserManagement />
        </div>
      )}

      {activeTab === "mandalManagement" && currentUser?.role === "admin" && (
        <div className="bg-white p-3 md:p-4 rounded-lg shadow overflow-x-auto">
          <MandalManagementModal />
        </div>
      )}


      {/* FLOATING BUTTONS - positioned differently for mobile */}
      {activeTab === "events" && currentUser?.assignedTables?.includes("event") && (
        <button
          onClick={() => setIsEventFormOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-40 flex items-center justify-center"
          title="Add Event"
          aria-label="Add Event"
        >
          <Plus size={isMobile ? 20 : 24} />
        </button>
      )}

      {activeTab === "grievance" && currentUser?.assignedTables?.includes("grievances") && (
        <button
          onClick={() => setIsGrievanceFormOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg z-40 flex items-center justify-center"
          title="Add Grievance"
          aria-label="Add Grievance"
        >
          <Plus size={isMobile ? 20 : 24} />
        </button>
      )}

      {activeTab === "partyYouth" && currentUser?.assignedTables?.includes("party") && (
        <button
          onClick={() => setIsPartyYouthFormOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg z-40 flex items-center justify-center"
          title="Add New Member"
          aria-label="Add New Member"
        >
          <Plus size={isMobile ? 20 : 24} />
        </button>
      )}

      {activeTab === "userManagement" && currentUser?.role === "admin" && (
        <button
          onClick={() => setIsUserFormOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-full shadow-lg z-40 flex items-center justify-center"
          title="Add User"
          aria-label="Add User"
        >
          <Plus size={isMobile ? 20 : 24} />
        </button>
      )}
    </div>
  );
};

export default Dashboard;