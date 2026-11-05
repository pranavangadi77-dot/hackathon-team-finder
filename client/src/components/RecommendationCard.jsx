import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Layers, Users, Calendar } from 'lucide-react';

const RecommendationCard = ({
  recommendation,
  onViewDetails,
  onRequestToJoin,
  hasPending = false,
}) => {
  const {
    team,
    matchPercentage,
    matchingSkills = [],
    missingTeamSkills = [],
    matchingMissingSkills = [],
    explanation,
    scoreBreakdown = {},
  } = recommendation;

  // Determine gradient color based on match score
  const getScoreBadge = (score) => {
    if (score >= 80) return 'from-emerald-500 to-cyan-500 text-white';
    if (score >= 60) return 'from-violet-500 to-indigo-500 text-white';
    return 'from-blue-500 to-slate-500 text-white';
  };

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden border border-violet-500/30 group">
      {/* Background ambient match glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-600/20 transition duration-500" />

      <div>
        {/* Top Header: Hackathon & Score Badge */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              {team.hackathonName}
            </span>
            <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {team.category}
            </span>
          </div>

          {/* Match Percentage Badge */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r ${getScoreBadge(matchPercentage)} shadow-lg shadow-violet-500/20 flex items-center gap-1`}>
              <span>{matchPercentage}%</span>
              <span className="text-[10px] font-medium opacity-90 uppercase">Match</span>
            </div>
          </div>
        </div>

        {/* Team Title */}
        <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-violet-200 transition">
          {team.name}
        </h3>
        <p className="text-xs font-semibold text-violet-400/90 mt-0.5">
          {team.projectTitle}
        </p>

        {/* AI Match Explanation Box */}
        <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-slate-900/40 border border-violet-500/30 text-xs text-violet-200 leading-relaxed flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="font-semibold text-white block mb-0.5">Why you are a match:</span>
            <p className="text-[11px] text-slate-300">{explanation}</p>
          </div>
        </div>

        {/* Skills Analysis Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* Missing Skills That You Fill */}
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-2">
              <CheckCircle2 className="w-3 h-3" />
              Missing Skills You Provide:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {matchingMissingSkills.length > 0 ? (
                matchingMissingSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  >
                    {s}
                  </span>
                ))
              ) : matchingSkills.length > 0 ? (
                matchingSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-500 italic">Complementary synergy</span>
              )}
            </div>
          </div>

          {/* Missing Team Skills */}
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-2">
              <AlertTriangle className="w-3 h-3" />
              Remaining Team Vacancies:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {missingTeamSkills.slice(0, 3).map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-300/90 border border-amber-500/20"
                >
                  {s}
                </span>
              ))}
              {missingTeamSkills.length > 3 && (
                <span className="text-[10px] text-slate-500 self-center">
                  +{missingTeamSkills.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Transparent Score Breakdown Bar */}
        {scoreBreakdown.skillGapScore !== undefined && (
          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-300">Weighted Match Breakdown:</span>
              <span className="text-violet-400 font-bold">{matchPercentage} / 100</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
              <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Skills (60%)</span>
                <span className="font-bold text-violet-300">{scoreBreakdown.skillGapScore} pts</span>
              </div>
              <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Interests (20%)</span>
                <span className="font-bold text-cyan-300">{scoreBreakdown.interestScore} pts</span>
              </div>
              <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Exp (10%)</span>
                <span className="font-bold text-emerald-300">{scoreBreakdown.experienceScore} pts</span>
              </div>
              <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Univ (10%)</span>
                <span className="font-bold text-amber-300">{scoreBreakdown.preferenceScore} pts</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Users className="w-4 h-4 text-slate-500" />
          <span>
            {team.availablePositions} open spot{team.availablePositions !== 1 ? 's' : ''} left
          </span>
          <span className="text-slate-600">•</span>
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>Due {new Date(team.applicationDeadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onViewDetails(team)}
            className="flex-1 sm:flex-initial py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition"
          >
            Details
          </button>

          {hasPending ? (
            <span className="flex-1 sm:flex-initial py-2 px-4 rounded-xl text-xs font-medium bg-amber-950/40 text-amber-300 border border-amber-800/40 text-center">
              Request Pending
            </span>
          ) : (
            <button
              onClick={() => onRequestToJoin(team)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/30 transition active:scale-95"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
