import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
  GraduationCap,
  Award,
  Github,
  Linkedin,
  Globe,
  Tag,
  Heart,
  UserCheck,
  Edit,
  Save,
  X,
  Plus,
  Loader2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const COMMON_TECH = [
  'React', 'Node.js', 'Python', 'TypeScript', 'Machine Learning',
  'Solidity', 'Go', 'Figma', 'UI/UX Design', 'Flutter', 'Next.js',
  'PostgreSQL', 'Docker', 'FastAPI', 'AWS', 'C++', 'Tailwind CSS'
];

const COMMON_NON_TECH = [
  'Product Pitching', 'Agile / Scrum', 'UI Wireframing', 'Market Research',
  'Public Speaking', 'Technical Writing', 'Design Systems', 'Business Strategy'
];

const COMMON_INTERESTS = [
  'AI & Machine Learning', 'Web3 & Blockchain', 'HealthTech', 'FinTech',
  'Climate & CleanTech', 'EdTech', 'Cybersecurity', 'IoT & Robotics'
];

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    branch: '',
    yearOfStudy: '3rd Year',
    avatar: '',
    experience: 'Intermediate (1-3 hackathons)',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    bio: '',
  });

  const [techSkills, setTechSkills] = useState([]);
  const [techInput, setTechInput] = useState('');

  const [nonTechSkills, setNonTechSkills] = useState([]);
  const [nonTechInput, setNonTechInput] = useState('');

  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        college: user.college || '',
        branch: user.branch || '',
        yearOfStudy: user.yearOfStudy || '3rd Year',
        avatar: user.avatar || '',
        experience: user.experience || 'Intermediate (1-3 hackathons)',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        portfolioUrl: user.portfolioUrl || '',
        bio: user.bio || '',
      });
      setTechSkills(user.technicalSkills || []);
      setNonTechSkills(user.nonTechnicalSkills || []);
      setInterests(user.interests || []);
    }
  }, [user]);

  const handleAddTech = (skill) => {
    const s = (skill || techInput).trim();
    if (s && !techSkills.includes(s)) {
      setTechSkills([...techSkills, s]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (s) => setTechSkills(techSkills.filter((item) => item !== s));

  const handleAddNonTech = (skill) => {
    const s = (skill || nonTechInput).trim();
    if (s && !nonTechSkills.includes(s)) {
      setNonTechSkills([...nonTechSkills, s]);
      setNonTechInput('');
    }
  };

  const handleRemoveNonTech = (s) => setNonTechSkills(nonTechSkills.filter((item) => item !== s));

  const handleAddInterest = (item) => {
    const s = (item || interestInput).trim();
    if (s && !interests.includes(s)) {
      setInterests([...interests, s]);
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (s) => setInterests(interests.filter((item) => item !== s));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.college.trim()) {
      toast.error('Full Name and College are required.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        technicalSkills: techSkills,
        nonTechnicalSkills: nonTechSkills,
        interests,
      };

      const { data } = await api.put('/users/profile', payload);
      if (data.success) {
        toast.success('Profile updated successfully!');
        updateUser(data.user);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-violet-400" />
          My Student Builder Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Keep your skills and interests fresh so teams can find and recommend you instantly.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar & Basic Info Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-800">
            <img
              src={
                formData.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=8b5cf6&color=fff`
              }
              alt="Avatar Preview"
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-violet-500/40 shadow-xl flex-shrink-0"
            />
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Profile Avatar Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/... or GitHub avatar URL"
                className="w-full px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Paste an image URL, or leave blank to use your generated initials avatar.
              </span>
            </div>
          </div>

          {/* Core Profile Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                College / University *
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Major / Department
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                placeholder="e.g. Electrical Engineering & CS"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Year of Study
              </label>
              <select
                value={formData.yearOfStudy}
                onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Graduate">Graduate / Masters / PhD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Hackathon Experience Level
            </label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
            >
              <option value="Beginner (0 hackathons)">Beginner (0 hackathons, first time)</option>
              <option value="Intermediate (1-3 hackathons)">Intermediate (1-3 hackathons)</option>
              <option value="Advanced (4+ hackathons)">Advanced (4+ hackathons)</option>
              <option value="Hackathon Winner / Mentor">Hackathon Winner / Mentor</option>
            </select>
          </div>

          {/* Technical Skills Section */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-violet-400" />
              Technical Skills (Weighted in Matching Engine)
            </label>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 min-h-[38px]">
              {techSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-violet-600/30 text-violet-200 border border-violet-500/40"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(skill)}
                    className="text-violet-300 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="Type skill & press Enter (e.g. PyTorch, Rust, Solidity)..."
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
              />
              <button
                type="button"
                onClick={() => handleAddTech()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1 pt-1 text-[11px] text-slate-500">
              <span>Suggestions:</span>
              {COMMON_TECH.slice(0, 10).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddTech(s)}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  +{s}
                </button>
              ))}
            </div>
          </div>

          {/* Non-Technical Skills */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Non-Technical Skills & Specialties
            </label>

            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 min-h-[38px]">
              {nonTechSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveNonTech(skill)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={nonTechInput}
                onChange={(e) => setNonTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNonTech();
                  }
                }}
                placeholder="e.g. Pitching, Design Systems, Agile..."
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
              />
              <button
                type="button"
                onClick={() => handleAddNonTech()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Areas of Interest */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" />
              Hackathon Interests & Track Focus
            </label>

            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 min-h-[38px]">
              {interests.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-rose-500/15 text-rose-300 border border-rose-500/25"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(item)}
                    className="text-rose-300 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
                placeholder="e.g. FinTech, Multimodal AI, Zero Knowledge..."
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
              />
              <button
                type="button"
                onClick={() => handleAddInterest()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              External Builder Links
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                  <Github className="w-3.5 h-3.5 text-slate-400" /> GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" /> Portfolio URL
                </label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://portfolio.dev"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Short Bio */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Short Introduction / Bio
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell other students what you enjoy building and what roles you excel in during hackathons..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-600/30 transition disabled:opacity-50 active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
