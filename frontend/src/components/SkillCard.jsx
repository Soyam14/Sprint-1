import React from 'react';
import { User, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SkillCard({ skill }) {
  return (
    <div className="bg-gray-900/70 border border-gray-800 p-5 rounded-2xl flex flex-col justify-between hover:border-gray-700 transition space-y-4 shadow-lg">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-semibold uppercase">
            {skill.category || 'General'}
          </span>
          <span className="text-[11px] text-gray-500 flex items-center gap-1">
            <User className="w-3 h-3 text-gray-400" /> {skill.user?.name || 'Anonymous'}
          </span>
        </div>
        <h3 className="text-base font-bold text-white line-clamp-1">{skill.title}</h3>
        <p className="text-xs text-gray-400 line-clamp-2">{skill.description}</p>
      </div>

      <div className="pt-3 border-t border-gray-800/60 flex items-center justify-between">
        <div className="text-[11px] text-gray-400">
          Wants: <span className="text-indigo-300 font-medium">{skill.wantsToLearn || 'Skill Exchange'}</span>
        </div>
        <Link
          to={`/chat?user=${skill.user?._id || ''}`}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition"
        >
          Swap <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}