import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";
import Login from "../../pages/Login";

export default function Header({
  isMenuOpen,
  setIsMenuOpen,
  setShowRegisterForm,
}) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const menuCategories = [
    {
      title: "ABOUT MLA",
      id: "about",
      items: ["Biography", "BJP Connect", "People's Corner", "Timeline"],
    },
    {
      title: "EVENTS",
      id: "events",
      items: ["Upcoming Events", "Past Events", "Annual Meets", "Live Webcast"],
    },
    {
      title: "GRIEVANCE",
      id: "grievance",
      items: ["Upcoming Grievance", "Past Grievance"],
    },
    {
      title: "CONNECT",
      id: "connect",
      items: ["Join Us", "Serve The Nation", "Contact Us"],
    },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.getElementById("dropdown-menu");
      const menuButton = document.getElementById("menu-button");

      if (
        isMenuOpen &&
        menu &&
        !menu.contains(event.target) &&
        menuButton &&
        !menuButton.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <>
      <header className="bg-white shadow-md fixed w-full top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                id="menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="mr-4 md:hidden"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center">
                <span className="text-3xl font-light text-indigo-700">MLA</span>
                <span className="text-3xl font-bold text-indigo-900">
                  Sethi
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                id="menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="mr-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-700 transition-colors"
              >
                Mera Saansad
              </Link>
              <button
                onClick={openLoginModal}
                className="text-gray-700 hover:text-indigo-700 transition-colors"
              >
                Login
              </button>
            </div>

            <div className="flex md:hidden items-center space-x-4">
              <button
                onClick={openLoginModal}
                className="text-gray-700 hover:text-indigo-700 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div
          id="dropdown-menu"
          className={`bg-cyan-500 w-full transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {menuCategories.map((category) => (
                <div key={category.id} className="mb-6">
                  <h2 className="text-base font-semibold text-white mb-3 pb-1 border-b border-cyan-400 cursor-pointer">
                    {category.title}
                  </h2>
                  <ul className="space-y-2">
                    {category.items.map((item, index) => {
                      const path = `/${category.id}`;
                      return item === "Join Us" ? (
                        <li key={index}>
                          <button
                            onClick={() => setShowRegisterForm(true)}
                            className="text-left py-1 text-white hover:text-cyan-100 transition-colors text-sm"
                          >
                            {item}
                          </button>
                        </li>
                      ) : (
                        <li key={index}>
                          <Link
                            to={path}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-left py-1 text-white hover:text-cyan-100 transition-colors text-sm"
                          >
                            {item}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Social media icons */}
            <div className="flex gap-4 mt-4 mb-2">
              {[Facebook, Youtube, Instagram, Linkedin, Twitter].map(
                (Icon, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded-2xl shadow-md hover:shadow-lg transition duration-200 hover:scale-105"
                  >
                    <Icon size={24} className="text-blue-600" />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <Login isOpen={isLoginModalOpen} onClose={closeLoginModal} />

      {/* Push content below fixed header */}
      <div className={`h-16 ${isMenuOpen ? "mb-96" : ""}`}></div>
    </>
  );
}
