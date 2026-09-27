import React, { useState } from 'react';
import axios from 'axios';
import { Mail, KeyRound, Lock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/request-otp', { email });
      toast.success(res.data.message);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password-otp', {
        email,
        otp,
        newPassword
      });
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-gray-900/60 border border-gray-800 rounded-2xl shadow-xl space-y-6">
      <Link to="/login" className="inline-flex items-center text-xs text-indigo-400 hover:text-indigo-300 gap-1 transition">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
      </Link>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Reset Password</h2>
        <p className="text-xs text-gray-400">
          {step === 1 ? 'Enter your registered email address to receive an OTP.' : `Enter the 6-digit OTP sent for ${email}.`}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Generating OTP...' : 'Get OTP Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative">
            <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
            <input
              type="text"
              required
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 tracking-widest"
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
            <input
              type="password"
              required
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Resetting Password...' : 'Submit & Update Password'}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-center text-xs text-gray-400 hover:text-white pt-2"
          >
            Change Email
          </button>
        </form>
      )}
    </div>
  );
}