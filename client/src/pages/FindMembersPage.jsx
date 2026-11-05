import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MemberCard from '../components/MemberCard';
import UserProfileModal from '../components/UserProfileModal';
import InviteMemberModal from '../components/InviteMemberModal';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Award,
  X,
  Loader2,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const EXPERIENCE_OPTIONS = [
  'All',
  'Beginner (0 hackathons)',
  'Intermediate (1-3 hackathons)',
  'Advanced (4+ hackathons)',
  'Hackathon Winner / Mentor',
];

const SKILL_TAGS = [
  'React', 'Node.js', 'Python', 'Machine Learning', 'Solidity',
  'Go', 'Figma', 'UI/UX Design', 'Flutter', 'FastAPI', 'Cybersecurity', 'Docker'
];

const FindMembersPage = () => {
  const { user, isAuthenticated } = useAuth();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('');

  // Modals State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm.trim()) params.append('q', searchTerm.trim());
      if (collegeFilter.trim()) params.append('college', collegeFilter.trim());
      if (selectedExperience !== 'All') params.append('experience', selectedExperience);
      if (selectedSkill) params.append('skill', selectedSkill);

      const { data } = await api.get(`/users?${params.toString()}`);
      if (data.success) {
        setStudents(data.users || []);
      }
    } catch (err) {
      toast.error('Failed to load student builders.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, collegeFilter, selectedExperience, selectedSkill]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCollegeFilter('');
    setSelectedExperience('All');
    setSelectedSkill('');
  };

  const handleInviteClick = (student) => {
    if (!isAuthenticated) {
      toast.error('Please log in to invite teammates.');
      return;
    }
    setSelectedStudent(student);
    setIsInviteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-violet-400" />
            Find Hackathon Builders
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover student developers, designers, and researchers seeking hackathon teams.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, skills, bio, or branch..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div>
            <input
              type="text"
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              placeholder="Filter by campus (e.g. Stanford, MIT)..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
            />
          </div>
        </div>

        {/* Experience Dropdown & Skill Filter Cloud */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              Experience:
            </span>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mr-1">
              Skill:
            </span>
            {SKILL_TAGS.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  selectedSkill === skill
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Meta Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Found <strong>{students.length}</strong> active builder{students.length !== 1 ? 's' : ''}
        </span>
        {(searchTerm || collegeFilter || selectedExperience !== 'All' || selectedSkill) && (
          <button
            onClick={handleResetFilters}
            className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Reset filters
          </button>
        )}
      </div>

      {/* Grid of Student Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-60 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel text-center border border-slate-800 max-w-md mx-auto">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Builders Found</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            No students matched your search criteria. Try removing filters or searching for different tech skills.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map((student) => (
            <MemberCard
              key={student._id}
              student={student}
              onViewProfile={(s) => {
                setSelectedStudent(s);
                setIsProfileModalOpen(true);
              }}
              onInvite={handleInviteClick}
              canInvite={isAuthenticated}
            />
          ))}
        </div>
      )}

      {/* Profile Details Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedStudent}
        onInviteClick={handleInviteClick}
        canInvite={isAuthenticated}
      />

      {/* Invite Member to Team Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
};

export default FindMembersPage;
