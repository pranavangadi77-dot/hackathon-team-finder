import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import TeamCard from '../components/TeamCard';
import JoinRequestModal from '../components/JoinRequestModal';
import TeamDetailsModal from '../components/TeamDetailsModal';
import {
  Search,
  Filter,
  Sparkles,
  Compass,
  SlidersHorizontal,
  X,
  Loader2,
  Calendar,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'All',
  'AI & Machine Learning',
  'Web3 & Blockchain',
  'FinTech',
  'HealthTech & MedTech',
  'EdTech',
  'Cybersecurity',
  'IoT & Smart Hardware',
  'Open Innovation',
];

const SKILL_FILTERS = [
  'React', 'Python', 'Machine Learning', 'Node.js',
  'Solidity', 'Go', 'Figma', 'Flutter', 'UI/UX Design', 'PostgreSQL'
];

const DiscoverTeamsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [hackathonFilter, setHackathonFilter] = useState(searchParams.get('hackathonName') || '');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [openOnly, setOpenOnly] = useState(true);
  const [sortOption, setSortOption] = useState('newest');

  // Requests state
  const [pendingRequestIds, setPendingRequestIds] = useState([]);

  // Modals state
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Load user's outgoing pending requests
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const { data } = await api.get('/requests/outgoing');
        if (data.success) {
          const pIds = (data.requests || [])
            .filter((r) => r.status === 'Pending')
            .map((r) => (r.team?._id ? r.team._id.toString() : r.team.toString()));
          setPendingRequestIds(pIds);
        }
      } catch {
        // guest or non-auth
      }
    };
    fetchMyRequests();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm.trim()) params.append('q', searchTerm.trim());
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (hackathonFilter.trim()) params.append('hackathonName', hackathonFilter.trim());
      if (selectedSkills.length > 0) params.append('skill', selectedSkills.join(','));
      if (openOnly) params.append('openPositionsOnly', 'true');
      if (sortOption) params.append('sort', sortOption);

      const { data } = await api.get(`/teams?${params.toString()}`);
      if (data.success) {
        setTeams(data.teams || []);
      }
    } catch (err) {
      toast.error('Failed to load teams list.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTeams();
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory, hackathonFilter, selectedSkills, openOnly, sortOption]);

  const toggleSkillFilter = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setHackathonFilter('');
    setSelectedSkills([]);
    setOpenOnly(true);
    setSortOption('newest');
  };

  const handleRequestSent = (teamId) => {
    setPendingRequestIds((prev) => [...prev, teamId]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-violet-400" />
            Discover Hackathon Teams
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse open team openings, filter by your tech stack, and pitch to join.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="newest">Recently Published</option>
            <option value="deadline">Approaching Deadline</option>
            <option value="vacancies">Most Open Positions</option>
          </select>
        </div>
      </div>

      {/* Filter / Search Panel */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        {/* Search input + Hackathon filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by team name, project idea, problem keywords..."
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
              value={hackathonFilter}
              onChange={(e) => setHackathonFilter(e.target.value)}
              placeholder="Filter by hackathon (e.g. HackMIT)..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mr-1 flex-shrink-0">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Tag Cloud Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mr-1">
            Seeking Skills:
          </span>
          {SKILL_FILTERS.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkillFilter(skill)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {isSelected ? `✓ ${skill}` : `+ ${skill}`}
              </button>
            );
          })}

          {/* Open positions toggle */}
          <label className="ml-auto inline-flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(e) => setOpenOnly(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-violet-600 focus:ring-violet-500 w-3.5 h-3.5"
            />
            <span>Open spots only</span>
          </label>
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong>{teams.length}</strong> team opening{teams.length !== 1 ? 's' : ''}
        </span>
        {(searchTerm || selectedCategory !== 'All' || hackathonFilter || selectedSkills.length > 0 || !openOnly) && (
          <button
            onClick={handleResetFilters}
            className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition"
          >
            <X className="w-3 h-3" />
            Reset all filters
          </button>
        )}
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel text-center border border-slate-800 max-w-md mx-auto">
          <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Teams Match Your Filters</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Try broadening your search keywords, clearing selected skill tags, or publish a new team yourself.
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
          {teams.map((team) => (
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
              userPendingRequests={pendingRequestIds}
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

export default DiscoverTeamsPage;
