import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      login(res.data.user, res.data.token);
      toast.success(isRegister ? 'Account created successfully!' : 'Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-[#131722]/80 border border-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-xs text-gray-400">
          {isRegister ? 'Join SkillBridge to exchange skills with peers' : 'Log in to access your swaps and messages'}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="grid grid-cols-2 p-1 bg-gray-900/80 border border-gray-800 rounded-2xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setIsRegister(false)}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            !isRegister ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => setIsRegister(true)}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            isRegister ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-300">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full bg-gray-900/90 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-300">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-gray-900/90 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-300">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-gray-900/90 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Forgot Password link positioned below input */}
          {!isRegister && (
            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" className="text-[11px] text-indigo-400 hover:text-indigo-300 transition">
                Forgot Password?
              </Link>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Log In'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* Footer link */}
      <p className="text-center text-xs text-gray-400">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer ml-1"
        >
          {isRegister ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}