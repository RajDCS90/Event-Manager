// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Menu, X, LogOut, ChevronDown } from "lucide-react";
// import MobileMenu from "./MobileMenu";
// import DesktopMenu from "./DesktopMenu";
// import LoadingIndicator from "./LoadingIndicator";

// const Navbar = () => {
//   const { currentUser, activeTab, handleTabChange, isLoading, logout } =
//     useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [showLoading, setShowLoading] = useState(false);
//   const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
//   const menuRef = useRef(null);
//   const menuButtonRef = useRef(null);
//   const desktopMenuRef = useRef(null);
//   const desktopMenuButtonRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const toggleMenu = (e) => {
//     e.stopPropagation(); // Prevent the click from bubbling to document
//     if (isMenuOpen) {
//       setIsTransitioning(true);
//       setTimeout(() => {
//         setIsMenuOpen(false);
//         setIsTransitioning(false);
//       }, 300);
//     } else {
//       setIsMenuOpen(true);
//     }
//   };

//   const toggleDesktopMenu = (e) => {
//     e.stopPropagation();
//     setIsDesktopMenuOpen(!isDesktopMenuOpen);
//   };

//   const handleTabClick = (tab) => {
//     if (tab === activeTab && location.pathname.startsWith("/dashboard")) {
//       toggleMenu({ stopPropagation: () => {} });
//       setIsDesktopMenuOpen(false);
//       return;
//     }

//     // Show loading indicator
//     setShowLoading(true);

//     // Change tab and close menus
//     handleTabChange(tab);

//     // Navigate to the appropriate dashboard route
//     let targetRoute = "/dashboard/";
//     switch (tab) {
//       case "":
//         targetRoute += "home";
//         break;
//       case "events":
//         targetRoute += "events";
//         break;
//       case "grievance":
//         targetRoute += "grievances";
//         break;
//       case "partyYouth":
//         targetRoute += "party-youth";
//         break;
//       case "userManagement":
//         targetRoute += "users";
//         break;
//       default:
//         targetRoute += "home";
//     }

//     navigate(targetRoute);

//     // Hide loading indicator after a delay
//     setTimeout(() => {
//       setShowLoading(false);
//       toggleMenu({ stopPropagation: () => {} });
//       setIsDesktopMenuOpen(false);
//     }, 500);
//   };

//   const handleLogout = (e) => {
//     e.stopPropagation();
//     setShowLoading(true);
//     setTimeout(() => {
//       logout();
//       navigate("/");
//     }, 500);
//   };

//   // Close menus when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       // Handle mobile menu
//       if (
//         isMenuOpen &&
//         menuRef.current &&
//         !menuRef.current.contains(e.target) &&
//         menuButtonRef.current &&
//         !menuButtonRef.current.contains(e.target)
//       ) {
//         toggleMenu({ stopPropagation: () => {} });
//       }

//       // Handle desktop menu
//       if (
//         isDesktopMenuOpen &&
//         desktopMenuRef.current &&
//         !desktopMenuRef.current.contains(e.target) &&
//         desktopMenuButtonRef.current &&
//         !desktopMenuButtonRef.current.contains(e.target)
//       ) {
//         setIsDesktopMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isMenuOpen, isDesktopMenuOpen]);

//   return (
//     <>
//       {/* Main Header */}
//       <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <Link
//               to="/dashboard/home"
//               className="hover:text-blue-200 transition "
//             >
//               <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
//                 Prakash Chandra Sethi
//                 <span className="text-xs ml-1 text-gray-300 ">
//                   (MLA Cuttack Sadar)
//                 </span>
//               </h1>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-4">
//               {/* Dashboard Link (moved from menu) */}
//               <Link
//                 to="/dashboard/home"
//                 onClick={() => handleTabChange("")}
//                 className={`px-4 py-2 ${
//                   location.pathname.includes("/dashboard/home")
//                     ? "bg-blue-800"
//                     : "bg-blue-700 hover:bg-blue-800"
//                 } rounded-md text-white font-medium transition-colors`}
//               >
//                 Dashboard
//               </Link>

//               {/* Social Media Link */}
//               <Link
//                 to="/social-media"
//                 className={`px-4 py-2 ${
//                   location.pathname.includes("/social-media")
//                     ? "bg-blue-800"
//                     : "bg-blue-700 hover:bg-blue-800"
//                 } rounded-md text-white font-medium transition-colors`}
//               >
//                 Social Media
//               </Link>

//               {/* Desktop Menu Button */}
//               <div className="relative flex justify-center items-center">
//                 <button
//                   ref={desktopMenuButtonRef}
//                   onClick={toggleDesktopMenu}
//                   className="flex items-center space-x-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-md text-white font-medium transition-colors"
//                 >
//                   <Menu size={18} />
//                   <span>Menu</span>
//                   <ChevronDown
//                     size={16}
//                     className={`transform transition-transform ${
//                       isDesktopMenuOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>

