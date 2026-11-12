import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Github, Twitter, Linkedin, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#07090E] text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              HackathonTeam <span className="text-violet-400">Finder</span>
            </span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed">
            The intelligent hackathon team formation platform bridging technical skill gaps and assembling winning hackathon squads worldwide.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-cyan-400 transition">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-blue-400 transition">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Explore</h4>
          <ul className="space-y-2">
            <li><Link to="/teams" className="hover:text-white transition">Explore Teams</Link></li>
            <li><Link to="/members" className="hover:text-white transition">Find Teammates</Link></li>
            <li><Link to="/recommendations" className="hover:text-white transition flex items-center gap-1.5 text-violet-400">Smart Recommendation Engine <Sparkles className="w-3 h-3" /></Link></li>
            <li><Link to="/create-team" className="hover:text-white transition">Create a Team</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Featured Hackathons</h4>
          <ul className="space-y-2 text-slate-400">
            <li>National Innovation Challenge 2026</li>
            <li>Smart India Hackathon 2026</li>
            <li>Global AI & Web3 Hackathon</li>
            <li>HealthTech Breakthrough Summit</li>
            <li>CalHacks & TreeHacks Collegiate</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Platform Architecture</h4>
          <p className="text-xs leading-relaxed text-slate-400 mb-3">
            Designed for collegiate project evaluations, production full-stack MERN deployments, and live demonstration.
          </p>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>API Engine: <strong>v1.0.0 Online</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
        <p>© 2026 HackathonTeam Finder. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> for the student developer community.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
