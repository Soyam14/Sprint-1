import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Send, User } from 'lucide-react';
import { io } from 'socket.io-client';

let socket;

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const { user, token } = useContext(AuthContext);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fetchConversations = () => {
    if (!token) return;
    axios
      .get('http://localhost:5000/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setConversations(res.data || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!user) return;
    const userId = (user._id || user.id).toString();

    socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    socket.emit('join_room', userId);
    socket.emit('join', userId);

    return () => {
      if (socket) socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (token) fetchConversations();
  }, [token]);

  useEffect(() => {
    if (activePartner && token) {
      axios
        .get(`http://localhost:5000/api/messages/${activePartner._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          setMessages(res.data || []);
          fetchConversations();
        })
        .catch((err) => console.error(err));
    }
  }, [activePartner, token]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      const currentUserId = (user?.id || user?._id)?.toString();
      const senderId = (msg.sender?._id || msg.sender)?.toString();

      if (activePartner && (senderId === activePartner._id?.toString() || senderId === currentUserId)) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchConversations();
    };

    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [activePartner, user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !activePartner) return;

    const userId = user?.id || user?._id;
    const payload = {
      senderId: userId,
      recipientId: activePartner._id,
      text: input
    };

    if (socket) socket.emit('send_message', payload);

    setMessages((prev) => [
      ...prev,
      { ...payload, sender: userId, createdAt: new Date().toISOString() }
    ]);

    setInput('');
    setTimeout(fetchConversations, 300);
  };

  return (
    <div className="max-w-6xl mx-auto my-6 glass-card rounded-2xl h-[78vh] flex overflow-hidden border border-gray-800">
      <div className="w-1/3 border-r border-gray-800/80 flex flex-col bg-gray-950/40">
        <div className="p-4 border-b border-gray-800/80 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Active Messages</h3>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-800/40">
          {conversations.map((p) => {
            const isActive = activePartner?._id === p._id;
            return (
              <div
                key={p._id}
                onClick={() => setActivePartner(p)}
                className={`p-4 cursor-pointer transition flex items-start gap-3 hover:bg-gray-800/30 ${
                  isActive ? 'bg-indigo-600/15 border-l-4 border-indigo-500' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm shrink-0">
                  {p.name ? p.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-white truncate">{p.name}</p>
                    <span className="text-[10px] text-gray-500 shrink-0">{formatTime(p.timestamp)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-400 truncate">{p.lastMessage}</p>
                    {p.unreadCount > 0 && !isActive && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 animate-pulse">
                        {p.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-2/3 flex flex-col bg-gray-900/30">
        {activePartner ? (
          <>
            <div className="p-4 border-b border-gray-800/80 flex items-center gap-3 bg-gray-950/20">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-300 font-bold text-xs">
                {activePartner.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{activePartner.name}</h4>
                <p className="text-[10px] text-gray-400">{activePartner.email}</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m, i) => {
                const isMe = (m.sender?._id || m.sender) === (user?.id || user?._id);
                return (
                  <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-xs md:max-w-md p-3 rounded-2xl text-xs ${
                      isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-800/80 text-gray-200 border border-gray-700/50 rounded-bl-none'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1 px-1">{formatTime(m.createdAt)}</span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t border-gray-800/80 flex items-center gap-2 bg-gray-950/30">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${activePartner.name}...`}
                className="flex-1 bg-gray-900 border border-gray-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <MessageSquare className="w-12 h-12 text-gray-600" />
            <p className="text-sm text-gray-400 font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}