//                 {/* Desktop Dropdown Menu */}
//                 {isDesktopMenuOpen && (
//                   <DesktopMenu
//                     menuRef={desktopMenuRef}
//                     currentUser={currentUser}
//                     activeTab={activeTab}
//                     handleTabClick={handleTabClick}
//                   />
//                 )}
//               </div>

//               {/* Desktop Welcome Text */}
//               {currentUser && (
//                 <div className="px-3 py-2 border-l border-blue-500 text-blue-100">
//                   Welcome, {currentUser.username}
//                 </div>
//               )}

//               {/* Desktop Logout Button */}
//               {currentUser && (
//                 <button
//                   className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
//                   onClick={handleLogout}
//                 >
//                   <LogOut size={16} />
//                   <span>Logout</span>
//                 </button>
//               )}
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="md:hidden flex items-center space-x-2">
//               {/* Mobile Dashboard Link */}
//               <Link
//                 to="/dashboard/home"
//                 onClick={() => handleTabChange("")}
//                 className={`px-3 py-1 ${
//                   location.pathname.includes("/dashboard/home")
//                     ? "bg-blue-800"
//                     : "bg-blue-700 hover:bg-blue-800"
//                 } rounded-md text-white text-sm transition-colors`}
//               >
//                 Dashboard
//               </Link>

//               {/* Mobile Social Media Link */}
//               <Link
//                 to="/social-media"
//                 className={`px-3 py-1 ${
//                   location.pathname.includes("/social-media")
//                     ? "bg-blue-800"
//                     : "bg-blue-700 hover:bg-blue-800"
//                 } rounded-md text-white text-sm transition-colors`}
//               >
//                 Social Media
//               </Link>

//               <button
//                 ref={menuButtonRef}
//                 onClick={toggleMenu}
//                 className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none transition-colors"
//                 aria-label="Main menu"
//               >
//                 {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Menu */}
//       {(isMenuOpen || isTransitioning) && (
//         <MobileMenu
//           isMenuOpen={isMenuOpen}
//           isTransitioning={isTransitioning}
//           menuRef={menuRef}
//           currentUser={currentUser}
//           activeTab={activeTab}
//           handleTabClick={handleTabClick}
//           handleLogout={handleLogout}
//         />
//       )}

//       {/* Loading Indicator */}
//       {(isLoading || showLoading) && <LoadingIndicator />}
//     </>
//   );
// };

// export default Navbar;

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ChevronDown, Home, Share2 } from "lucide-react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import LoadingIndicator from "./LoadingIndicator";

const Navbar = () => {
  const { currentUser, activeTab, handleTabChange, isLoading, logout } =
    useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const desktopMenuRef = useRef(null);
  const desktopMenuButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent the click from bubbling to document
    if (isMenuOpen) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsTransitioning(false);
      }, 300);
    } else {
      setIsMenuOpen(true);
    }
  };

  const toggleDesktopMenu = (e) => {
    e.stopPropagation();
    setIsDesktopMenuOpen(!isDesktopMenuOpen);
  };

  const handleTabClick = (tab) => {
    if (tab === activeTab && location.pathname.startsWith("/dashboard")) {
      toggleMenu({ stopPropagation: () => {} });
      setIsDesktopMenuOpen(false);
      return;
    }

    // Show loading indicator
    setShowLoading(true);

    // Change tab and close menus
    handleTabChange(tab);

    // Navigate to the appropriate dashboard route
    let targetRoute = "/dashboard/";
    switch (tab) {
      case "":
        targetRoute += "home";
        break;
      case "events":
        targetRoute += "events";
        break;
      case "grievance":
        targetRoute += "grievances";
        break;
      case "partyYouth":
        targetRoute += "party-youth";
        break;
      case "userManagement":
        targetRoute += "users";
        break;
      default:
        targetRoute += "home";
    }

    navigate(targetRoute);

    // Hide loading indicator after a delay
    setTimeout(() => {
      setShowLoading(false);
      toggleMenu({ stopPropagation: () => {} });
      setIsDesktopMenuOpen(false);
    }, 500);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    setShowLoading(true);
    setTimeout(() => {
      logout();
      navigate("/");
    }, 500);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Handle mobile menu
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        toggleMenu({ stopPropagation: () => {} });
      }

      // Handle desktop menu
      if (
        isDesktopMenuOpen &&
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(e.target) &&
        desktopMenuButtonRef.current &&
        !desktopMenuButtonRef.current.contains(e.target)
      ) {
        setIsDesktopMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, isDesktopMenuOpen]);

  return (
    <>
      {/* Main Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/dashboard/home"
              className="hover:text-blue-200 transition "
            >
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                Prakash Chandra Sethi
                <span className="text-xs ml-1 text-gray-300 ">
                  (MLA Cuttack Sadar)
                </span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Dashboard Link (moved from menu) */}
              <Link
                to="/dashboard/home"
                onClick={() => handleTabChange("")}
                className={`px-4 py-2 ${
                  location.pathname.includes("/dashboard/home")
                    ? "bg-blue-800"
                    : "bg-blue-700 hover:bg-blue-800"
                } rounded-md text-white font-medium transition-colors`}
              >
                Dashboard
              </Link>

              {/* Social Media Link */}
              <Link
                to="/social-media"
                className={`px-4 py-2 ${
                  location.pathname.includes("/social-media")
                    ? "bg-blue-800"
                    : "bg-blue-700 hover:bg-blue-800"
                } rounded-md text-white font-medium transition-colors`}
              >
                Social Media
              </Link>

              {/* Desktop Menu Button */}
              <div className="relative flex justify-center items-center">
                <button
                  ref={desktopMenuButtonRef}
                  onClick={toggleDesktopMenu}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-md text-white font-medium transition-colors"
                >
                  <Menu size={18} />
                  <span>Menu</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${
                      isDesktopMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Desktop Dropdown Menu */}
                {isDesktopMenuOpen && (
                  <DesktopMenu
                    menuRef={desktopMenuRef}
                    currentUser={currentUser}
                    activeTab={activeTab}
                    handleTabClick={handleTabClick}
                  />
                )}
              </div>

              {/* Desktop Welcome Text */}
              {currentUser && (
                <div className="px-3 py-2 border-l border-blue-500 text-blue-100">
                  Welcome, {currentUser.username}
                </div>
              )}

              {/* Desktop Logout Button */}
              {currentUser && (
                <button
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button - UPDATED: Removed dashboard/social media links */}
            <div className="md:hidden">
              <button
                ref={menuButtonRef}
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none transition-colors"
                aria-label="Main menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Now we need to customize MobileMenu component */}
      {(isMenuOpen || isTransitioning) && (
        <CustomMobileMenu
          isMenuOpen={isMenuOpen}
          isTransitioning={isTransitioning}
          menuRef={menuRef}
          currentUser={currentUser}
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          handleLogout={handleLogout}
          location={location}
          navigate={navigate}
          handleTabChange={handleTabChange}
          toggleMenu={toggleMenu}  // Add this line
        />
      )}

      {/* Loading Indicator */}
      {(isLoading || showLoading) && <LoadingIndicator />}
    </>
  );
};

