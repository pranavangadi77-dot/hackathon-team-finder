import React, { useState } from 'react';
import { X, Send, Sparkles, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const JoinRequestModal = ({ isOpen, onClose, team, onRequestSent }) => {
  const [message, setMessage] = useState(
    'Hey! I saw your team opening and I would love to contribute my skills to this project. Let’s connect!'
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen || !team) return null;

  const teamTitle = team.teamName || team.name;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || message.length < 5) {
      toast.error('Please enter a message (at least 5 characters).');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/requests', {
        teamId: team._id,
        message: message.trim(),
      });

      if (data.success) {
        toast.success(data.message || 'Request sent successfully!');
        if (onRequestSent) onRequestSent(team._id);
        onClose();
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit join request.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-7 shadow-2xl overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Join Request
              </span>
              <span className="text-xs text-slate-400">
                {team.availablePositions} position{team.availablePositions !== 1 ? 's' : ''} left
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{teamTitle}</h3>
            {team.projectTitle && (
              <p className="text-xs text-slate-400 line-clamp-1">{team.projectTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Personalized Pitch / Note to Team Leader
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Explain why you're a great fit and which missing skills you can provide to the squad.
            </p>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              placeholder="Hi! I have extensive experience with Node.js and MongoDB. I noticed your team needs backend support..."
              className="w-full rounded-2xl bg-slate-900/90 border border-slate-700/80 px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition resize-none"
            />
            <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500">
              <span>Highlight your complementary tech stack.</span>
              <span>{message.length} / 500</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 flex items-start gap-2.5 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
            <span>
              The team leader (<span className="text-slate-200 font-medium">{team.leader?.name || 'Leader'}</span>) will receive an in-app notification to review your student profile.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/80 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Join Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRequestModal;
