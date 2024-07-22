import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, isAuthenticated } from '../services/auth';

const Header = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">MyJournal</Link>
          <div className="space-x-4">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            {authenticated ? (
              <>
                <Link to="/blogs" className="hover:text-blue-200">Blogs</Link>
                <Link to="/songs" className="hover:text-blue-200">Songs</Link>
                <Link to="/mvs" className="hover:text-blue-200">MVs</Link>
                <Link to="/movies" className="hover:text-blue-200">Movies</Link>
                <Link to="/recipes" className="hover:text-blue-200">Recipes</Link>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/signup" className="hover:text-blue-200">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