// CustomMobileMenu component - Adding Dashboard and Social Media links inside the menu
const CustomMobileMenu = ({
  isMenuOpen,
  isTransitioning,
  menuRef,
  currentUser,
  activeTab,
  handleTabClick,
  handleLogout,
  location,
  navigate,
  handleTabChange,
  toggleMenu  
}) => {
  return (
    <div
      ref={menuRef}
      className={`fixed top-0 right-0 md:hidden w-64 h-full bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      } ${isTransitioning ? "opacity-100" : ""}`}
    >
      {/* Menu Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Menu</span>
          <button
            className="rounded-md text-blue-200 hover:text-white focus:outline-none transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Change from handleLogout to a function that closes the menu
              toggleMenu({ stopPropagation: () => {} });
            }}
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* User Info */}
      {currentUser && (
        <div className="bg-blue-50 p-4 border-b border-gray-200">
          <p className="font-medium text-blue-800">
            Welcome, {currentUser.username}
          </p>
        </div>
      )}

      {/* Main Navigation Links - Added Dashboard and Social Media */}
      <nav className="mt-2">
        <div className="px-2">
          {/* Dashboard - Added inside menu */}
          <Link
            to="/dashboard/home"
            onClick={() => {
              handleTabChange("");
              handleTabClick("");
            }}
            className={`flex items-center px-3 py-3 mb-1 rounded-md ${
              location.pathname.includes("/dashboard/home")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Home size={20} className="mr-3" />
            <span className="font-medium">Dashboard</span>
          </Link>

          {/* Social Media - Added inside menu */}
          <Link
            to="/social-media"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu({ stopPropagation: () => {} });
            }}
            className={`flex items-center mb-1 px-3 py-3 rounded-md ${
              location.pathname.includes("/social-media")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Share2 size={20} className="mr-3" />
            <span className="font-medium">Social Media</span>
          </Link>

          {/* Events */}
          <button
            onClick={() => handleTabClick("events")}
            className={`flex items-center w-full text-left px-3 py-3 mb-1 rounded-md ${
              activeTab === "events"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="font-medium">Events</span>
          </button>

          {/* Grievances */}
          <button
            onClick={() => handleTabClick("grievance")}
            className={`flex items-center w-full text-left px-3 py-3 mb-1 rounded-md ${
              activeTab === "grievance"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="font-medium">Grievances</span>
          </button>

          {/* Party Youth */}
          <button
            onClick={() => handleTabClick("partyYouth")}
            className={`flex items-center w-full text-left px-3 py-3 mb-1 rounded-md ${
              activeTab === "partyYouth"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="font-medium">Party Youth</span>
          </button>

          {/* User Management */}
          <button
            onClick={() => handleTabClick("userManagement")}
            className={`flex items-center w-full text-left px-3 py-3 mb-1 rounded-md ${
              activeTab === "userManagement"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="font-medium">User Management</span>
          </button>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white font-medium transition-colors duration-200"
        >
          <LogOut size={18} className="mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
