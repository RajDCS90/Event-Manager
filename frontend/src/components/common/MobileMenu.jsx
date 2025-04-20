import { LogOut } from "lucide-react";

const MobileMenu = ({
  isMenuOpen,
  isTransitioning,
  menuRef,
  currentUser,
  activeTab,
  handleTabClick,
  handleLogout,
}) => {
  return (
    <div
      ref={menuRef}
      className={`md:hidden fixed inset-x-0 top-16 z-30 bg-white shadow-lg transition-all duration-300 transform ${
        isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="px-2 pt-2 pb-3 space-y-1">
        {/* Events - Only show if user has access */}
        {currentUser?.assignedTables?.includes("event") && (
          <button
            onClick={() => handleTabClick("events")}
            className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              activeTab === "events"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Events
          </button>
        )}

        {/* Grievances - Only show if user has access */}
        {currentUser?.assignedTables?.includes("grievances") && (
          <button
            onClick={() => handleTabClick("grievance")}
            className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              activeTab === "grievance"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Grievances
          </button>
        )}

        {/* Party Youth - Only show if user has access */}
        {currentUser?.assignedTables?.includes("party") && (
          <button
            onClick={() => handleTabClick("partyYouth")}
            className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              activeTab === "partyYouth"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Party Youth
          </button>
        )}

        {/* User Management - Only show for admins */}
        {currentUser?.role === "admin" && (
          <button
            onClick={() => handleTabClick("userManagement")}
            className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              activeTab === "userManagement"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            User Management
          </button>
        )}

        {/* Separator and User Info */}
        <div className="border-t border-gray-200 my-2 pt-2">
          {currentUser && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Signed in as {currentUser.username}
            </div>
          )}

          {/* Mobile Logout Button */}
          {currentUser && (
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;