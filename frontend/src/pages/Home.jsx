import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { users } = useAuth()
  const navigate = useNavigate();

  const handleUserSelect = (userId) => {
    // switchUser(userId);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Welcome to Admin Dashboard</h1>
      <p className="text-center mb-8">Select a user to continue:</p>
      
      <div className="space-y-4">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => handleUserSelect(user.id)}
            className={`w-full p-3 rounded-md text-white ${user.role === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {user.name} ({user.role})
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;