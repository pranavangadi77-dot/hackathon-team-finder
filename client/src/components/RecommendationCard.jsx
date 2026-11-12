import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Layers, Users, Calendar, UserCheck, ShieldCheck, MapPin } from 'lucide-react';

const RecommendationCard = ({
  recommendation,
  onViewDetails,
  onRequestToJoin,
  hasPending = false,
}) => {
  const {
    team,
    matchPercentage,
    matchedSkills = [],
    unmatchedMissingSkills = [],
    missingSkillsStillNotCovered = [],
    suggestedRole,
    availablePositions,
    reason,
    explanation,
    skillMatchScore,
    preferredRoleScore,
    availabilityScore,
  } = recommendation;

  const stillRequired = unmatchedMissingSkills.length > 0
    ? unmatchedMissingSkills
    : missingSkillsStillNotCovered;

  const displayReason = reason || explanation;
  const positions = availablePositions !== undefined ? availablePositions : team.availablePositions;

  // Determine score color badge
  const getBadgeStyle = (score) => {
    if (score >= 90) return 'from-emerald-500 to-cyan-500 text-white shadow-emerald-500/20';
    if (score >= 70) return 'from-violet-500 to-indigo-500 text-white shadow-violet-500/20';
    return 'from-blue-500 to-slate-600 text-white shadow-blue-500/20';
  };

  const deadline = team.hackathonDeadline || team.applicationDeadline;

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden border border-violet-500/30 group hover:border-violet-500/50 transition">
      {/* Background ambient match glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-600/20 transition duration-500" />

      <div>
        {/* Top Header: Hackathon & Match Percentage */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            {team.hackathonName}
          </span>

          {/* Prominent Match Percentage */}
          <div className={`px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r ${getBadgeStyle(matchPercentage)} shadow-lg flex items-center gap-1`}>
            <span>{matchPercentage}% MATCH</span>
          </div>
        </div>

        {/* Team Name */}
        <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-violet-200 transition">
          {team.teamName || team.name}
        </h3>

        {/* Suggested Role & Available Positions */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {suggestedRole && (
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              Suggested Role: {suggestedRole}
            </span>
          )}
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {positions} Open Position{positions !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Team Leader Details */}
        <div className="flex items-center gap-2.5 mt-3 pt-2.5 border-t border-slate-800/80">
          <img
            src={
              team.leader?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(team.leader?.name || 'Leader')}&background=8b5cf6&color=fff`
            }
            alt={team.leader?.name}
            className="w-7 h-7 rounded-lg object-cover ring-1 ring-violet-500/30 flex-shrink-0"
          />
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-200 block truncate">
              {team.leader?.name || 'Team Leader'}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-slate-500" />
              {team.college || team.leader?.college || 'University'}
            </span>
          </div>
        </div>

        {/* Deterministic Explanation Box */}
        {displayReason && (
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-slate-900/40 border border-violet-500/30 text-xs text-violet-200 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Recommendation Reason:</span>
              <p className="text-[11px] text-slate-300">{displayReason}</p>
            </div>
          </div>
        )}

        {/* Matched vs Still Required Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* Matched Skills */}
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-2">
              <CheckCircle2 className="w-3 h-3" />
              Matched Skills:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  >
                    ✓ {s}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-500 italic">No direct matches</span>
              )}
            </div>
          </div>

          {/* Missing Skills Still Not Covered */}
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-2">
              <AlertTriangle className="w-3 h-3" />
              Still Required:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {stillRequired.length > 0 ? (
                stillRequired.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/25"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-emerald-400 font-semibold">
                  None (All Gaps Covered! 🎉)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info & Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>
            Deadline: {deadline ? new Date(deadline).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Open'}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onViewDetails(team)}
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition"
          >
            View Team
          </button>

          {hasPending ? (
            <span className="flex-1 sm:flex-initial py-2 px-4 rounded-xl text-xs font-medium bg-amber-950/40 text-amber-300 border border-amber-800/40 text-center">
              Request Sent
            </span>
          ) : (
            <button
              onClick={() => onRequestToJoin(team)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/30 transition active:scale-95"
            >
              <span>Send Join Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
