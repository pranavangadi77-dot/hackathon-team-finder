import React, { useState, useEffect } from 'react';
import api from '../services/api';
import RecommendationCard from '../components/RecommendationCard';
import TeamDetailsModal from '../components/TeamDetailsModal';
import JoinRequestModal from '../components/JoinRequestModal';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Zap,
  Cpu,
  Target,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

const RecommendationsPage = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequestIds, setPendingRequestIds] = useState([]);

  // Modals
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const [recRes, outRes] = await Promise.all([
        api.get('/teams/recommendations'),
        api.get('/requests/outgoing'),
      ]);

      if (recRes.data.success) {
        setRecommendations(recRes.data.recommendations || []);
      }
      if (outRes.data.success) {
        const pIds = (outRes.data.requests || [])
          .filter((r) => r.status === 'Pending')
          .map((r) => (r.team?._id ? r.team._id.toString() : r.team.toString()));
        setPendingRequestIds(pIds);
      }
    } catch (err) {
      toast.error('Failed to calculate skill-gap recommendations.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleRequestSent = (teamId) => {
    setPendingRequestIds((prev) => [...prev, teamId]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-violet-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/25 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Intelligent Skill-Gap Matching Algorithm</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recommended Teams For Your Skillset
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Calculated dynamically against active hackathon squads needing your specific engineering skills to conquer registration requirements.
            </p>
          </div>

          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition self-start md:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Recalculate Matches</span>
          </button>
        </div>

        {/* Algorithm Weights Legend */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              Weight 60%
            </span>
            <span className="text-violet-300 font-bold block mt-0.5">Skill-Gap Coverage</span>
            <span className="text-[10px] text-slate-500">Unfulfilled team stack requirements</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              Weight 20%
            </span>
            <span className="text-cyan-300 font-bold block mt-0.5">Interest Alignment</span>
            <span className="text-[10px] text-slate-500">Hackathon problem & track synergy</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              Weight 10%
            </span>
            <span className="text-emerald-300 font-bold block mt-0.5">Experience Fit</span>
            <span className="text-[10px] text-slate-500">Preferred hacker seniority level</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              Weight 10%
            </span>
            <span className="text-amber-300 font-bold block mt-0.5">Campus Synergy</span>
            <span className="text-[10px] text-slate-500">Same university / project affinity</span>
          </div>
        </div>
      </div>

      {/* Recommendations Feed */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel text-center border border-slate-800 max-w-md mx-auto">
          <Target className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Matching Teams Right Now</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            We couldn't find an open team that needs your exact skill profile. Try adding more technical skills or interests to your profile!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, idx) => (
            <RecommendationCard
              key={idx}
              recommendation={rec}
              onViewDetails={(t) => {
                setSelectedTeam(t);
                setIsDetailsModalOpen(true);
              }}
              onRequestToJoin={(t) => {
                setSelectedTeam(t);
                setIsJoinModalOpen(true);
              }}
              hasPending={pendingRequestIds.includes(rec.team._id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <JoinRequestModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        team={selectedTeam}
        onRequestSent={handleRequestSent}
      />

      <TeamDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        team={selectedTeam}
        onRequestToJoin={(t) => {
          setIsDetailsModalOpen(false);
          setSelectedTeam(t);
          setIsJoinModalOpen(true);
        }}
        hasPendingRequest={selectedTeam && pendingRequestIds.includes(selectedTeam._id)}
      />
    </div>
  );
};

export default RecommendationsPage;
