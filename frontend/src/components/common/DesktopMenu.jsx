const DesktopMenu = ({ menuRef, currentUser, activeTab, handleTabClick }) => {
  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
    >
      <div className="py-1">
        {/* Events - Only show if user has access */}
        {currentUser?.assignedTables?.includes('event') && (
          <button
            className={`w-full text-left block px-4 py-2 text-sm ${
              activeTab === 'events' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleTabClick('events')}
          >
            Events
          </button>
        )}
        
        {/* Grievances - Only show if user has access */}
        {currentUser?.assignedTables?.includes('grievances') && (
          <button
            className={`w-full text-left block px-4 py-2 text-sm ${
              activeTab === 'grievance' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleTabClick('grievance')}
          >
            Grievances
          </button>
        )}
        
        {/* Party Youth - Only show if user has access */}
        {currentUser?.assignedTables?.includes('party') && (
          <button
            className={`w-full text-left block px-4 py-2 text-sm ${
              activeTab === 'partyYouth' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleTabClick('partyYouth')}
          >
            Party Youth
          </button>
        )}
        
        {/* User Management - Only show for admins */}
        {currentUser?.role === 'admin' && (
          <button
            className={`w-full text-left block px-4 py-2 text-sm ${
              activeTab === 'userManagement' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleTabClick('userManagement')}
          >
            User Management
          </button>
        )}
        {currentUser?.role === 'admin' && (
          <button
            className={`w-full text-left block px-4 py-2 text-sm ${
              activeTab === 'mandalManagement' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleTabClick('mandalManagement')}
          >
            Mandal Management
          </button>
        )}
      </div>
    </div>
  );
};

export default DesktopMenu;