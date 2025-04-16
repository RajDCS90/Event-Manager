const DesktopMenu = ({ menuRef, currentUser, activeTab, handleTabClick }) => {
  return (
    <div 
      ref={menuRef}
      className="absolute right-0 mt-48 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-scale-in origin-top-right"
      style={{ animationDuration: '150ms' }}
    >
      {currentUser?.assignedTables?.includes('event') && (
        <button
          className={`block w-full text-left px-4 py-2 text-sm ${
            activeTab === 'events' 
              ? 'bg-blue-100 text-blue-800 font-medium' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => handleTabClick('events')}
        >
          Events
        </button>
      )}
      
      {currentUser?.assignedTables?.includes('grievances') && (
        <button
          className={`block w-full text-left px-4 py-2 text-sm ${
            activeTab === 'grievance' 
              ? 'bg-blue-100 text-blue-800 font-medium' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => handleTabClick('grievance')}
        >
          Grievances
        </button>
      )}
      
      {currentUser?.assignedTables?.includes('party') && (
        <button
          className={`block w-full text-left px-4 py-2 text-sm ${
            activeTab === 'partyYouth' 
              ? 'bg-blue-100 text-blue-800 font-medium' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => handleTabClick('partyYouth')}
        >
          Party Youth
        </button>
      )}
      
      {currentUser?.role === 'admin' && (
        <button
          className={`block w-full text-left px-4 py-2 text-sm ${
            activeTab === 'userManagement' 
              ? 'bg-blue-100 text-blue-800 font-medium' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => handleTabClick('userManagement')}
        >
          User Management
        </button>
      )}
    </div>
  );
};

export default DesktopMenu;