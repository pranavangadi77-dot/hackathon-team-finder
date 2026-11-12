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
  ArrowRight,
  Target,
  Shield,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

const COMMON_SKILLS = [
  'Python', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Machine Learning',
  'Deep Learning', 'Data Science', 'TypeScript', 'UI/UX Design', 'Flutter',
  'Android Development', 'Cybersecurity', 'Cloud Computing', 'SQL', 'C++', 'Java'
];

const PREDEFINED_ROLES = [
  'Backend Developer', 'Frontend Developer', 'Full Stack Developer',
  'ML Engineer', 'Data Scientist', 'UI/UX Designer', 'Mobile Developer',
  'Cloud Engineer', 'Security Analyst', 'Team Lead'
];

const POPULAR_HACKATHONS = [
  'National Innovation Challenge 2026',
  'Smart India Hackathon 2026',
  'Global AI & Web3 Hackathon',
  'HealthTech Breakthrough Summit',
  'CalHacks 12.0',
  'TreeHacks 2026',
  'HackMIT 2026',
];

const CreateTeamPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    teamName: '',
    name: '',
    projectTitle: '',
    hackathonName: '',
    category: 'AI & Machine Learning',
    description: '',
    college: '',
    maximumMembers: 4,
    preferredExperience: 'Intermediate',
    hackathonDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hackathonDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    visibility: 'Public',
    contactInfo: '',
  });

  const [missingSkills, setMissingSkills] = useState(['Python', 'Backend Development']);
  const [missingInput, setMissingInput] = useState('');

  const [requiredSkills, setRequiredSkills] = useState(['React', 'Python', 'Backend Development']);
  const [requiredInput, setRequiredInput] = useState('');

  const [availableRoles, setAvailableRoles] = useState(['Backend Developer']);
  const [roleInput, setRoleInput] = useState('');

  const [submitting, setSubmitting] = useState(false);

  // Missing Skills handlers
  const handleAddMissingSkill = (s) => {
    const skill = (s || missingInput).trim();
    if (skill && !missingSkills.includes(skill)) {
      setMissingSkills([...missingSkills, skill]);
      setMissingInput('');
      // Also ensure it is in requiredSkills
      if (!requiredSkills.includes(skill)) {
        setRequiredSkills([...requiredSkills, skill]);
      }
    }
  };

  const handleRemoveMissingSkill = (skill) => {
    setMissingSkills(missingSkills.filter((s) => s !== skill));
  };

  // Required Skills handlers
  const handleAddRequiredSkill = (s) => {
    const skill = (s || requiredInput).trim();
    if (skill && !requiredSkills.includes(skill)) {
      setRequiredSkills([...requiredSkills, skill]);
      setRequiredInput('');
    }
  };

  const handleRemoveRequiredSkill = (skill) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  // Available Roles handlers
  const handleAddRole = (r) => {
    const role = (r || roleInput).trim();
    if (role && !availableRoles.includes(role)) {
      setAvailableRoles([...availableRoles, role]);
      setRoleInput('');
    }
  };

  const handleRemoveRole = (role) => {
    setAvailableRoles(availableRoles.filter((r) => r !== role));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tName = formData.teamName.trim() || formData.name.trim();
    if (!tName || !formData.hackathonName.trim() || !formData.description.trim()) {
      toast.error('Please fill in Team Name, Hackathon Name, and Project Description.');
      return;
    }

    if (missingSkills.length === 0) {
      toast.error('Please specify at least one missing skill needed from prospective teammates.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        teamName: tName,
        name: tName,
        maximumMembers: Number(formData.maximumMembers),
        maxMembers: Number(formData.maximumMembers),
        missingSkills,
        requiredSkills: requiredSkills.length > 0 ? requiredSkills : missingSkills,
        availableRoles,
        applicationDeadline: formData.hackathonDeadline,
        eventDate: formData.hackathonDate,
      };

      const { data } = await api.post('/teams', payload);

      if (data.success) {
        toast.success(`Team "${tName}" created and published successfully!`);
        navigate('/teams');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create team opening.';
      toast.error(msg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <PlusCircle className="w-7 h-7 text-violet-400" />
          Create Hackathon Team
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Specify the missing skills and open roles your team needs. Our algorithm will immediately recommend your squad to matching students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Team Information */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" />
              1. Team & Hackathon Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Team Name *
              </label>
              <input
                type="text"
                required
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value, name: e.target.value })}
                placeholder="e.g. Quantum Innovators"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hackathon Name *
              </label>
              <input
                type="text"
                required
                list="popular-hackathons"
                value={formData.hackathonName}
                onChange={(e) => setFormData({ ...formData, hackathonName: e.target.value })}
                placeholder="e.g. National Innovation Challenge 2026"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
              />
              <datalist id="popular-hackathons">
                {POPULAR_HACKATHONS.map((h) => (
                  <option key={h} value={h} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Description / Problem Statement *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value, problemStatement: e.target.value })}
              placeholder="Describe what your team is building, the technical challenge, and what makes your approach unique..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                College / University
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. Stanford University"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Registration Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.hackathonDeadline}
                onChange={(e) => setFormData({ ...formData, hackathonDeadline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hackathon Event Date
              </label>
              <input
                type="date"
                value={formData.hackathonDate}
                onChange={(e) => setFormData({ ...formData, hackathonDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Missing Skills & Open Positions Configuration */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-400" />
              2. Missing Skills Needed (Recommendation Fuel)
            </h2>
            <span className="text-[11px] font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
              Algorithm Target
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Specify the exact technical skills that are missing from your current team. Candidates with these skills will receive top match scores.
          </p>

          <div>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 min-h-[50px]">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveMissingSkill(skill)}
                    className="hover:text-white transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={missingInput}
                onChange={(e) => setMissingInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMissingSkill();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
                placeholder="Add missing skill (e.g. Node.js, MongoDB, PyTorch) & press Enter"
              />
              <button
                type="button"
                onClick={() => handleAddMissingSkill()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {COMMON_SKILLS.map((common) => (
                <button
                  key={common}
                  type="button"
                  onClick={() => handleAddMissingSkill(common)}
                  disabled={missingSkills.includes(common)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                    missingSkills.includes(common)
                      ? 'opacity-30 cursor-default bg-slate-900 border-slate-800 text-slate-600'
                      : 'bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border-slate-800'
                  }`}
                >
                  + {common}
                </button>
              ))}
            </div>
          </div>

          {/* Available Roles */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Available Roles Open in Team
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 min-h-[46px] mb-2">
              {availableRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="hover:text-white transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRole();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
                placeholder="Type open role (e.g. Backend Developer, UI/UX Designer) & press Enter"
              />
              <button
                type="button"
                onClick={() => handleAddRole()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {PREDEFINED_ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleAddRole(r)}
                  disabled={availableRoles.includes(r)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                    availableRoles.includes(r)
                      ? 'opacity-30 cursor-default bg-slate-900 border-slate-800 text-slate-600'
                      : 'bg-slate-900/80 hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-300 border-slate-800'
                  }`}
                >
                  + {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Capacity & Visibility Settings */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              3. Team Capacity & Visibility
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Maximum Team Size
              </label>
              <select
                value={formData.maximumMembers}
                onChange={(e) => setFormData({ ...formData, maximumMembers: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500 transition"
              >
                <option value={2}>2 Members (Solo Lead + 1 Partner)</option>
                <option value={3}>3 Members (Trio)</option>
                <option value={4}>4 Members (Standard Quad)</option>
                <option value={5}>5 Members</option>
                <option value={6}>6 Members</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Team Visibility
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500 transition"
              >
                <option value="Public">Public (Visible to All)</option>
                <option value="College Only">College Only</option>
                <option value="Private">Private (Invite Only)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contact Handle / Channel
              </label>
              <input
                type="text"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder="Discord, Telegram, or WhatsApp"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/teams')}
            className="px-6 py-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-xl shadow-violet-600/30 transition active:scale-95 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Team...</span>
              </>
            ) : (
              <>
                <span>Publish Hackathon Team</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeamPage;
