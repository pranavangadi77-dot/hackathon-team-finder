import React from 'react';
import { Users, Calendar, ArrowRight, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TeamCard = ({
  team,
  onViewDetails,
  onRequestToJoin,
  userPendingRequests = [],
}) => {
  const { user } = useAuth();

  const userId = user?._id?.toString();
  const leaderId = team.leader?._id ? team.leader._id.toString() : team.leader?.toString();

  const isLeader = userId && leaderId === userId;
  const isMember =
    userId &&
    (team.members || []).some(
      (m) => (m._id ? m._id.toString() : m.toString()) === userId
    );

  const hasPending = userPendingRequests.includes(team._id);

  // Check if current user has any matching required skills
  const userSkills = (user?.technicalSkills || []).map((s) => s.toLowerCase());
  const matchingSkills = (team.requiredSkills || []).filter((req) =>
    userSkills.some((u) => u.includes(req.toLowerCase()) || req.toLowerCase().includes(u))
  );

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
      {/* Top subtle gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/0 via-violet-500/50 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition duration-300" />

      <div>
        {/* Badges bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
              {team.hackathonName}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
              {team.category || 'Open Innovation'}
            </span>
          </div>

          <span
            className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full flex items-center gap-1 ${
              team.status === 'Open' && team.availablePositions > 0
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
            }`}
          >
            <Users className="w-3 h-3" />
            {team.status === 'Open' && team.availablePositions > 0
              ? `${team.availablePositions} Spot${team.availablePositions > 1 ? 's' : ''}`
              : 'Full'}
          </span>
        </div>

        {/* Team Name & Project Title */}
        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-violet-200 transition line-clamp-1">
          {team.name}
        </h3>
        <p className="text-xs font-semibold text-violet-400/90 mt-0.5 line-clamp-1">
          {team.projectTitle}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
          {team.problemStatement || team.description}
        </p>

        {/* Required Skills */}
        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Seeking Skills:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {team.requiredSkills?.slice(0, 4).map((skill, idx) => {
              const isMatch = matchingSkills.some(
                (ms) => ms.toLowerCase() === skill.toLowerCase()
              );
              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition ${
                    isMatch
                      ? 'bg-violet-600/30 text-violet-200 border border-violet-500/50 font-semibold'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  {skill}
                  {isMatch && ' ✨'}
                </span>
              );
            })}
            {team.requiredSkills?.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-lg text-[10px] bg-slate-900 text-slate-400 border border-slate-800">
                +{team.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col gap-3">
        {/* Team Leader & Deadline */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={
                team.leader?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(team.leader?.name || 'Leader')}&background=8b5cf6&color=fff`
              }
              alt={team.leader?.name}
              className="w-6 h-6 rounded-lg object-cover ring-1 ring-violet-500/30 flex-shrink-0"
            />
            <span className="truncate text-slate-300 font-medium">{team.leader?.name}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 flex-shrink-0">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {new Date(team.applicationDeadline).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(team)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition active:scale-98"
          >
            View Details
          </button>

          {isLeader ? (
            <span className="py-2 px-3 rounded-xl text-xs font-medium bg-violet-950/40 text-violet-300 border border-violet-800/40 text-center">
              Team Leader
            </span>
          ) : isMember ? (
            <span className="py-2 px-3 rounded-xl text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 text-center">
              Joined Team
            </span>
          ) : hasPending ? (
            <span className="py-2 px-3 rounded-xl text-xs font-medium bg-amber-950/40 text-amber-300 border border-amber-800/40 text-center">
              Request Sent
            </span>
          ) : team.status === 'Open' && team.availablePositions > 0 ? (
            <button
              onClick={() => onRequestToJoin(team)}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/20 transition active:scale-98 flex items-center justify-center gap-1.5"
            >
              <span>Join Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="py-2 px-3 rounded-xl text-xs font-medium bg-slate-900 text-slate-500 border border-slate-800 text-center">
              Closed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
