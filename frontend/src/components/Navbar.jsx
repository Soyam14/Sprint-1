import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LucideBell, LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const { user, token, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Navbar notification fetch error:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener('notificationsUpdated', handleUpdate);
    return () => {
      window.removeEventListener('notificationsUpdated', handleUpdate);
    };
  }, [token]);

  const handleLogout = () => {
    logout();
    setNotifications([]);
    navigate('/');
  };

  const unreadCount = notifications.filter(n => n.isRead === false || n.read === false).length;

  return (
    <nav className="flex items-center justify-between border-b border-gray-800 bg-[#0d0f17] px-8 py-4 text-white">
      <Link to="/" className="flex items-center gap-2 text-xl font-extrabold">
        <span className="rounded-lg bg-indigo-600 px-2 py-1 text-sm">SB</span>
        SkillBridge
      </Link>

      <div className="flex items-center space-x-6 text-sm font-medium text-gray-300">
        <Link to="/explore" className="hover:text-white transition">Explore</Link>
        <Link to="/about" className="hover:text-white transition">About</Link>
        <Link to="/contact" className="hover:text-white transition">Contact</Link>

        {token && (
          <>
            <Link to="/requests" className="hover:text-white transition">Requests</Link>
            <Link to="/chat" className="hover:text-white transition">Chat</Link>

            {/* Notification Bell with Badge */}
            <Link to="/notifications" className="relative p-2 text-gray-300 hover:text-white transition">
              <LucideBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          </>
        )}
      </div>

      <div>
        {token ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}