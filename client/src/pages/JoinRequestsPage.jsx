import React, { useState, useEffect } from 'react';
import api from '../services/api';
import UserProfileModal from '../components/UserProfileModal';
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  User,
  GraduationCap,
  MessageSquare,
  Loader2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const JoinRequestsPage = () => {
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'outgoing'
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Applicant Profile Modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [inRes, outRes] = await Promise.all([
        api.get('/requests/incoming'),
        api.get('/requests/outgoing'),
      ]);

      if (inRes.data.success) {
        setIncomingRequests(inRes.data.requests || []);
      }
      if (outRes.data.success) {
        setOutgoingRequests(outRes.data.requests || []);
      }
    } catch (err) {
      toast.error('Failed to load join requests.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      const { data } = await api.patch(`/requests/${requestId}/accept`);
      if (data.success) {
        toast.success('Applicant accepted! Roster updated.');
        setIncomingRequests((prev) =>
          prev.map((r) => (r._id === requestId ? { ...r, status: 'Accepted' } : r))
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to accept request.';
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      const { data } = await api.patch(`/requests/${requestId}/reject`);
      if (data.success) {
        toast.success('Request rejected.');
        setIncomingRequests((prev) =>
          prev.map((r) => (r._id === requestId ? { ...r, status: 'Rejected' } : r))
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reject request.';
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      const { data } = await api.patch(`/requests/${requestId}/cancel`);
      if (data.success) {
        toast.success('Join request cancelled.');
        setOutgoingRequests((prev) =>
          prev.map((r) => (r._id === requestId ? { ...r, status: 'Cancelled' } : r))
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel request.';
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
            <Ban className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Inbox className="w-7 h-7 text-violet-400" />
          Join Request Central
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review incoming applications from student hackers and manage your sent applications.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'incoming'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Applications</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-900/80 font-bold">
            {incomingRequests.filter((r) => r.status === 'Pending').length} Pending
          </span>
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'outgoing'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>My Sent Pitches</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-900/80 font-bold">
            {outgoingRequests.length}
          </span>
        </button>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          <span>Loading join requests...</span>
        </div>
      ) : activeTab === 'incoming' ? (
        incomingRequests.length === 0 ? (
          <div className="p-12 rounded-3xl glass-panel text-center border border-slate-800 max-w-md mx-auto">
            <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Incoming Requests</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              When students apply to join your hackathon teams, their pitches and skill profiles will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {incomingRequests.map((req) => (
              <div
                key={req._id}
                className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left: Applicant Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <img
                    src={
                      req.student?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(req.student?.name || 'Applicant')}&background=8b5cf6&color=fff`
                    }
                    alt={req.student?.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-violet-500/30 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white truncate">{req.student?.name}</h4>
                      {getStatusBadge(req.status)}
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                      <span>{req.student?.college}</span>
                      <span className="text-slate-600">•</span>
                      <span>Applying to <strong className="text-slate-200">{req.team?.name}</strong></span>
                    </p>

                    {/* Pitch Message */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <span>"{req.message}"</span>
                    </div>

                    {/* Applicant's Skills */}
                    {req.student?.technicalSkills && req.student.technicalSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {req.student.technicalSkills.slice(0, 5).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap md:flex-col items-center md:items-end justify-end gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedStudent(req.student);
                      setIsProfileModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                  >
                    View Full Profile
                  </button>

                  {req.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(req._id)}
                        disabled={actionLoadingId === req._id}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(req._id)}
                        disabled={actionLoadingId === req._id}
                        className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/30 transition disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {actionLoadingId === req._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        <span>Accept to Team</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        outgoingRequests.length === 0 ? (
          <div className="p-12 rounded-3xl glass-panel text-center border border-slate-800 max-w-md mx-auto">
            <Send className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Outgoing Applications</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              You haven't applied to any teams yet. Browse open opportunities and pitch your skills to team leaders!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {outgoingRequests.map((req) => (
              <div
                key={req._id}
                className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {req.team?.hackathonName || 'Hackathon Team'}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">{req.team?.name}</h3>
                  <p className="text-xs font-semibold text-violet-400 mt-0.5">{req.team?.projectTitle}</p>

                  <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="text-[10px] text-slate-500 block mb-0.5 uppercase font-bold tracking-wider">
                      Your Pitch:
                    </span>
                    "{req.message}"
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2">
                    Submitted on {new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {/* Cancel pending request */}
                {req.status === 'Pending' && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleCancel(req._id)}
                      disabled={actionLoadingId === req._id}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition disabled:opacity-50"
                    >
                      {actionLoadingId === req._id ? 'Cancelling...' : 'Cancel Application'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Applicant Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedStudent}
      />
    </div>
  );
};

export default JoinRequestsPage;
