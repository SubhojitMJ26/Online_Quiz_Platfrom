import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null; // Don't show navbar on login/register

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>Quiz Platform</div>
      <div className="flex items-center gap-4">
        <span>Welcome, {user.name}!</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}