import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TeamDetailsModal from '../components/TeamDetailsModal';
import {
  FolderGit2,
  Users,
  PlusCircle,
  Calendar,
  Inbox,
  Trash2,
  Edit,
  ExternalLink,
  ShieldAlert,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyTeamsPage = () => {
  const { user } = useAuth();
  const [createdTeams, setCreatedTeams] = useState([]);
  const [joinedTeams, setJoinedTeams] = useState([]);
  const [activeTab, setActiveTab] = useState('led'); // 'led' or 'joined'
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchMyTeams = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/teams?myTeamsOnly=true');
      if (data.success) {
        const userId = user?._id?.toString();
        const led = [];
        const joined = [];

        (data.teams || []).forEach((t) => {
          const leaderId = t.leader?._id ? t.leader._id.toString() : t.leader?.toString();
          if (leaderId === userId) {
            led.push(t);
          } else {
            joined.push(t);
          }
        });

        setCreatedTeams(led);
        setJoinedTeams(joined);
      }
    } catch (err) {
      toast.error('Failed to load your hackathon teams.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeams();
  }, [user]);

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team opening? All pending requests will be cancelled.')) {
      return;
    }

    try {
      const { data } = await api.delete(`/teams/${teamId}`);
      if (data.success) {
        toast.success('Team opening removed.');
        setCreatedTeams((prev) => prev.filter((t) => t._id !== teamId));
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete team.';
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-violet-400" />
            My Hackathon Teams
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your project rosters, monitor vacancies, and review teammates.
          </p>
        </div>

        <Link
          to="/create-team"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/30 transition active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Team
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('led')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'led'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <span>Teams I Lead</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-900/60 font-bold">
            {createdTeams.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('joined')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'joined'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <span>Teams I've Joined</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-900/60 font-bold">
            {joinedTeams.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          <span>Loading your hackathon squads...</span>
        </div>
      ) : activeTab === 'led' ? (
        createdTeams.length === 0 ? (
          <div className="p-12 rounded-3xl glass-panel text-center border border-slate-800 max-w-md mx-auto">
            <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Teams Created Yet</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Have a hackathon project idea? Create your team opening to start recruiting teammates.
            </p>
            <Link
              to="/create-team"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Create a Team Opening
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {createdTeams.map((team) => (
              <div
                key={team._id}
                className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {team.hackathonName}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        team.status === 'Open'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {team.status === 'Open'
                        ? `${team.availablePositions} Vacancy left`
                        : 'Team Full'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">{team.name}</h3>
                  <p className="text-xs font-semibold text-violet-400 mt-0.5">{team.projectTitle}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {team.problemStatement}
                  </p>

                  {/* Roster display */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                      <span>Roster ({team.members?.length || 1} / {team.maxMembers}):</span>
                      <span className="text-violet-400 font-semibold">{team.contactInfo}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {team.members?.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300"
                        >
                          <img
                            src={
                              member.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'M')}&background=8b5cf6&color=fff`
                            }
                            alt={member.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-medium text-slate-200">{member.name}</span>
                          {(member._id || member) === (team.leader?._id || team.leader) && (
                            <span className="text-[9px] px-1 rounded bg-violet-500/20 text-violet-300">
                              Lead
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <Link
                    to="/requests"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition"
                  >
                    <Inbox className="w-3.5 h-3.5" />
                    <span>Review Applicants</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedTeam(team);
                        setIsDetailsModalOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team._id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                      title="Delete Team Opening"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        joinedTeams.length === 0 ? (
          <div className="p-12 rounded-3xl glass-panel text-center border border-slate-800 max-w-md mx-auto">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Joined Teams</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              You haven't joined any teams yet. Discover open openings and send join pitches!
            </p>
            <Link
              to="/teams"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500 transition"
            >
              Browse Open Teams
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {joinedTeams.map((team) => (
              <div
                key={team._id}
                className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {team.hackathonName}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Member
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">{team.name}</h3>
                  <p className="text-xs font-semibold text-violet-400 mt-0.5">{team.projectTitle}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {team.problemStatement}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
                    <p>
                      Leader: <strong className="text-white">{team.leader?.name}</strong> ({team.leader?.college})
                    </p>
                    <p>
                      Contact: <strong className="text-white">{team.contactInfo}</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end">
                  <button
                    onClick={() => {
                      setSelectedTeam(team);
                      setIsDetailsModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition"
                  >
                    View Project & Roster
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Details Modal */}
      <TeamDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        team={selectedTeam}
        isMemberOrLeader={true}
      />
    </div>
  );
};

export default MyTeamsPage;
