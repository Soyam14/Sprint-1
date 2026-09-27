import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Repeat, ShieldCheck, ArrowRight } from 'lucide-react';

export default function About() {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Democratizing Learning Through <span className="text-indigo-400">Skill Swapping</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          SkillBridge was built on a simple premise: Everyone is an expert at something, and everyone wants to learn something new.
        </p>
      </div>

      {/* Value Proposition Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl space-y-3">
          <Users className="w-8 h-8 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Direct Peer Matching</h3>
          <p className="text-xs text-gray-400">
            Connect with verified individuals ready to trade real-world skills through interactive 1-on-1 sessions.
          </p>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl space-y-3">
          <Repeat className="w-8 h-8 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Zero Dollar Economy</h3>
          <p className="text-xs text-gray-400">
            No subscriptions or hidden fees. Trade one hour of your teaching for one hour of learning.
          </p>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl space-y-3">
          <ShieldCheck className="w-8 h-8 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Safe Community</h3>
          <p className="text-xs text-gray-400">
            In-app real-time messaging, review systems, and request verification ensure seamless collaborations.
          </p>
        </div>
      </div>

      {/* How SkillBridge Works */}
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white">How SkillBridge Works</h2>
          <p className="text-xs text-gray-400">Get started in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl space-y-3 relative overflow-hidden">
            <span className="text-4xl font-black text-indigo-500/20 absolute top-4 right-4">01</span>
            <h3 className="text-base font-bold text-white">Post a Skill</h3>
            <p className="text-xs text-gray-400">
              List what you are good at and what you want to learn.
            </p>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl space-y-3 relative overflow-hidden">
            <span className="text-4xl font-black text-indigo-500/20 absolute top-4 right-4">02</span>
            <h3 className="text-base font-bold text-white">Send Swap Requests</h3>
            <p className="text-xs text-gray-400">
              Browse peers and send direct skill exchange requests.
            </p>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl space-y-3 relative overflow-hidden">
            <span className="text-4xl font-black text-indigo-500/20 absolute top-4 right-4">03</span>
            <h3 className="text-base font-bold text-white">Connect & Learn</h3>
            <p className="text-xs text-gray-400">
              Accept requests and start chatting in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Ready to start trading skills CTA Banner (Hidden when user is logged in) */}
      {!user && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white space-y-6 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold">Ready to start trading skills?</h2>
          <p className="text-indigo-100 text-xs md:text-sm max-w-xl mx-auto">
            Join hundreds of active learners and share your expertise today.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition shadow-md"
          >
            Get Started Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}