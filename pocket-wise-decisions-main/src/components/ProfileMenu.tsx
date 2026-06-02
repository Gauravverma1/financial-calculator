import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('username');
    setUsername(user || '');
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setOpen(false);
    navigate('/login');
  };

  if (!username) return null;

  return (
    <div className="fixed top-6 right-8 z-50 flex items-center gap-3">
      <ThemeToggle />
      
      <div className="relative">
        <button
          className="rounded-full bg-indigo-50 dark:bg-slate-800 p-2.5 hover:bg-indigo-100 dark:hover:bg-slate-700 focus:outline-none transition-colors duration-200"
          onClick={() => setOpen((v) => !v)}
          title="Profile"
        >
          <span role="img" aria-label="user" className="text-xl block">👤</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 animate-fade-in">
            <div className="mb-1 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Signed in as</div>
            <div className="mb-4 text-primary dark:text-indigo-400 font-bold truncate">{username}</div>
            <button
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMenu; 