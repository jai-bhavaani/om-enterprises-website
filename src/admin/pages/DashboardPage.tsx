import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  Users, 
  Mail, 
  Plus, 
  ArrowUpRight, 
  Image as ImageIcon,
  Sparkles,
  Phone,
  Calendar
} from 'lucide-react';
import { adminStore } from '../adminStore';

export const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState(() => adminStore.getProjects());
  const [messages, setMessages] = useState(() => adminStore.getMessages());
  const [team, setTeam] = useState(() => adminStore.getTeam());

  React.useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setProjects(adminStore.getProjects());
      setMessages(adminStore.getMessages());
      setTeam(adminStore.getTeam());
    });
    return unsubscribe;
  }, []);

  const completedCount = projects.filter(p => p.status === 'Completed').length;
  const inProgressCount = projects.filter(p => p.status === 'In Progress' || (p.status as any) === 'in progress').length;
  const upcomingCount = projects.filter(p => p.status === 'Upcoming').length;
  const unreadMessages = messages.filter(m => m.status === 'New');

  const stats = [
    { 
      label: 'Total Projects', 
      value: projects.length, 
      icon: FolderKanban, 
      color: 'text-white', 
      bg: 'bg-slate-800/80',
      border: 'border-slate-700'
    },
    { 
      label: 'Completed', 
      value: completedCount, 
      icon: CheckCircle2, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-950/20',
      border: 'border-emerald-900/50'
    },
    { 
      label: 'In Progress', 
      value: inProgressCount, 
      icon: Clock, 
      color: 'text-amber-400', 
      bg: 'bg-amber-950/20',
      border: 'border-amber-900/50'
    },
    { 
      label: 'Team Members', 
      value: team.length, 
      icon: Users, 
      color: 'text-blue-400', 
      bg: 'bg-blue-950/20',
      border: 'border-blue-900/50'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Fast Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f172a] border border-slate-800 p-4 sm:p-5 rounded-xl">
        <div>
          <h1 className="font-header text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide">
            Management Overview
          </h1>
          <p className="text-xs sm:text-sm text-concrete">
            Real-time portfolio metrics and active inquiry intake.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/projects?action=new"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-safety hover:bg-[#e05e00] text-black font-header font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-safety/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>

          <Link
            to="/admin/media"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-header font-semibold text-xs uppercase tracking-wider transition-colors border border-slate-700"
          >
            <ImageIcon className="w-4 h-4 text-safety" />
            <span>Media</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border ${stat.border} ${stat.bg} backdrop-blur-sm relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-concrete">
                  {stat.label}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className={`font-header text-3xl sm:text-4xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Inquiries & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Contact Inquiries */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-safety" />
              <h2 className="font-header text-lg font-bold uppercase text-white tracking-wide">
                Recent Inquiries
              </h2>
              {unreadMessages.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-safety text-black">
                  {unreadMessages.length} New
                </span>
              )}
            </div>

            <Link
              to="/admin/messages"
              className="text-xs text-safety hover:underline flex items-center gap-1 font-mono uppercase tracking-wider"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                className="p-3.5 rounded-lg bg-[#1e293b]/50 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-header text-sm font-bold text-white uppercase">
                      {msg.full_name}
                    </h3>
                    <p className="text-xs text-concrete flex items-center gap-1">
                      <span>{msg.project_location || 'Location unspecified'}</span>
                      &bull;
                      <span className="text-[11px]">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      msg.status === 'New'
                        ? 'bg-safety/20 text-safety border border-safety/40'
                        : 'bg-slate-800 text-concrete'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 font-body">
                  "{msg.message}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Project Highlights */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-safety" />
              <h2 className="font-header text-lg font-bold uppercase text-white tracking-wide">
                Active Projects Spotlight
              </h2>
            </div>

            <Link
              to="/admin/projects"
              className="text-xs text-safety hover:underline flex items-center gap-1 font-mono uppercase tracking-wider"
            >
              <span>Manage All ({projects.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {projects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#1e293b]/50 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0].url}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-mono">
                        N/A
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-header text-sm font-bold text-white uppercase truncate">
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-concrete truncate">
                      {p.scope || 'Civil Engineering'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      p.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {p.status}
                  </span>
                  <Link
                    to={`/admin/projects?edit=${p.id}`}
                    className="p-1 rounded text-concrete hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit project"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
