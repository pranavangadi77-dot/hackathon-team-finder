import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const InviteMemberModal = ({ isOpen, onClose, student }) => {
  const [myTeams, setMyTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingTeams, setFetchingTeams] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMyTeams = async () => {
      try {
        setFetchingTeams(true);
        const { data } = await api.get('/teams?myTeamsOnly=true');
        if (data.success) {
          // Filter only teams where logged in user is leader and availablePositions > 0
          const openTeams = (data.teams || []).filter((t) => t.status === 'Open' && t.availablePositions > 0);
          setMyTeams(openTeams);
          if (openTeams.length > 0) {
            setSelectedTeamId(openTeams[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load user teams for invitation', err);
      } finally {
        setFetchingTeams(false);
      }
    };

    fetchMyTeams();
  }, [isOpen]);

  if (!isOpen || !student) return null;

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!selectedTeamId) {
      toast.error('Please select an open team.');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post(`/teams/${selectedTeamId}/invite`, {
        studentId: student._id,
      });

      if (data.success) {
        toast.success(data.message || `Invitation sent to ${student.name}!`);
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send invitation.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-7 shadow-2xl">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Team Invitation
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-1">
              Invite {student.name}
            </h3>
            <p className="text-xs text-slate-400">{student.college}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {fetchingTeams ? (
          <div className="py-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
            Loading your active teams...
          </div>
        ) : myTeams.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto opacity-80" />
            <h4 className="text-sm font-semibold text-slate-200">No Open Teams Available</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              You must be the leader of an active team with open vacancies to invite teammates.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendInvite} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Your Team
              </label>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full rounded-2xl bg-slate-900/90 border border-slate-700/80 px-4 py-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
              >
                {myTeams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name} ({team.hackathonName}) – {team.availablePositions} spots left
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Notification will be delivered
              </div>
              <p className="text-[11px] leading-relaxed">
                {student.name} will receive a notification inviting them to join your hackathon team opening.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 transition disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Invite
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InviteMemberModal;
