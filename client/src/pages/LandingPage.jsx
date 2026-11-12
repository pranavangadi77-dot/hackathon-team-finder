import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { teamApi } from '../services/api';
import {
  Sparkles,
  ArrowRight,
  Users,
  CheckCircle2,
  Cpu,
  Trophy,
  Layers,
  Zap,
  Globe,
  Compass,
  Code,
  ShieldCheck,
  Star,
  Flame,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Calendar,
  MapPin,
  Target
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [featuredTeams, setFeaturedTeams] = useState([]);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const res = await teamApi.getTeams({ sort: 'newest' });
        if (res.data?.teams) {
          setFeaturedTeams(res.data.teams.slice(0, 4));
        }
      } catch (err) {
        console.warn('Could not load live featured teams, showing defaults:', err.message);
      }
    };
    loadTeams();
  }, []);

  const stats = [
    { label: 'Active Student Builders', value: '15 Profiles' },
    { label: 'Formed Hackathon Teams', value: '8 Teams' },
    { label: 'Premier Hackathon Arenas', value: '4 Events' },
    { label: 'Skill Match Precision', value: '100% Deterministic' },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Your Student Profile',
      desc: 'Showcase your technical and non-technical skills, campus, academic year, and preferred roles.',
      icon: Code,
      badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    },
    {
      step: '02',
      title: 'Smart Skill-Gap Analysis',
      desc: 'Our deterministic weighted algorithm compares your skills directly against missing team requirements.',
      icon: Cpu,
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      step: '03',
      title: 'Send & Manage Join Requests',
      desc: 'Apply to high-match teams with custom pitches. Team leaders accept or reject applicants with 1-click.',
      icon: Users,
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      step: '04',
      title: 'Build & Win Hackathons',
      desc: 'Join your complete, complementary squad under My Teams and ship podium-worthy projects before deadlines.',
      icon: Trophy,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
  ];

  const keyFeatures = [
    {
      title: 'Deterministic Match Scoring',
      desc: '70% Skill Match, 20% Preferred Role Match, 10% Availability. Mathematically verified recommendations.',
      icon: Target,
    },
    {
      title: 'Missing Skill Gap Highlighting',
      desc: 'Immediately see which skills a team already possesses versus the critical missing skills they urgently need.',
      icon: Zap,
    },
    {
      title: 'Comprehensive Profiles',
      desc: 'Showcase GitHub, LinkedIn, portfolio links, past hackathon achievements, and selectable technical tag clouds.',
      icon: Code,
    },
    {
      title: 'Join Request Workflow',
      desc: 'Two-way request pipeline with automatic applicant notifications and capacity enforcement.',
      icon: Users,
    },
    {
      title: 'Real-time In-App Notifications',
      desc: 'Instant notifications when your application is reviewed, accepted, or when new teammates apply.',
      icon: Sparkles,
    },
    {
      title: 'My Teams Dashboard',
      desc: 'Unified management for all teams you lead or belong to, with roster member rosters and deadlines.',
      icon: Layers,
    },
  ];

  const defaultFeatured = [
    {
      _id: '1',
      teamName: 'AI Innovators',
      hackathonName: 'National Innovation Challenge 2026',
      description: 'Building an enterprise-scale autonomous research agent that orchestrates multi-agent debate and document synthesis.',
      college: 'Stanford University',
      missingSkills: ['Python', 'Backend Development'],
      requiredSkills: ['React', 'UI/UX Design', 'Python', 'Backend Development'],
      availablePositions: 2,
      maxMembers: 4,
    },
    {
      _id: '2',
      teamName: 'Web Wizards',
      hackathonName: 'Smart India Hackathon 2026',
      description: 'An interactive infinite whiteboarding canvas with zero-latency synchronization and integrated code sandboxes.',
      college: 'Trinity College Dublin',
      missingSkills: ['React', 'MongoDB'],
      requiredSkills: ['Node.js', 'Express.js', 'React', 'MongoDB'],
      availablePositions: 3,
      maxMembers: 4,
    },
    {
      _id: '3',
      teamName: 'Quantum Coders',
      hackathonName: 'Global AI & Web3 Hackathon',
      description: 'Emulating quantum annealing algorithms to solve NP-hard financial portfolio rebalancing in milliseconds.',
      college: 'UC Berkeley',
      missingSkills: ['Python', 'Data Science'],
      requiredSkills: ['Backend Development', 'Database Development', 'Python', 'Data Science'],
      availablePositions: 2,
      maxMembers: 4,
    },
    {
      _id: '4',
      teamName: 'HealthTech Squad',
      hackathonName: 'HealthTech Breakthrough Summit',
      description: 'A mobile edge audio analyzer detecting slurred speech biomarkers during emergency 911 calls.',
      college: 'MIT',
      missingSkills: ['Machine Learning', 'UI/UX Design'],
      requiredSkills: ['Python', 'Backend Development', 'Machine Learning', 'UI/UX Design'],
      availablePositions: 2,
      maxMembers: 4,
    },
  ];

  const displayFeatured = featuredTeams.length > 0 ? featuredTeams : defaultFeatured;

  return (
    <div className="min-h-screen bg-[#07090E] flex flex-col selection:bg-violet-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/20 to-cyan-400/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-8 shadow-lg shadow-violet-500/10">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Smart Team Recommendation System</span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            <span className="text-slate-400 font-normal">Full-Stack MERN Platform</span>
          </div>

          {/* Headline - Exact required text */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Hackathon Team.
            </span>
          </h1>

          {/* Supporting description - Exact required text */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect with talented students, discover complementary skills and build winning hackathon teams.
          </p>

          {/* Primary & Secondary CTAs - Exact required labels */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/teams' : '/register'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-xl shadow-violet-600/25 transition duration-200 active:scale-95 group"
            >
              <span>Find Your Team</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
            </Link>
            <Link
              to={isAuthenticated ? '/create-team' : '/login'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 shadow-lg transition active:scale-95"
            >
              <span>Create a Team</span>
            </Link>
          </div>

          {/* Interactive Visual Network Preview */}
          <div className="mt-16 max-w-4xl mx-auto rounded-3xl glass-panel p-5 sm:p-7 border border-slate-800 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-slate-400 text-[11px]">algorithm://smart-recommendation-engine</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Deterministic Scoring Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Team Need</span>
                <h4 className="text-sm font-bold text-white mt-1">AI Innovators</h4>
                <p className="text-[11px] text-slate-400">National Innovation Challenge</p>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">React (Filled)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">UI/UX (Filled)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold animate-pulse">Python (Missing)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold animate-pulse">Backend (Missing)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/40 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">Matching Formula</span>
                  <span className="text-xs font-black text-emerald-400">100% Match</span>
                </div>
                <div className="mt-2 text-xs text-slate-300 leading-relaxed font-mono">
                  (Skill 70% + Role 20% + Avail 10%)
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  Candidate Liam covers 2/2 missing skills + matches open Backend Developer role.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-cyan-300 font-medium">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Direct Recommendation Ready
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Candidate Student</span>
                <h4 className="text-sm font-bold text-white mt-1">Liam O’Connor</h4>
                <p className="text-[11px] text-slate-400">Trinity College Dublin</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold">Python</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold">Backend Dev</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Node.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demonstration Statistics Section */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
              Demonstration Platform Metrics (Seeded Collegiate Evaluation Dataset)
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800/60">
                <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {s.value}
                </p>
                <p className="text-xs font-medium text-slate-400 mt-1.5 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
            How HackathonTeam Finder Works
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            From solo student builder to a balanced, fully staffed hackathon squad before registration deadlines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-3xl p-6 border border-slate-800 relative group"
              >
                <span className="text-3xl font-black text-slate-800 group-hover:text-violet-500/30 transition duration-300 absolute top-5 right-6">
                  {item.step}
                </span>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 ${item.badgeColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
            Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
            Engineered for Hackathon Winners
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Everything students and team leads need to discover complementary partners and form winning teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keyFeatures.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Teams Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase tracking-wider">
              Explore Available Teams
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
              Featured Hackathon Teams
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real teams currently looking for members with complementary missing skills.
            </p>
          </div>
          <Link
            to="/teams"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1.5"
          >
            Explore all open teams
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayFeatured.map((team, idx) => (
            <div key={team._id || idx} className="glass-card rounded-3xl p-5 border border-slate-800 flex flex-col justify-between hover:border-violet-500/40 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    {team.hackathonName}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {team.availablePositions || 2} Open
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mt-1">{team.teamName || team.name}</h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {team.college || 'University'}
                </p>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {team.description}
                </p>

                {/* Missing Skills highlight */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1 mb-1.5">
                    <Target className="w-3 h-3" /> Missing Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(team.missingSkills || []).map((ms, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/20 font-medium">
                        {ms}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <Link
                  to={isAuthenticated ? '/teams' : '/login'}
                  className="w-full block text-center py-2 rounded-xl text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition"
                >
                  View Team Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-violet-900/40 via-indigo-900/40 to-slate-900/60 border border-violet-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            Ready to Build Your Hackathon Dream Team?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mt-3">
            Join collegiate builders, UI/UX designers, backend engineers, and ML researchers already collaborating on HackathonTeam Finder.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="px-8 py-3.5 rounded-2xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-100 shadow-xl shadow-white/10 transition active:scale-95"
            >
              Sign Up for Free
            </Link>
            <Link
              to="/teams"
              className="px-8 py-3.5 rounded-2xl text-xs font-semibold text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition"
            >
              Explore All Teams
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
