import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
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
    if (tab === activeTab && location.pathname.startsWith('/dashboard')) {
      toggleMenu({ stopPropagation: () => {} });
      setIsDesktopMenuOpen(false);
      return;
    }

    // Show loading indicator
    setShowLoading(true);

    // Change tab and close menus
    handleTabChange(tab);

    // Navigate to the appropriate dashboard route
    let targetRoute = '/dashboard/';
    switch (tab) {
      case '':
        targetRoute += 'home';
        break;
      case 'events':
        targetRoute += 'events';
        break;
      case 'grievance':
        targetRoute += 'grievances';
        break;
      case 'partyYouth':
        targetRoute += 'party-youth';
        break;
      case 'userManagement':
        targetRoute += 'users';
        break;
      default:
        targetRoute += 'home';
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
            <h1 className="text-xl font-bold tracking-tight">
              <Link to="/dashboard/home" className="hover:text-blue-200 transition">
                <span className="hidden sm:inline">MLA</span> Sethi
              </Link>
            </h1>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Dashboard Link (moved from menu) */}
              <Link
                to="/dashboard/home"
                onClick={() => handleTabChange('')}
                className={`px-4 py-2 ${
                  location.pathname.includes('/dashboard/home')
                    ? 'bg-blue-800'
                    : 'bg-blue-700 hover:bg-blue-800'
                } rounded-md text-white font-medium transition-colors`}
              >
                Dashboard
              </Link>

              {/* Social Media Link */}
              <Link
                to="/social-media"
                className={`px-4 py-2 ${
                  location.pathname.includes('/social-media')
                    ? 'bg-blue-800'
                    : 'bg-blue-700 hover:bg-blue-800'
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

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Dashboard Link */}
              <Link
                to="/dashboard/home"
                onClick={() => handleTabChange('')}
                className={`px-3 py-1 ${
                  location.pathname.includes('/dashboard/home')
                    ? 'bg-blue-800'
                    : 'bg-blue-700 hover:bg-blue-800'
                } rounded-md text-white text-sm transition-colors`}
              >
                Dashboard
              </Link>

              {/* Mobile Social Media Link */}
              <Link
                to="/social-media"
                className={`px-3 py-1 ${
                  location.pathname.includes('/social-media')
                    ? 'bg-blue-800'
                    : 'bg-blue-700 hover:bg-blue-800'
                } rounded-md text-white text-sm transition-colors`}
              >
                Social Media
              </Link>

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

      {/* Mobile Menu */}
      {(isMenuOpen || isTransitioning) && (
        <MobileMenu
          isMenuOpen={isMenuOpen}
          isTransitioning={isTransitioning}
          menuRef={menuRef}
          currentUser={currentUser}
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          handleLogout={handleLogout}
        />
      )}

      {/* Loading Indicator */}
      {(isLoading || showLoading) && <LoadingIndicator />}
    </>
  );
};

export default Navbar;