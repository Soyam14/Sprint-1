import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Bell, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  const markAllAsRead = async () => {
    try {
      await axios.put(
        'http://localhost:5000/api/notifications/read-all',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, read: true }))
      );

      // Trigger custom event so Navbar updates immediately
      window.dispatchEvent(new Event('notificationsUpdated'));
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Bell className="w-7 h-7 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white rounded-xl transition text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400 text-sm">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="p-8 text-center bg-[#0b0c13] border border-gray-800 rounded-2xl text-gray-500 text-sm">
          No notifications found
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isUnread = n.isRead === false || n.read === false;
            return (
              <div
                key={n._id}
                className={`p-4 rounded-xl border transition flex items-center justify-between ${
                  isUnread
                    ? 'bg-[#121422] border-indigo-500/40'
                    : 'bg-[#0f111a] border-gray-800'
                }`}
              >
                <div>
                  <p className="text-sm text-gray-200 font-medium">
                    <span className="font-bold text-indigo-300">
                      {n.sender?.name || 'Someone'}
                    </span>{' '}
                    {n.type === 'NEW_MESSAGE'
                      ? 'sent you a direct message.'
                      : 'sent you a new skill swap request.'}
                  </p>
                  <span className="text-[11px] text-gray-500 block mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>

                {isUnread && (
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full shrink-0"></span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}