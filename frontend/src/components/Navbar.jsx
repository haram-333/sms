import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, GraduationCap } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-gray-900">
          <GraduationCap className="w-6 h-6" />
          <span>SMS Admin</span>
        </Link>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">Hello, {user.username}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
