import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TeamCard from '../components/TeamCard';
import RecommendationCard from '../components/RecommendationCard';
import JoinRequestModal from '../components/JoinRequestModal';
import TeamDetailsModal from '../components/TeamDetailsModal';
import {
  Sparkles,
  Users,
  Compass,
  Inbox,
  FolderGit2,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const [profileCompletion, setProfileCompletion] = useState(80);
  const [stats, setStats] = useState({
    createdTeams: 0,
    joinedTeams: 0,
    pendingRequests: 0,
    incomingRequests: 0,
  });
  const [recommendations, setRecommendations] = useState([]);
  const [recentTeams, setRecentTeams] = useState([]);
  const [outgoingPendingIds, setOutgoingPendingIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch auth/me data for profile completion
        const meRes = await api.get('/auth/me');
        if (meRes.data.success) {
          setProfileCompletion(meRes.data.profileCompletion || 85);
          if (meRes.data.stats) {
            setStats((prev) => ({ ...prev, ...meRes.data.stats }));
          }
        }

        // Fetch outgoing requests
        const outRes = await api.get('/requests/outgoing');
        if (outRes.data.success) {
          const pendingIds = (outRes.data.requests || [])
            .filter((r) => r.status === 'Pending')
            .map((r) => r.team?._id || r.team);
          setOutgoingPendingIds(pendingIds);
          setStats((prev) => ({
            ...prev,
            pendingRequests: pendingIds.length,
          }));
        }

        // Fetch incoming requests
        const inRes = await api.get('/requests/incoming');
        if (inRes.data.success) {
          const pendingIn = (inRes.data.requests || []).filter((r) => r.status === 'Pending');
          setStats((prev) => ({ ...prev, incomingRequests: pendingIn.length }));
        }

        // Fetch AI recommendations
        const recRes = await api.get('/teams/recommendations');
        if (recRes.data.success) {
          setRecommendations(recRes.data.recommendations || []);
        }

        // Fetch open teams
        const teamsRes = await api.get('/teams?openPositionsOnly=true');
        if (teamsRes.data.success) {
          setRecentTeams((teamsRes.data.teams || []).slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRequestSent = (teamId) => {
    setOutgoingPendingIds((prev) => [...prev, teamId]);
    setStats((prev) => ({ ...prev, pendingRequests: prev.pendingRequests + 1 }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/25 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                Hackathon Builder Workspace
              </span>
              <span className="text-xs text-slate-400">
                {user?.college || 'Student'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
              You are currently registered for hackathon teammate discovery. Check out your latest skill-gap matches below.
            </p>
          </div>

          {/* Profile Completion Meter */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4 flex-shrink-0">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-violet-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${profileCompletion}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-white">
                {profileCompletion}%
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Profile Strength</p>
              <p className="text-[11px] text-slate-400">
                {profileCompletion === 100 ? 'All skills complete' : 'Add skills to boost match %'}
              </p>
              <Link
                to="/profile"
                className="text-[11px] text-violet-400 hover:text-violet-300 font-semibold inline-flex items-center gap-0.5 mt-0.5"
              >
                Edit profile <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/my-teams"
          className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-violet-500/30 transition flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block truncate">My Teams</span>
            <span className="text-xl font-bold text-white">
              {stats.createdTeams + stats.joinedTeams}
            </span>
          </div>
        </Link>

        <Link
          to="/requests"
          className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/30 transition flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
            <Inbox className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block truncate">Incoming Requests</span>
            <span className="text-xl font-bold text-white">
              {stats.incomingRequests}
            </span>
          </div>
        </Link>

        <Link
          to="/requests"
          className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-amber-500/30 transition flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block truncate">Pending Applications</span>
            <span className="text-xl font-bold text-white">
              {stats.pendingRequests}
            </span>
          </div>
        </Link>

        <Link
          to="/recommendations"
          className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-emerald-500/30 transition flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
            <Zap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block truncate">AI Matches Found</span>
            <span className="text-xl font-bold text-white">
              {recommendations.length}
            </span>
          </div>
        </Link>
      </div>

      {/* Intelligent Recommendations Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Top AI Skill-Gap Matches For You
            </h2>
          </div>
          <Link
            to="/recommendations"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            View all {recommendations.length} recommendations
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="p-8 rounded-3xl glass-panel text-center border border-slate-800">
            <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-semibold text-slate-200">No Matching Teams Right Now</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Add more technical skills to your profile or create your own hackathon team opening to attract members.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Link to="/profile" className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700">
                Update Skills
              </Link>
              <Link to="/create-team" className="px-4 py-2 text-xs rounded-xl bg-violet-600 text-white hover:bg-violet-500">
                Create a Team
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendations.slice(0, 2).map((rec, idx) => (
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
                hasPending={outgoingPendingIds.includes(rec.team._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Open Hackathon Teams Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-slate-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recently Published Team Openings
            </h2>
          </div>
          <Link
            to="/teams"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            Explore all teams
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-60 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : recentTeams.length === 0 ? (
          <div className="p-8 rounded-3xl glass-panel text-center text-xs text-slate-400 border border-slate-800">
            No open team positions at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentTeams.map((team) => (
              <TeamCard
                key={team._id}
                team={team}
                onViewDetails={(t) => {
                  setSelectedTeam(t);
                  setIsDetailsModalOpen(true);
                }}
                onRequestToJoin={(t) => {
                  setSelectedTeam(t);
                  setIsJoinModalOpen(true);
                }}
                userPendingRequests={outgoingPendingIds}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Dock */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Have an idea for an upcoming hackathon?</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Publish your project problem statement and let candidates pitch their complementary skills to you.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/create-team"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Create Team Opening
          </Link>
          <Link
            to="/members"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Users className="w-4 h-4" />
            Browse Hackers
          </Link>
        </div>
      </div>

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
        hasPendingRequest={selectedTeam && outgoingPendingIds.includes(selectedTeam._id)}
      />
    </div>
  );
};

export default DashboardPage;
