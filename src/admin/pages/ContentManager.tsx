import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Check, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Award,
  Database,
  Loader2
} from 'lucide-react';
import { adminStore } from '../adminStore';

export const ContentManager: React.FC = () => {
  const [content, setContent] = useState(() => adminStore.getContent());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Subscribe to live adminStore updates
  React.useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setContent(adminStore.getContent());
    });
    return unsubscribe;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminStore.saveContent(content);
      showToast('Company information and statistics updated in Supabase.');
    } catch (err: any) {
      showToast('Failed to save company content: ' + (err.message || 'Error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportBackup = () => {
    const dataBackup = {
      timestamp: new Date().toISOString(),
      company: 'OM Enterprises - Edilite Construction Pvt. Ltd.',
      projects: adminStore.getProjects(),
      media: adminStore.getMedia(),
      heroSlides: adminStore.getHeroSlides(),
      team: adminStore.getTeam(),
      messages: adminStore.getMessages(),
      content: adminStore.getContent(),
    };

    const blob = new Blob([JSON.stringify(dataBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `om_enterprises_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Complete website backup downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-safety text-black font-header font-bold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-header text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
            <Settings className="w-6 h-6 text-safety" />
            <span>Company Info & Global Parameters</span>
          </h1>
          <p className="text-xs sm:text-sm text-concrete">
            Modify office contact details, business statistics, and export emergency backups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-safety" />
            <span>Export Backup (JSON)</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Information Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <h2 className="font-header text-lg font-bold uppercase text-white tracking-wide border-b border-slate-800 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-safety" />
            <span>Public Contact Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-safety" />
                <span>Primary Email</span>
              </label>
              <input
                type="email"
                value={content.contact.email}
                onChange={(e) => setContent({
                  ...content,
                  contact: { ...content.contact, email: e.target.value }
                })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-safety" />
                <span>Primary Phone</span>
              </label>
              <input
                type="text"
                value={content.contact.phone}
                onChange={(e) => setContent({
                  ...content,
                  contact: { ...content.contact, phone: e.target.value }
                })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-safety" />
                <span>Registered Office Address</span>
              </label>
              <textarea
                rows={3}
                value={content.contact.address}
                onChange={(e) => setContent({
                  ...content,
                  contact: { ...content.contact, address: e.target.value }
                })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety font-body leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-safety" />
                <span>Operating Hours</span>
              </label>
              <input
                type="text"
                value={content.contact.operatingHours || ''}
                onChange={(e) => setContent({
                  ...content,
                  contact: { ...content.contact, operatingHours: e.target.value }
                })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
              />
            </div>
          </div>
        </div>

        {/* Core Statistics Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <h2 className="font-header text-lg font-bold uppercase text-white tracking-wide border-b border-slate-800 pb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-safety" />
            <span>Homepage Key Metrics & Accreditations</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                Years of Experience (Numeric)
              </label>
              <input
                type="number"
                value={content.stats.yearsExperience}
                onChange={(e) => setContent({
                  ...content,
                  stats: { ...content.stats, yearsExperience: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-base font-header font-bold text-white focus:outline-none focus:border-safety"
              />
              <span className="text-[10px] text-concrete font-mono mt-1 block">Displays as "20+"</span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                Expert Team Workforce
              </label>
              <input
                type="number"
                value={content.stats.teamSize}
                onChange={(e) => setContent({
                  ...content,
                  stats: { ...content.stats, teamSize: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-base font-header font-bold text-white focus:outline-none focus:border-safety"
              />
              <span className="text-[10px] text-concrete font-mono mt-1 block">Displays as "185+"</span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                Client Satisfaction (%)
              </label>
              <input
                type="number"
                value={content.stats.satisfactionRate}
                onChange={(e) => setContent({
                  ...content,
                  stats: { ...content.stats, satisfactionRate: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-base font-header font-bold text-white focus:outline-none focus:border-safety"
              />
              <span className="text-[10px] text-concrete font-mono mt-1 block">Displays as "100%"</span>
            </div>
          </div>
        </div>

        {/* Corporate Narrative */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <h2 className="font-header text-lg font-bold uppercase text-white tracking-wide border-b border-slate-800 pb-3">
            About Section Narrative
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                Headline
              </label>
              <input
                type="text"
                value={content.about.headline}
                onChange={(e) => setContent({
                  ...content,
                  about: { ...content.about, headline: e.target.value }
                })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety font-header font-bold uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                Story Paragraph
              </label>
              <textarea
                rows={3}
                value={content.about.description}
                onChange={(e) => setContent({
                  ...content,
                  about: { ...content.about, description: e.target.value }
                })}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety font-body leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-safety hover:bg-[#e05e00] disabled:opacity-50 text-black font-header font-bold text-xs uppercase tracking-wider shadow-lg shadow-safety/20 transition-colors cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving to Database...' : 'Save Global Information'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
