import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  PlusCircle,
  Users,
  Calendar,
  Tag,
  Briefcase,
  Award,
  Mail,
  X,
  Plus,
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const COMMON_SKILLS = [
  'React', 'Node.js', 'Python', 'Machine Learning', 'TypeScript',
  'Solidity', 'Go', 'Figma', 'UI/UX Design', 'Flutter',
  'FastAPI', 'Cybersecurity', 'PostgreSQL', 'Docker', 'AWS'
];

const CATEGORIES = [
  'AI & Machine Learning',
  'Web3 & Blockchain',
  'FinTech',
  'HealthTech & MedTech',
  'EdTech',
  'Cybersecurity',
  'IoT & Smart Hardware',
  'Sustainability & CleanTech',
  'Open Innovation',
];

const CreateTeamPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    projectTitle: '',
    hackathonName: '',
    category: 'AI & Machine Learning',
    description: '',
    problemStatement: '',
    maxMembers: 4,
    preferredExperience: 'Any',
    applicationDeadline: '',
    contactInfo: '',
  });

  const [requiredSkills, setRequiredSkills] = useState(['React', 'Python']);
  const [skillInput, setSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Set default deadline to 14 days from now
  useState(() => {
    const twoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    setFormData((prev) => ({
      ...prev,
      applicationDeadline: twoWeeks.toISOString().split('T')[0],
    }));
  });

  const handleAddSkill = (skillToAdd) => {
    const s = (skillToAdd || skillInput).trim();
    if (s && !requiredSkills.includes(s)) {
      setRequiredSkills([...requiredSkills, s]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.projectTitle.trim() || !formData.hackathonName.trim()) {
      toast.error('Please fill in team name, project title, and hackathon name.');
      return;
    }

    if (requiredSkills.length === 0) {
      toast.error('Please specify at least one required skill for your team opening.');
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.post('/teams', {
        ...formData,
        maxMembers: Number(formData.maxMembers),
        requiredSkills,
      });

      if (data.success) {
        toast.success('Hackathon team successfully created & published!');
        navigate('/my-teams');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create team opening.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Team Formation Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create & Publish a Hackathon Team
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Post your project problem statement, specify missing skill requirements, and find teammates before the registration cutoff.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Team & Hackathon Basics */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              1. Team & Hackathon Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. NeuroPulse Health, ZeroCarbon Labs"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Hackathon Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.hackathonName}
                  onChange={(e) => setFormData({ ...formData, hackathonName: e.target.value })}
                  placeholder="e.g. HackMIT 2026, ETHGlobal San Francisco"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  placeholder="e.g. AI-Powered Early Stroke Detection using Acoustic Sensors"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Project Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Problem Statement & Vision */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Award className="w-4 h-4" />
              2. Problem Statement & Project Description
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Problem Statement (What issue are you solving?) *
              </label>
              <textarea
                rows={3}
                required
                value={formData.problemStatement}
                onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                placeholder="Stroke victims often fail to recognize speech slurring early enough. Existing automated detection tools require expensive clinical setups..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Proposed Solution & Project Overview *
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="We are building an edge-audio model and lightweight mobile application that monitors acoustic biomarkers during 911 calls..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition resize-none"
              />
            </div>
          </div>

          {/* Section 3: Required Skills */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              3. Required Technical Skills
            </h3>

            <div>
              <p className="text-xs text-slate-400 mb-2">
                List the technical stacks your team needs. Our recommendation algorithm uses these to match you with ideal student candidates.
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[36px] p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                {requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-violet-600/30 text-violet-200 border border-violet-500/40"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-violet-300 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Input + Common suggestions */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Type a skill & press Enter (e.g. Machine Learning, Node.js)..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap items-center gap-1 mt-2 text-[11px] text-slate-500">
                <span>Quick add:</span>
                {COMMON_SKILLS.map((cs) => (
                  <button
                    key={cs}
                    type="button"
                    onClick={() => handleAddSkill(cs)}
                    className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  >
                    +{cs}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Team Capacity, Deadline & Contact */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              4. Logistics & Roster Capacity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Total Team Capacity (2 - 10) *
                </label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  required
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  You occupy 1 spot. Available to join: {Math.max(0, formData.maxMembers - 1)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Preferred Experience
                </label>
                <select
                  value={formData.preferredExperience}
                  onChange={(e) => setFormData({ ...formData, preferredExperience: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                >
                  <option value="Any">Any Experience Level</option>
                  <option value="Beginner Friendly">Beginner Friendly</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced / Hackathon Winners</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  required
                  value={formData.applicationDeadline}
                  onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contact Information (Discord tag, Telegram handle, or email) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="Discord: @username#1234, Telegram: @handle, or student@mit.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-600/30 transition disabled:opacity-50 active:scale-95"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing Team Opening...
                </>
              ) : (
                <>
                  <span>Publish Team Opening</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamPage;
