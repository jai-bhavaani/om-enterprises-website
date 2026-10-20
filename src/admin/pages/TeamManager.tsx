import React, { useState, useRef } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  Upload,
  Loader2,
  Camera,
  FolderOpen
} from 'lucide-react';
import { adminStore } from '../adminStore';
import { uploadFileToStorage } from '../../lib/storage';
import type { TeamMember } from '../../types/database';

export const TeamManager: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>(() => adminStore.getTeam());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadTeam = () => {
    setTeam(adminStore.getTeam());
  };

  const handleOpenCreate = () => {
    setEditingMember({
      name: '',
      role: '',
      bio: '',
      image_url: '',
      is_published: true,
      display_order: team.length,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingPhoto(true);
    try {
      const res = await uploadFileToStorage(file, 'team', `${editingMember?.name || 'team'}_portrait`);
      if (res.success && res.mediaItem) {
        adminStore.addMediaItem(res.mediaItem);
        setEditingMember(prev => ({
          ...prev,
          image_url: res.mediaItem!.public_url,
        }));
        showToast('Profile photo uploaded to Supabase storage.');
      } else {
        showToast(res.error || 'Failed to upload photo');
      }
    } catch (err) {
      showToast('Error uploading photo to storage');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.role) return;

    adminStore.saveTeamMember(editingMember as any);
    reloadTeam();
    handleCloseModal();
    showToast('Team member profile saved.');
  };

  const handleDeleteMember = (id: string) => {
    adminStore.deleteTeamMember(id);
    reloadTeam();
    setDeleteConfirmId(null);
    showToast('Team member removed.');
  };

  const handleTogglePublish = (member: TeamMember) => {
    adminStore.saveTeamMember({
      ...member,
      is_published: !member.is_published,
    });
    reloadTeam();
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
            <Users className="w-6 h-6 text-safety" />
            <span>Leadership & Key Personnel</span>
          </h1>
          <p className="text-xs sm:text-sm text-concrete">
            Manage company executives, project directors, site supervisors, and public bios.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-safety hover:bg-[#e05e00] text-black font-header font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-safety/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member) => (
          <div
            key={member.id}
            className={`p-4 rounded-xl border bg-[#0f172a] transition-all flex flex-col justify-between ${
              member.is_published ? 'border-slate-800' : 'border-slate-800/50 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 border-2 border-slate-700">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-header text-base font-bold text-white uppercase truncate">
                      {member.name}
                    </h3>
                  </div>
                  <p className="text-xs text-safety font-medium tracking-wide">
                    {member.role}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.2 rounded text-[10px] font-mono ${
                      member.is_published
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {member.is_published ? 'Published' : 'Hidden'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-concrete line-clamp-3 leading-relaxed font-body">
                {member.bio || 'No professional bio provided.'}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleTogglePublish(member)}
                className="text-xs font-mono text-concrete hover:text-white flex items-center gap-1"
              >
                {member.is_published ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hide Profile</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Publish</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-concrete hover:text-white transition-colors"
                  title="Edit member"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(member.id)}
                  className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/40 transition-colors"
                  title="Delete member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-header text-lg font-bold uppercase text-white">
                {editingMember.id ? 'Edit Leadership Profile' : 'Add New Team Member'}
              </h3>
              <button onClick={handleCloseModal} className="p-1 rounded text-concrete hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="e.g. Ashok Kumar Pal"
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                  Designation / Role *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.role || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="e.g. Proprietor / Project Manager"
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-2">
                  Profile Photograph *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 flex items-center justify-center flex-shrink-0">
                    {editingMember.image_url ? (
                      <img
                        src={editingMember.image_url}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-6 h-6 text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      disabled={isUploadingPhoto}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-safety hover:bg-safety-hover text-black font-header font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingPhoto ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Upload From Device</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-concrete block font-mono">
                      JPG, PNG, or WEBP portrait photo
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                  Professional Biography
                </label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  placeholder="Summary of engineering expertise and tenure..."
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pub-team"
                  checked={editingMember.is_published ?? true}
                  onChange={(e) => setEditingMember({ ...editingMember, is_published: e.target.checked })}
                  className="w-4 h-4 accent-safety rounded"
                />
                <label htmlFor="pub-team" className="text-xs text-concrete">
                  Display profile on public website
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3.5 py-2 rounded-lg text-xs font-mono text-concrete hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-safety hover:bg-[#e05e00] text-black font-header font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Save Member Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-red-900/50 rounded-xl p-5 max-w-sm w-full space-y-3">
            <h3 className="font-header text-lg font-bold text-white uppercase">
              Remove Team Member?
            </h3>
            <p className="text-xs text-concrete">
              Are you sure you want to delete this profile from the leadership roster?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs text-concrete bg-slate-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMember(deleteConfirmId)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
