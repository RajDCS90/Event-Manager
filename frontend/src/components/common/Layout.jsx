import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { isLoading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar with integrated header, navigation and logout */}
      <Navbar />
      
      {/* Main content with reduced padding on mobile */}
      <main className="flex-grow w-full mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 max-w-7xl">
        {/* Content container with less padding on mobile */}
        <div 
          className={`bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 ${
            isLoading ? 'opacity-50' : 'opacity-100 transition-opacity duration-300'
          }`}
        >
          {children}
        </div>
      </main>
      
      {/* Footer with improved styling and mobile-friendly padding */}
      <footer className="bg-gray-100 border-t border-gray-200 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 text-center text-gray-600 text-sm">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <span>© {new Date().getFullYear()} MLA Sethi</span>
            <span className="hidden md:inline">•</span>
            <a href="#" className="hidden md:inline hover:text-blue-600 transition-colors">Privacy Policy</a>
            <span className="hidden md:inline">•</span>
            <a href="#" className="hidden md:inline hover:text-blue-600 transition-colors">Terms of Service</a>
          </div>
          <div className="mt-1 sm:mt-2 text-xs text-gray-400">
            Version 1.0.0
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;