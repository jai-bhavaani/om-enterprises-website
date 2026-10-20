import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Image as ImageIcon, 
  Sparkles, 
  Users, 
  Mail, 
  Settings, 
  ExternalLink, 
  LogOut,
  ShieldCheck,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useAdmin } from './AdminContext';
import { adminStore } from './adminStore';
import { useTheme } from '../context/ThemeContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, isDemoMode } = useAdmin();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const messages = adminStore.getMessages();
  const unreadCount = messages.filter(m => m.status === 'New').length;

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Media', path: '/admin/media', icon: ImageIcon },
    { label: 'Hero Slides', path: '/admin/hero', icon: Sparkles },
    { label: 'Team', path: '/admin/team', icon: Users },
    { label: 'Inquiries', path: '/admin/messages', icon: Mail, badge: unreadCount > 0 ? unreadCount : undefined },
    { label: 'Company Info', path: '/admin/content', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-portal min-h-screen bg-background text-text-primary flex flex-col font-body selection:bg-safety selection:text-[var(--color-safety-text)] transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border-subtle px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-safety flex items-center justify-center font-header font-bold text-[var(--color-safety-text)] text-lg">
                OM
              </div>
              <div className="leading-tight">
                <span className="font-header font-bold text-text-primary text-base tracking-wider uppercase block">
                  OM CMS
                </span>
                <span className="text-[10px] text-text-secondary block uppercase tracking-widest font-mono">
                  Edilite Construction
                </span>
              </div>
            </Link>

            {isDemoMode ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/30">
                <AlertCircle className="w-3 h-3" /> Demo Mode
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" /> Live Supabase
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-1.5 rounded-lg bg-surface-subtle hover:bg-border-subtle text-text-primary border border-border-subtle transition-colors flex items-center justify-center cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-safety" />
              ) : (
                <Moon className="w-4 h-4 text-text-primary" />
              )}
            </button>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-surface-subtle hover:bg-border-subtle text-text-secondary hover:text-text-primary transition-colors border border-border-subtle"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-safety" />
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-border-subtle text-xs text-text-secondary">
              <span>{user?.email}</span>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation Bar (Compact, Mobile-First Scrollable Tabs) */}
      <nav className="bg-surface border-b border-border-subtle px-4 py-1.5 overflow-x-auto scrollbar-none sticky top-[57px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wide uppercase transition-all ${
                  isActive
                    ? 'bg-safety text-[var(--color-safety-text)] shadow-sm font-bold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-safety-text)]' : 'text-safety'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[var(--color-surface)] text-safety' : 'bg-safety text-[var(--color-safety-text)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Workspace Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-20">
        {children}
      </main>

      {/* Mobile Bottom Quick Status */}
      <footer className="border-t border-border-subtle bg-surface-subtle py-4 px-4 text-center text-xs text-text-secondary">
        OM Enterprises Administrative Console &bull; Foundation & Civil Engineering Specialists
      </footer>
    </div>
  );
};
