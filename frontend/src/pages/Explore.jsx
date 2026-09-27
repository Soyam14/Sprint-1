import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, ArrowRightLeft, Zap, ShieldCheck, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Explore() {
  const { user, token } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const currentUserId = user?.id || user?._id;
  const categories = ['All', 'Coding', 'Design', 'Music', 'Tech'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/skills');
      setSkills(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error('Failed to load skills');
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapRequest = async (skill) => {
    if (!token || !user) {
      toast.error('Please log in to send a swap request');
      return;
    }

    const recipientId = skill.user?._id || skill.user;

    if (recipientId === currentUserId) {
      toast.error('You cannot request a swap on your own skill');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/connections/request',
        { recipientId, skillId: skill._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Swap request sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  };

  const filteredSkills = (skills || []).filter((skill) => {
    const matchesSearch =
      skill.title?.toLowerCase().includes(search.toLowerCase()) ||
      skill.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || skill.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Hero Banner with Stats */}
      <div className="bg-gradient-to-b from-indigo-950/40 via-gray-900/60 to-gray-900/40 border border-gray-800 rounded-3xl p-8 md:p-12 text-center space-y-6">
        <div className="inline-block">
          <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
            Peer To Peer Skill Exchange
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Swap Knowledge. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Master Anything for Free.
          </span>
        </h1>
        
        <p className="text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
          Connect with creators, developers, and artists worldwide. Trade your expertise directly without spending a dime.
        </p>

        {/* Hero Counter Stats */}
        <div className="grid grid-cols-3 max-w-md mx-auto pt-4 border-t border-gray-800/80">
          <div>
            <div className="text-lg font-extrabold text-white">500+</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Skills Shared</div>
          </div>
          <div>
            <div className="text-lg font-extrabold text-white">1.2k</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Swaps Completed</div>
          </div>
          <div>
            <div className="text-lg font-extrabold text-white">100%</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Free Forever</div>
          </div>
        </div>
      </div>

      {/* Feature Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Instant Skill Matching</h4>
            <p className="text-xs text-gray-400 mt-1">
              Find partners offering exact skills you want to learn in exchange for what you teach best.
            </p>
          </div>
        </div>

        <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Verified Peer Reviews</h4>
            <p className="text-xs text-gray-400 mt-1">
              Trade knowledge safely with user ratings, verified badges, and transparent swap records.
            </p>
          </div>
        </div>

        <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Global Community</h4>
            <p className="text-xs text-gray-400 mt-1">
              Collaborate with creative minds globally via built-in real-time interactive chat modules.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search Python, Guitar, UI Design..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="text-center text-gray-500 text-sm py-12">Loading skills...</div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-12">No skills found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => {
            const skillOwnerId = skill.user?._id || skill.user;
            
            const isMyOwnSkill =
              currentUserId &&
              skillOwnerId &&
              skillOwnerId.toString() === currentUserId.toString();

            return (
              <div
                key={skill._id}
                className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-700 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                      {skill.category || 'General'}
                    </span>
                    <span className="text-xs text-gray-500">
                      by {skill.user?.name || 'User'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{skill.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{skill.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block">Wants</span>
                    <span className="text-xs text-gray-300 font-medium">
                      {skill.wants || 'Skill Exchange'}
                    </span>
                  </div>

                  {isMyOwnSkill ? (
                    <span className="px-3 py-1.5 bg-gray-800/80 text-gray-500 text-xs font-semibold rounded-xl border border-gray-700/60 cursor-not-allowed">
                      Your Skill
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSwapRequest(skill)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                    >
                      Swap <ArrowRightLeft className="w-3.5 h-3.5" />
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