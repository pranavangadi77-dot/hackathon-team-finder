import React from 'react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Award,
  Send,
  Mail,
  CheckCircle,
  ExternalLink,
  Tag,
  Briefcase
} from 'lucide-react';

const TeamDetailsModal = ({ isOpen, onClose, team, onRequestToJoin, isMemberOrLeader, hasPendingRequest }) => {
  if (!isOpen || !team) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
            {team.hackathonName}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
            {team.category || 'Open Innovation'}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            team.status === 'Open'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}>
            {team.status === 'Open' ? `${team.availablePositions} Spots Open` : 'Team Full'}
          </span>
        </div>

        {/* Team & Project Title */}
        <h2 className="text-2xl font-bold text-white tracking-tight">{team.name}</h2>
        <h4 className="text-sm font-medium text-violet-400 mt-1">{team.projectTitle}</h4>

        {/* Quick Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300">
          <div>
            <span className="text-slate-500 block text-[11px]">Preferred Exp:</span>
            <span className="font-semibold text-slate-200">{team.preferredExperience || 'Any'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Roster Size:</span>
            <span className="font-semibold text-slate-200">
              {team.members?.length || 1} / {team.maxMembers} Members
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-500 block text-[11px]">Deadline:</span>
            <span className="font-semibold text-slate-200">
              {new Date(team.applicationDeadline).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Project Description & Problem Statement */}
        <div className="space-y-4">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-violet-400" />
              Project Overview
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/50">
              {team.description}
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Problem Statement
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/50">
              {team.problemStatement}
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              Required Skills
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {team.requiredSkills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg font-medium bg-violet-950/40 text-violet-300 border border-violet-800/40"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Team Roster */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Team Members ({team.members?.length || 1})
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Leader Card */}
              {team.leader && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <img
                    src={
                      team.leader.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(team.leader.name || 'L')}&background=8b5cf6&color=fff`
                    }
                    alt={team.leader.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-violet-500/40"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white truncate">{team.leader.name}</p>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300">
                        Leader
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{team.leader.college}</p>
                  </div>
                </div>
              )}

              {/* Members */}
              {team.members
                ?.filter((m) => (m._id || m) !== (team.leader?._id || team.leader))
                .map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                    <img
                      src={
                        member.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'M')}&background=6366f1&color=fff`
                      }
                      alt={member.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{member.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{member.college || 'Student'}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-violet-400" />
              <span>Contact: <strong className="text-white">{team.contactInfo}</strong></span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/80 transition"
          >
            Close
          </button>

          {!isMemberOrLeader && team.status === 'Open' && team.availablePositions > 0 && (
            <button
              onClick={() => {
                onClose();
                if (onRequestToJoin) onRequestToJoin(team);
              }}
              disabled={hasPendingRequest}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg transition active:scale-95 ${
                hasPendingRequest
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/30'
              }`}
            >
              <Send className="w-4 h-4" />
              {hasPendingRequest ? 'Request Pending' : 'Request to Join Team'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsModal;
