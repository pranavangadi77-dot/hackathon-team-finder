import React from 'react';
import {
  X,
  GraduationCap,
  Award,
  Github,
  Linkedin,
  Globe,
  Tag,
  Heart,
  Send,
  UserCheck
} from 'lucide-react';

const UserProfileModal = ({ isOpen, onClose, user, onInviteClick, canInvite }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-7 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile Section */}
        <div className="flex items-start gap-4">
          <img
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=8b5cf6&color=fff`
            }
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-violet-500/40 shadow-xl"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-white tracking-tight">{user.name}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
              {user.college} {user.branch && `• ${user.branch}`}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {user.yearOfStudy || '3rd Year'}
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Award className="w-3 h-3" />
                {user.experience || 'Intermediate'}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mt-5 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
            "{user.bio}"
          </div>
        )}

        {/* Technical Skills */}
        <div className="mt-5 space-y-3">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-violet-400" />
              Technical Skills
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {user.technicalSkills && user.technicalSkills.length > 0 ? (
                user.technicalSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-lg font-medium bg-violet-950/40 text-violet-300 border border-violet-800/40"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No technical skills listed</span>
              )}
            </div>
          </div>

          {/* Non-Technical Skills */}
          {user.nonTechnicalSkills && user.nonTechnicalSkills.length > 0 && (
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                Non-Technical Skills
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {user.nonTechnicalSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-lg font-medium bg-slate-800/70 text-slate-300 border border-slate-700/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Interests & Focus Areas
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-lg font-medium bg-slate-800/50 text-slate-300 border border-slate-700/40"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
          {user.githubUrl && (
            <a
              href={user.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
            >
              <Github className="w-4 h-4 text-slate-400" />
              GitHub
            </a>
          )}
          {user.linkedinUrl && (
            <a
              href={user.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 border border-slate-800 transition"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          )}
          {user.portfolioUrl && (
            <a
              href={user.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-800 transition"
            >
              <Globe className="w-4 h-4" />
              Portfolio
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
          >
            Close
          </button>
          {canInvite && onInviteClick && (
            <button
              onClick={() => {
                onClose();
                onInviteClick(user);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 transition active:scale-95"
            >
              <Send className="w-4 h-4" />
              Invite to My Team
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
