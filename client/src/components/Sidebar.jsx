import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  Users,
  FolderGit2,
  Inbox,
  User,
  Sparkles,
  PlusCircle,
  LogOut,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore Teams', path: '/teams', icon: Compass },
    { name: 'Recommended Teams', path: '/recommendations', icon: Sparkles, badge: 'Smart' },
    { name: 'Create Team', path: '/create-team', icon: PlusCircle },
    { name: 'My Teams', path: '/my-teams', icon: FolderGit2 },
    { name: 'Join Requests', path: '/requests', icon: Inbox },
    { name: 'Find Teammates', path: '/members', icon: Users },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-xl h-[calc(100vh-4rem)] sticky top-16 p-4 justify-between">
      <div className="space-y-6">
        {/* Quick Action */}
        <div>
          <NavLink
            to="/create-team"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-md shadow-violet-600/20 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create a Team</span>
          </NavLink>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition group ${
                    isActive
                      ? 'bg-violet-600/15 text-violet-300 font-semibold border border-violet-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 group-hover:text-violet-400 transition" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile footer pill */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b5cf6&color=fff`
              }
              alt={user?.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-violet-500/30"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.college || 'Student'}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
