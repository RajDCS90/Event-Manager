import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { currentUser, activeTab, handleTabChange, isLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const desktopMenuRef = useRef(null);
  const desktopMenuButtonRef = useRef(null);
  const navigate = useNavigate();

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
    if (tab === activeTab) {
      toggleMenu({ stopPropagation: () => {} });
      setIsDesktopMenuOpen(false);
      return;
    }
    
    // Show loading indicator
    setShowLoading(true);
    
    // Change tab and close menus
    handleTabChange(tab);
    
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
      navigate('/');
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isDesktopMenuOpen]);

  return (
    <>
      {/* Main Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="hidden sm:inline">MLA</span> Sethi
            </h1>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Desktop Menu Button */}
              <div className="relative">
                <button
                  ref={desktopMenuButtonRef}
                  onClick={toggleDesktopMenu}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-md text-white font-medium transition-colors"
                >
                  <Menu size={18} />
                  <span>Menu</span>
                  <ChevronDown size={16} className={`transform transition-transform ${isDesktopMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Desktop Dropdown Menu */}
                {isDesktopMenuOpen && (
                  <div 
                    ref={desktopMenuRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-scale-in"
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
                    
                    {currentUser?.assignedTables?.includes('grievance') && (
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
                )}
              </div>
              
              {/* Desktop Welcome Text */}
              {currentUser && (
                <div className="mx-4 px-3 py-2 border-l border-blue-500 text-blue-100">
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
            <div className="md:hidden flex items-center">
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
              
              {currentUser?.assignedTables?.includes('grievance') && (
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
      )}
      
      {/* Loading Indicator */}
      {(isLoading || showLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </>
  );
};

export default Navbar;