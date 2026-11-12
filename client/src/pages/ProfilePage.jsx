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
  CheckCircle2,
  Briefcase,
  Layers,
  BookOpen,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

// Exact technical skill list specified in Prompt Section 5.C
const PREDEFINED_TECH_SKILLS = [
  'Python', 'Java', 'C++', 'JavaScript', 'React', 'Node.js',
  'Express.js', 'MongoDB', 'SQL', 'Machine Learning', 'Deep Learning',
  'Artificial Intelligence', 'Data Science', 'HTML', 'CSS',
  'UI Development', 'Backend Development', 'API Development',
  'Cloud Computing', 'Cybersecurity', 'Flutter', 'Android Development'
];

// Exact non-technical skill list specified in Prompt Section 5.C
const PREDEFINED_NON_TECH_SKILLS = [
  'UI/UX Design', 'Leadership', 'Communication', 'Presentation',
  'Research', 'Project Management', 'Business Strategy',
  'Marketing', 'Pitching', 'Documentation'
];

const PREDEFINED_ROLES = [
  'Backend Developer', 'Frontend Developer', 'Full Stack Developer',
  'ML Engineer', 'Data Scientist', 'UI/UX Designer', 'Mobile Developer',
  'Cloud Engineer', 'Security Analyst', 'Team Lead'
];

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    department: '',
    branch: '',
    year: '3rd Year',
    yearOfStudy: '3rd Year',
    avatar: '',
    experience: 'Intermediate (1-3 hackathons)',
    experienceLevel: 'Intermediate',
    github: '',
    githubUrl: '',
    linkedin: '',
    linkedinUrl: '',
    portfolio: '',
    portfolioUrl: '',
    availability: 'Available',
    bio: '',
  });

  const [techSkills, setTechSkills] = useState([]);
  const [techInput, setTechInput] = useState('');

  const [nonTechSkills, setNonTechSkills] = useState([]);
  const [nonTechInput, setNonTechInput] = useState('');

  const [preferredRoles, setPreferredRoles] = useState([]);
  const [roleInput, setRoleInput] = useState('');

  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        college: user.college || '',
        department: user.department || user.branch || '',
        branch: user.branch || user.department || '',
        year: user.year || user.yearOfStudy || '3rd Year',
        yearOfStudy: user.yearOfStudy || user.year || '3rd Year',
        avatar: user.avatar || '',
        experience: user.experience || 'Intermediate (1-3 hackathons)',
        experienceLevel: user.experienceLevel || 'Intermediate',
        github: user.github || user.githubUrl || '',
        githubUrl: user.githubUrl || user.github || '',
        linkedin: user.linkedin || user.linkedinUrl || '',
        linkedinUrl: user.linkedinUrl || user.linkedin || '',
        portfolio: user.portfolio || user.portfolioUrl || '',
        portfolioUrl: user.portfolioUrl || user.portfolio || '',
        availability: user.availability || 'Available',
        bio: user.bio || '',
      });
      setTechSkills(user.technicalSkills || []);
      setNonTechSkills(user.nonTechnicalSkills || []);
      setPreferredRoles(user.preferredRoles || ['Full Stack Developer']);
      setInterests(user.interests || ['AI & Machine Learning', 'Web Development']);
    }
  }, [user]);

  // Tech skills handlers
  const handleAddTech = (s) => {
    const skill = (s || techInput).trim();
    if (skill && !techSkills.includes(skill)) {
      setTechSkills([...techSkills, skill]);
      setTechInput('');
    }
  };
  const handleRemoveTech = (s) => setTechSkills(techSkills.filter((item) => item !== s));

  // Non-tech skills handlers
  const handleAddNonTech = (s) => {
    const skill = (s || nonTechInput).trim();
    if (skill && !nonTechSkills.includes(skill)) {
      setNonTechSkills([...nonTechSkills, skill]);
      setNonTechInput('');
    }
  };
  const handleRemoveNonTech = (s) => setNonTechSkills(nonTechSkills.filter((item) => item !== s));

  // Roles handlers
  const handleAddRole = (r) => {
    const role = (r || roleInput).trim();
    if (role && !preferredRoles.includes(role)) {
      setPreferredRoles([...preferredRoles, role]);
      setRoleInput('');
    }
  };
  const handleRemoveRole = (r) => setPreferredRoles(preferredRoles.filter((item) => item !== r));

  // Interests handlers
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
        branch: formData.department,
        yearOfStudy: formData.year,
        githubUrl: formData.github,
        linkedinUrl: formData.linkedin,
        portfolioUrl: formData.portfolio,
        technicalSkills: techSkills,
        nonTechnicalSkills: nonTechSkills,
        preferredRoles,
        interests,
      };

      const { data } = await api.put('/users/me', payload);
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-violet-400" />
          My Student Builder Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Maintain your verified skills, experience, and preferred roles for real-time recommendation scoring.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview & URL */}
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
                Profile Avatar Photo URL (Optional)
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/... or GitHub avatar URL"
                className="w-full px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Paste an image URL, or leave blank to automatically display initial letters.
              </span>
            </div>
          </div>

          {/* Academic & Personal Details */}
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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500 transition"
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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Department / Branch
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value, branch: e.target.value })}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Academic Year of Study
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value, yearOfStudy: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500 transition"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>

          {/* Short Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Short Bio / Hackathon Pitch
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell other builders about your core strengths, past hackathon feats, and what projects you are eager to build..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          {/* Experience & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Experience Level
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value, experienceLevel: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500 transition"
              >
                <option value="Beginner (0 hackathons)">Beginner (0 hackathons)</option>
                <option value="Intermediate (1-3 hackathons)">Intermediate (1-3 hackathons)</option>
                <option value="Advanced (4+ hackathons)">Advanced (4+ hackathons)</option>
                <option value="Hackathon Winner / Mentor">Hackathon Winner / Mentor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Availability Status
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500 transition"
              >
                <option value="Available">Available (Looking for Team)</option>
                <option value="Joined Team">Joined Team</option>
                <option value="Busy">Busy (Not taking requests)</option>
              </select>
            </div>
          </div>

          {/* Technical Skills Category */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-violet-400" />
                Technical Skills ({techSkills.length} selected)
              </label>
              <span className="text-[11px] text-slate-500">Primary matching factor (70% weight)</span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 min-h-[50px] mb-2">
              {techSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-600/20 text-violet-300 border border-violet-500/30"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(skill)}
                    className="hover:text-rose-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

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
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
                placeholder="Add custom technical skill & press Enter"
              />
              <button
                type="button"
                onClick={() => handleAddTech()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Predefined Technical Skills Grid */}
            <div className="mt-2.5 flex flex-wrap gap-1">
              {PREDEFINED_TECH_SKILLS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAddTech(item)}
                  disabled={techSkills.includes(item)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                    techSkills.includes(item)
                      ? 'opacity-30 cursor-default bg-slate-900 border-slate-800 text-slate-600'
                      : 'bg-slate-900/80 hover:bg-violet-950/40 text-slate-400 hover:text-violet-300 border-slate-800'
                  }`}
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>

          {/* Non-Technical Skills Category */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Non-Technical Skills ({nonTechSkills.length} selected)
              </label>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 min-h-[46px] mb-2">
              {nonTechSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveNonTech(skill)}
                    className="hover:text-rose-400 transition"
                  >
                    <X className="w-3 h-3" />
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
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
                placeholder="Add custom non-technical skill & press Enter"
              />
              <button
                type="button"
                onClick={() => handleAddNonTech()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1">
              {PREDEFINED_NON_TECH_SKILLS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAddNonTech(item)}
                  disabled={nonTechSkills.includes(item)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                    nonTechSkills.includes(item)
                      ? 'opacity-30 cursor-default bg-slate-900 border-slate-800 text-slate-600'
                      : 'bg-slate-900/80 hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-300 border-slate-800'
                  }`}
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Roles */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-amber-400" />
              Preferred Team Roles ({preferredRoles.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 min-h-[46px] mb-2">
              {preferredRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="hover:text-rose-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {PREDEFINED_ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleAddRole(r)}
                  disabled={preferredRoles.includes(r)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                    preferredRoles.includes(r)
                      ? 'opacity-30 cursor-default bg-slate-900 border-slate-800 text-slate-600'
                      : 'bg-slate-900/80 hover:bg-amber-950/40 text-slate-400 hover:text-amber-300 border-slate-800'
                  }`}
                >
                  + {r}
                </button>
              ))}
            </div>
          </div>

          {/* Social Profiles & External Links */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Social Links & Portfolios
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Github className="w-3.5 h-3.5" /> GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value, githubUrl: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Portfolio URL
                </label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value, portfolioUrl: e.target.value })}
                  placeholder="https://portfolio.dev"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 transition active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
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
