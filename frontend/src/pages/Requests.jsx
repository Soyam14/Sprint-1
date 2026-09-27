import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Requests() {
  const { user, token } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/connections', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      toast.error('Failed to load swap requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/connections/${requestId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Request ${status}!`);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to update request status');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-indigo-500" />
          Swap Requests
        </h1>
        <p className="text-xs text-gray-400">
          Manage incoming swap requests and track your outgoing status.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 text-xs py-12">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-12 text-center text-xs text-gray-500 space-y-2">
          <p className="font-semibold text-gray-400">No swap requests yet.</p>
          <p className="text-gray-600">Explore skills and send a request to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((reqItem) => {
            // Determine peer object safely
            const rawRequester = reqItem.requester || reqItem.sender;
            const rawRecipient = reqItem.recipient;

            const requesterId = typeof rawRequester === 'object' ? (rawRequester?._id || rawRequester?.id) : rawRequester;
            const isIncoming = requesterId && currentUserId && requesterId.toString() !== currentUserId.toString();

            const peerObject = isIncoming ? rawRequester : rawRecipient;
            const peerName = typeof peerObject === 'object' ? (peerObject?.name || peerObject?.email || 'User') : 'User';

            // Extract exact partner ID for chat route
            const peerId = typeof peerObject === 'object' ? (peerObject?._id || peerObject?.id) : peerObject;

            const skillTitle = reqItem.skill?.title || reqItem.skillId?.title || 'Skill Swap';

            return (
              <div
                key={reqItem._id}
                className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-700/80 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {reqItem.status === 'pending' && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1 uppercase">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                    {reqItem.status === 'accepted' && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1 uppercase">
                        <CheckCircle2 className="w-3 h-3" /> Accepted
                      </span>
                    )}
                    {reqItem.status === 'declined' && (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1 uppercase">
                        <XCircle className="w-3 h-3" /> Declined
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {isIncoming ? 'Incoming Request' : 'Outgoing Request'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{peerName}</h3>
                  <p className="text-xs text-gray-400">
                    Skill: <span className="text-indigo-400 font-medium">{skillTitle}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {isIncoming && reqItem.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(reqItem._id, 'accepted')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(reqItem._id, 'declined')}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold border border-gray-700 transition cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {reqItem.status === 'accepted' && (
                    <button
                      onClick={() => {
                        if (!peerId) {
                          toast.error('Cannot locate target user ID');
                          return;
                        }
                        navigate(`/chat?user=${peerId}`);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/20"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Open Chat <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}