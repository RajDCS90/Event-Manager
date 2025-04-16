import { LogOut } from 'lucide-react';

const MobileMenu = ({ 
  isMenuOpen, 
  isTransitioning, 
  menuRef, 
  currentUser, 
  activeTab, 
  handleTabClick, 
  handleLogout 
}) => {
  return (
    <div 
      className={`mobile-menu-container fixed inset-0 z-50 md:hidden ${
        isMenuOpen ? 'animate-fade-in' : 'animate-fade-out'
      }`}
      style={{
        animationDuration: '300ms',
        animationFillMode: 'forwards',
        pointerEvents: isTransitioning ? 'none' : 'auto'
      }}
    >
      <div 
        ref={menuRef}
        className={`absolute top-16 left-0 right-0 bg-blue-800 shadow-lg transform ${
          isMenuOpen ? 'animate-slide-down' : 'animate-slide-up'
        }`}
        style={{
          animationDuration: '300ms',
          animationFillMode: 'forwards'
        }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Mobile User Info */}
          {currentUser && (
            <div className="px-3 py-2 text-blue-100 border-b border-blue-700 mb-2">
              Welcome, {currentUser.username} ({currentUser.role})
            </div>
          )}
          
          {currentUser?.assignedTables?.includes('event') && (
            <button
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'events' 
                  ? 'bg-blue-900 text-white' 
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`}
              onClick={() => handleTabClick('events')}
            >
              Events
            </button>
          )}
          
          {currentUser?.assignedTables?.includes('grievances') && (
            <button
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'grievance' 
                  ? 'bg-blue-900 text-white' 
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`}
              onClick={() => handleTabClick('grievance')}
            >
              Grievances
            </button>
          )}
          
          {currentUser?.assignedTables?.includes('party') && (
            <button
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'partyYouth' 
                  ? 'bg-blue-900 text-white' 
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`}
              onClick={() => handleTabClick('partyYouth')}
            >
              Party Youth
            </button>
          )}
          
          {currentUser?.role === 'admin' && (
            <button
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'userManagement' 
                  ? 'bg-blue-900 text-white' 
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`}
              onClick={() => handleTabClick('userManagement')}
            >
              User Management
            </button>
          )}
          
          {/* Mobile Logout Button */}
          {currentUser && (
            <button
              className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-500 hover:bg-red-600 text-white transition-colors mt-2"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;