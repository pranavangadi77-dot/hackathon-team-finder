import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
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
  Flame
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const stats = [
    { label: 'Active Student Builders', value: '14,200+' },
    { label: 'Hackathon Teams Formed', value: '3,800+' },
    { label: 'Avg Skill Gap Match Rate', value: '96.4%' },
    { label: 'Global Hackathons Supported', value: '450+' },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Your Builder Profile',
      desc: 'Showcase your technical stack, previous hackathon feats, campus, and project passions in a sleek profile.',
      icon: Code,
      badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    },
    {
      step: '02',
      title: 'Intelligent Skill-Gap Engine',
      desc: 'Our proprietary algorithm detects missing skills in teams (e.g., Python ML + React + Node.js) and pairs you automatically.',
      icon: Cpu,
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      step: '03',
      title: 'Send & Receive Join Pitches',
      desc: 'Pitch directly to team leads with personalized messages or accept student join requests with a single click.',
      icon: Users,
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      step: '04',
      title: 'Ship Winning Projects',
      desc: 'Form balanced, unstoppable squads before registration deadlines and build hackathon-winning prototypes.',
      icon: Trophy,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
  ];

  const featuredHackathons = [
    {
      name: 'HackMIT 2026',
      organizer: 'Massachusetts Institute of Technology',
      dates: 'Sept 18 - 20, 2026',
      category: 'General / AI & Hardware',
      prizes: '$50,000+ in prizes',
      badge: 'Premier',
    },
    {
      name: 'ETHGlobal San Francisco',
      organizer: 'ETHGlobal Community',
      dates: 'Oct 24 - 26, 2026',
      category: 'Web3 & Cryptography',
      prizes: '$125,000+ in bounties',
      badge: 'Hot',
    },
    {
      name: 'CalHacks 12.0',
      organizer: 'UC Berkeley',
      dates: 'Nov 06 - 08, 2026',
      category: 'World’s Largest Collegiate Hackathon',
      prizes: '$100,000+ prizes',
      badge: 'High Demand',
    },
    {
      name: 'TreeHacks 2026',
      organizer: 'Stanford University',
      dates: 'Feb 13 - 15, 2026',
      category: 'Health, Sustainability & Privacy',
      prizes: '$75,000+ in grants',
      badge: 'Trending',
    },
  ];

  const testimonials = [
    {
      name: 'Elena Rostova',
      college: 'Carnegie Mellon University',
      role: 'UI/UX Designer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      text: 'As a designer, I always struggled to find dependable backend developers before hackathons. HackMate paired me with two Go & Python engineers within 2 hours. We took 1st place at CalHacks!',
    },
    {
      name: 'Liam O’Connor',
      college: 'Trinity College Dublin',
      role: 'Distributed Systems Dev',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      text: 'The skill-gap recommendation engine is magical. It showed me teams that had frontend and ML locked down but were desperately missing Node & Redis telemetry. Perfect match.',
    },
    {
      name: 'Priya Patel',
      college: 'MIT',
      role: 'AI Researcher & Team Lead',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      text: 'Managing applicants through scattered Discord DMs was a nightmare. With HackMate, I vetted applicant skill profiles and accepted teammates in one clean dashboard.',
    },
  ];

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-8 shadow-lg shadow-violet-500/10 animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>AI-Powered Hackathon Team Formation Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            <span className="text-slate-400 font-normal">v1.0 Live</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
            Your Next Big Idea Needs{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              The Right Team.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop losing hackathons due to mismatched squads. HackMate analyzes your technical skills, fills team gaps, and matches you with complementary builders in minutes.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-xl shadow-violet-600/25 transition duration-200 active:scale-95 group"
            >
              <span>Find Your Teammates</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
            </Link>
            <Link
              to={isAuthenticated ? '/create-team' : '/login'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 shadow-lg transition active:scale-95"
            >
              <span>Create a Team</span>
            </Link>
          </div>

          {/* Interactive Visual Network Preview */}
          <div className="mt-16 max-w-4xl mx-auto rounded-3xl glass-panel p-5 sm:p-7 border border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-slate-400 text-[11px]">hackmate-engine://realtime-match</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Live Algorithm Active
              </span>
            </div>

            {/* Simulated Live Skill Synergy Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 text-left">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Team Needs</span>
                <h4 className="text-sm font-bold text-white mt-1">NeuroPulse Health (HackMIT)</h4>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">React (Filled)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Python ML (Filled)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold animate-pulse">Node.js (Missing)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold animate-pulse">Backend (Missing)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/40 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">AI Match Engine</span>
                  <span className="text-xs font-black text-emerald-400">98% Synergy</span>
                </div>
                <div className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Identified candidate <strong className="text-white">Liam O'Connor</strong> filling 100% of missing backend & API gaps.
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-cyan-300 font-medium">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Instant Match Dispatched
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Matched Student</span>
                <h4 className="text-sm font-bold text-white mt-1">Liam O'Connor</h4>
                <p className="text-[11px] text-slate-400">Trinity College Dublin</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold">Node.js</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold">Express</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Redis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="p-4">
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {s.value}
                </p>
                <p className="text-xs font-medium text-slate-400 mt-1.5 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
            How HackMate Connects Builders
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            From solo developer to a fully staffed, complementary hackathon squad in under an hour.
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

      {/* Featured Hackathons */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
              Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
              Featured Hackathon Arenas
            </h2>
          </div>
          <Link
            to="/teams"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1.5"
          >
            Explore all open team positions
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredHackathons.map((hack, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-5 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {hack.badge}
                  </span>
                  <span className="text-[11px] text-amber-400 font-semibold">{hack.prizes}</span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{hack.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{hack.organizer}</p>
                <p className="text-[11px] text-slate-500 mt-2">{hack.dates}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <Link
                  to={`/teams?hackathonName=${encodeURIComponent(hack.name)}`}
                  className="w-full block text-center py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition"
                >
                  View Teams for this Hackathon
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Winning Stories from Hackers
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Thousands of students have found hackathon podiums through HackMate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{t.text}"
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-violet-500/30"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[11px] text-slate-400">{t.role} • {t.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-violet-900/40 via-indigo-900/40 to-slate-900/60 border border-violet-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            Ready to Build Your Hackathon Dream Team?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mt-3">
            Join thousands of student hackers, UI/UX designers, and ML researchers already connecting on HackMate.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="px-8 py-3.5 rounded-2xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-100 shadow-xl shadow-white/10 transition active:scale-95"
            >
              Get Started for Free
            </Link>
            <Link
              to="/teams"
              className="px-8 py-3.5 rounded-2xl text-xs font-semibold text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition"
            >
              Browse Open Teams
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
