// src/components/common/Navbar.jsx
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, activeTab, setActiveTab } = useContext(AppContext);

  const tabs = [
    { id: 'events', label: 'Event Table' },
    { id: 'grievances', label: 'Grievance Table' },
    { id: 'partyYouth', label: 'Party & Youth Affair' },
    ...(currentUser.role === 'admin' ? [{ id: 'userManagement', label: 'User Management' }] : [])
  ];

  // Only show tabs that user has access to
  const filteredTabs = tabs.filter(tab => 
    tab.id === 'userManagement' || 
    currentUser.assignedTables.includes(tab.id)
  );

  return (
    <nav className="bg-gray-800 text-white">
      <div className="flex space-x-4 p-2">
        {filteredTabs.map(tab => (
          <NavLink
            key={tab.id}
            to={`/dashboard?tab=${tab.id}`}
            className={`px-4 py-2 rounded-md ${activeTab === tab.id ? 'bg-blue-500' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;