// src/components/common/Layout.jsx
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { currentUser } = useContext(AppContext);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        {currentUser && (
          <div className="mt-2">
            <span className="font-semibold">Logged in as:</span> {currentUser.name} ({currentUser.role})
          </div>
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