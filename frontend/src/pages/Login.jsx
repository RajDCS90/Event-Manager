import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const Login = ({ isOpen, onClose }) => {
  const { login, error: authError, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ username: '', password: '' });
      setLocalError('');
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (localError || authError) {
      setLocalError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.username.trim() || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(formData);
      onClose(); // Close modal on successful login
    } catch (err) {
      console.log(err)
    }
  };

  // Handle clicking outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsAnimating(false);
      setTimeout(() => onClose(), 300); // Match this with the transition duration
    }
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-center"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-gray-200 rounded-xl shadow-xl w-full max-w-md ${
          isAnimating ? 'animate-scale-in' : 'animate-scale-out'
        }`}
        style={{ 
          maxHeight: '90vh', 
          overflowY: 'auto',
          animationDuration: '0.3s',
          animationFillMode: 'forwards'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold text-black-900">Login</h2>
          <button 
            onClick={() => {
              setIsAnimating(false);
              setTimeout(() => onClose(), 300);
            }}
            className="text-orange-600 hover:text-gray-700 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Form */}
        <div className="p-6">
          {(localError || authError) && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {localError || authError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                disabled={authLoading}
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                disabled={authLoading}
                placeholder="Enter your password"
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={authLoading}
                className={`w-full px-4 py-3 rounded-lg text-white font-medium ${
                  authLoading 
                    ? 'bg-orange-500 cursor-not-allowed' 
                    : 'bg-orange-600 hover:bg-orange-700'
                } transition-colors shadow-md`}
              >
                {authLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;