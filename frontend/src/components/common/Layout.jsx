import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { isLoading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar with integrated header, navigation and logout */}
      <Navbar />
      
      {/* Main content with better spacing */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Content container with fade animation */}
        <div 
          className={`bg-white rounded-lg shadow-sm p-6 ${
            isLoading ? 'opacity-50' : 'opacity-100 transition-opacity duration-300'
          }`}
        >
          {children}
        </div>
      </main>
      
      {/* Footer with improved styling */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <div className="flex items-center justify-center space-x-4">
            <span>© {new Date().getFullYear()} MLA Sethi</span>
            <span className="hidden md:inline">•</span>
            <a href="#" className="hidden md:inline hover:text-blue-600 transition-colors">Privacy Policy</a>
            <span className="hidden md:inline">•</span>
            <a href="#" className="hidden md:inline hover:text-blue-600 transition-colors">Terms of Service</a>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Version 1.0.0
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;