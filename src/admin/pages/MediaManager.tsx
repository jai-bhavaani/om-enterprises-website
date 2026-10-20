import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Eye, 
  X, 
  Search, 
  FileImage, 
  ShieldAlert,
  Info,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { adminStore } from '../adminStore';
import { uploadMultipleFiles, deleteMediaFromStorage } from '../../lib/storage';
import type { MediaItem } from '../../types/database';

export const MediaManager: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>(() => adminStore.getMedia());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [activeUsage, setActiveUsage] = useState<string[]>([]);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New upload form state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const reloadMedia = () => {
    setMediaList(adminStore.getMedia());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectItem = (item: MediaItem) => {
    setSelectedItem(item);
    const usage = adminStore.getMediaUsage(item.id);
    setActiveUsage(usage);
    setDeleteWarning(null);
  };

  const handleCloseInspector = () => {
    setSelectedItem(null);
    setActiveUsage([]);
    setDeleteWarning(null);
  };

  const handleFilesChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      setSelectedFiles(files);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgressText(`Uploading ${selectedFiles.length} file(s) to Supabase Storage...`);

    try {
      const uploadedItems = await uploadMultipleFiles(selectedFiles, 'projects');
      
      // Save items into adminStore
      uploadedItems.forEach(item => {
        adminStore.addMediaItem(item);
      });

      reloadMedia();
      setIsUploadOpen(false);
      setSelectedFiles([]);
      showToast(`Successfully uploaded ${uploadedItems.length} photo(s) to Supabase storage.`);
    } catch (err: any) {
      console.error('Upload failed:', err);
      showToast(`Upload error: ${err.message || 'Failed to upload files'}`);
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
    }
  };

  const handleDeleteItem = async (id: string) => {
    const item = mediaList.find(m => m.id === id);
    if (!item) return;

    const res = adminStore.deleteMediaItem(id);
    if (!res.success) {
      setDeleteWarning(res.error || 'Cannot delete image in use.');
    } else {
      if (item.storage_path) {
        await deleteMediaFromStorage(item.storage_path, item.id);
      }
      reloadMedia();
      handleCloseInspector();
      showToast('Media file removed from database & storage.');
    }
  };

  const filteredMedia = mediaList.filter(m => 
    m.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.alt_text || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="font-header text-2xl sm:text-3xl font-bold uppercase text-text-primary tracking-wide">
            Centralized Media Library
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Select files directly from your computer to store in Supabase storage and database.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedFiles([]);
            setIsUploadOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-safety hover:bg-safety-hover text-[var(--color-safety-text)] font-header font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-safety/20 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload From Device</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-surface border border-border-subtle p-3 sm:p-4 rounded-xl flex items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search media by filename or alt description..."
            className="w-full bg-surface-subtle border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-safety"
          />
        </div>
        <span className="text-xs font-mono text-text-secondary hidden sm:inline">
          {filteredMedia.length} files total
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectItem(item)}
            className="group relative aspect-video bg-surface border border-border-subtle hover:border-safety rounded-xl overflow-hidden cursor-pointer transition-all shadow-sm"
          >
            <img
              src={item.public_url}
              alt={item.alt_text || item.filename}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
              <span className="text-[10px] text-white font-mono truncate">
                {item.filename}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Media Inspector Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border-subtle rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileImage className="w-5 h-5 text-safety" />
                <span className="font-header font-bold text-sm uppercase text-text-primary truncate max-w-md">
                  {selectedItem.filename}
                </span>
              </div>
              <button
                onClick={handleCloseInspector}
                className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-border-subtle">
                <img
                  src={selectedItem.public_url}
                  alt={selectedItem.alt_text || selectedItem.filename}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Metadata details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-2.5 bg-surface-subtle rounded-lg border border-border-subtle">
                  <span className="text-text-secondary block text-[10px] uppercase">Storage Path</span>
                  <span className="text-text-primary truncate block font-semibold">{selectedItem.storage_path || 'local-asset'}</span>
                </div>
                <div className="p-2.5 bg-surface-subtle rounded-lg border border-border-subtle">
                  <span className="text-text-secondary block text-[10px] uppercase">File Size</span>
                  <span className="text-text-primary block font-semibold">
                    {Math.round(selectedItem.file_size_bytes / 1024)} KB
                  </span>
                </div>
                <div className="p-2.5 bg-surface-subtle rounded-lg border border-border-subtle">
                  <span className="text-text-secondary block text-[10px] uppercase">MIME Type</span>
                  <span className="text-text-primary block font-semibold">{selectedItem.mime_type}</span>
                </div>
              </div>

              {/* Usage Warning if in use */}
              {activeUsage.length > 0 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2.5 text-xs text-amber-500">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Protected Asset in Use:</span>
                    <span className="text-[11px] text-amber-500/90">
                      Currently used in: {activeUsage.join(', ')}.
                    </span>
                  </div>
                </div>
              )}

              {deleteWarning && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-xs text-red-400">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{deleteWarning}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-border-subtle">
                <a
                  href={selectedItem.public_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-safety transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Full Resolution</span>
                </a>

                <button
                  onClick={() => handleDeleteItem(selectedItem.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 text-xs font-header uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Media</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DEVICE FILE UPLOAD MODAL                                                  */}
      {/* ========================================================================= */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border-subtle rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-header text-lg font-bold uppercase text-text-primary tracking-wide flex items-center gap-2">
                <Upload className="w-5 h-5 text-safety" />
                <span>Upload Photos From Device</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  if (!isUploading) setIsUploadOpen(false);
                }}
                disabled={isUploading}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border-subtle hover:border-safety/70 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-surface-subtle/50 hover:bg-surface-subtle transition-all"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFilesChosen}
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-safety/10 flex items-center justify-center text-safety mb-3">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <p className="font-header text-sm font-bold uppercase text-text-primary tracking-wide">
                  Click to select photos or drag & drop here
                </p>
                <p className="font-body text-xs text-text-secondary mt-1">
                  Supports JPG, PNG, WEBP up to 50MB per file
                </p>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono text-text-secondary uppercase tracking-wider block">
                    Selected Files ({selectedFiles.length}):
                  </span>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-surface-subtle rounded-lg border border-border-subtle flex items-center justify-between text-xs font-mono"
                      >
                        <span className="truncate max-w-[280px] text-text-primary">{file.name}</span>
                        <span className="text-text-secondary text-[10px]">
                          {Math.round(file.size / 1024)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress Status */}
              {isUploading && (
                <div className="p-3 bg-safety/10 border border-safety/30 rounded-lg flex items-center gap-2.5 text-xs text-safety">
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span className="font-mono">{uploadProgressText}</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-2 flex justify-end gap-2 border-t border-border-subtle">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedFiles.length === 0 || isUploading}
                  className="px-4 py-2 rounded-lg bg-safety hover:bg-safety-hover text-[var(--color-safety-text)] font-header font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload to Storage</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
