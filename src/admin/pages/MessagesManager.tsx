import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  Trash2, 
  Phone, 
  Calendar, 
  MapPin, 
  Check, 
  X, 
  MessageSquare,
  Archive,
  CheckCircle,
  FileText
} from 'lucide-react';
import { adminStore } from '../adminStore';
import type { ContactMessage, MessageStatus } from '../../types/database';

export const MessagesManager: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(() => adminStore.getMessages());
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to live adminStore updates
  React.useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setMessages(adminStore.getMessages());
    });
    return unsubscribe;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadMessages = () => {
    setMessages(adminStore.getMessages());
  };

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setInternalNotes(msg.internal_notes || '');
    // Automatically mark 'New' as 'Read' upon inspection
    if (msg.status === 'New') {
      await adminStore.updateMessageStatus(msg.id, 'Read');
      reloadMessages();
    }
  };

  const handleStatusChange = async (status: MessageStatus) => {
    if (!selectedMessage) return;
    await adminStore.updateMessageStatus(selectedMessage.id, status, internalNotes);
    setSelectedMessage({ ...selectedMessage, status, internal_notes: internalNotes });
    reloadMessages();
    showToast(`Marked as ${status}`);
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    await adminStore.updateMessageStatus(selectedMessage.id, selectedMessage.status, internalNotes);
    setSelectedMessage({ ...selectedMessage, internal_notes: internalNotes });
    reloadMessages();
    showToast('Internal note saved to database.');
  };

  const handleDeleteMessage = async (id: string) => {
    await adminStore.deleteMessage(id);
    reloadMessages();
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
    setDeleteConfirmId(null);
    showToast('Inquiry removed from database.');
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.project_location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' ? true : m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <Mail className="w-6 h-6 text-safety" />
            <span>Client Inquiries & Project RFPs</span>
          </h1>
          <p className="text-xs sm:text-sm text-concrete">
            Incoming site inspection requests, RFP submissions, and customer inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-concrete">
            Total Messages: <strong className="text-white">{messages.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a] border border-slate-800 p-3 sm:p-4 rounded-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, email, city, or keyword..."
            className="w-full bg-[#1e293b]/70 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-safety"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {['All', 'New', 'Read', 'Replied', 'Archived'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-safety text-black font-bold'
                  : 'bg-slate-800/80 text-concrete hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Messages List & Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Messages List (5 or 12 cols depending on selection) */}
        <div className={`${selectedMessage ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3`}>
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`p-4 rounded-xl border bg-[#0f172a] transition-all cursor-pointer ${
                selectedMessage?.id === msg.id
                  ? 'border-safety ring-1 ring-safety/40 shadow-lg'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-header text-sm sm:text-base font-bold text-white uppercase truncate">
                    {msg.full_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-concrete mt-0.5">
                    {msg.project_location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-safety" />
                        <span>{msg.project_location}</span>
                      </span>
                    )}
                    <span>&bull;</span>
                    <span className="text-[11px] font-mono">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    msg.status === 'New'
                      ? 'bg-safety/20 text-safety border border-safety/40'
                      : msg.status === 'Replied'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {msg.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-body">
                "{msg.message}"
              </p>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="p-12 text-center bg-[#0f172a] border border-slate-800 rounded-xl">
              <p className="text-concrete text-xs">No inquiries matching filter.</p>
            </div>
          )}
        </div>

        {/* Right Column: Full Message Detail Drawer */}
        {selectedMessage && (
          <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 sticky top-28 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="font-header text-xl font-bold uppercase text-white">
                  {selectedMessage.full_name}
                </h2>
                <p className="text-xs text-concrete font-mono mt-0.5">
                  Submitted on {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded text-concrete hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Action Pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href={`mailto:${selectedMessage.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono border border-slate-700 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-safety" />
                <span>{selectedMessage.email}</span>
              </a>

              {selectedMessage.phone && (
                <a
                  href={`tel:${selectedMessage.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono border border-slate-700 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedMessage.phone}</span>
                </a>
              )}

              {selectedMessage.project_location && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-concrete font-mono border border-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-safety" />
                  <span>{selectedMessage.project_location}</span>
                </span>
              )}
            </div>

            {/* Full Message Body */}
            <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-slate-800 text-sm text-slate-100 leading-relaxed font-body">
              {selectedMessage.message}
            </div>

            {/* Internal Staff Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-concrete flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-safety" />
                  <span>Staff Internal Follow-up Notes</span>
                </label>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="text-xs text-safety hover:underline font-mono"
                >
                  Save Note
                </button>
              </div>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Private notes (e.g., Quotation sent, site engineer assigned)..."
                className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-safety font-body"
              />
            </div>

            {/* Status Switcher & Delete Controls */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-concrete mr-1">Mark:</span>
                {(['New', 'Read', 'Replied', 'Archived'] as MessageStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      selectedMessage.status === status
                        ? 'bg-safety text-black font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-concrete'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setDeleteConfirmId(selectedMessage.id)}
                className="p-2 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/40"
                title="Delete inquiry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-red-900/50 rounded-xl p-5 max-w-sm w-full space-y-3">
            <h3 className="font-header text-lg font-bold text-white uppercase">
              Delete Contact Inquiry?
            </h3>
            <p className="text-xs text-concrete">
              Are you sure you want to permanently remove this inquiry record from the database?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs text-concrete bg-slate-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(deleteConfirmId)}
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
