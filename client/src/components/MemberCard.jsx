import React from 'react';
import { GraduationCap, Award, Send, Eye, Github, Linkedin, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MemberCard = ({
  student,
  onViewProfile,
  onInvite,
  canInvite = false,
}) => {
  const { user } = useAuth();
  const isSelf = user?._id?.toString() === student._id?.toString();

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
      <div>
        {/* Top Header: Avatar, Name, College */}
        <div className="flex items-start gap-3.5">
          <img
            src={
              student.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'User')}&background=8b5cf6&color=fff`
            }
            alt={student.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-violet-500/30 flex-shrink-0 group-hover:ring-violet-500/60 transition shadow-md"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-violet-200 transition">
                {student.name}
              </h3>
              {isSelf && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                  You
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
              <GraduationCap className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
              <span className="truncate">{student.college}</span>
            </p>
          </div>
        </div>

        {/* Experience Pill */}
        <div className="mt-3 flex items-center gap-2">
          <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Award className="w-3 h-3" />
            {student.experience || 'Intermediate'}
          </span>
          {student.yearOfStudy && (
            <span className="text-[11px] text-slate-400">
              {student.yearOfStudy}
            </span>
          )}
        </div>

        {/* Bio */}
        {student.bio && (
          <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
            "{student.bio}"
          </p>
        )}

        {/* Technical Skills */}
        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Key Technical Skills:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {student.technicalSkills?.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-800"
              >
                {skill}
              </span>
            ))}
            {student.technicalSkills?.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-lg text-[10px] bg-slate-900 text-slate-400 border border-slate-800">
                +{student.technicalSkills.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center gap-2">
        <button
          onClick={() => onViewProfile(student)}
          className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition active:scale-98 flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </button>

        {!isSelf && (
          <button
            onClick={() => onInvite(student)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/20 transition active:scale-98 flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Invite</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
