// src/components/common/Layout.jsx
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          {currentUser && (
            <div className="mt-2">
              <span className="font-semibold">Logged in as:</span> {currentUser.name} ({currentUser.role})
            </div>
          )}
        </div>
        {currentUser && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </header>
      
      {currentUser && <Navbar />}
      
      <main className="flex-grow p-4">
        {children}
      </main>
      
      <footer className="bg-gray-200 p-4 text-center">
        © {new Date().getFullYear()} Admin Dashboard
      </footer>
    </div>
  );
};

export default Layout;