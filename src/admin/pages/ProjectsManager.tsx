import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Star, 
  Image as ImageIcon, 
  ArrowUpDown, 
  AlertTriangle,
  Upload,
  Eye,
  SlidersHorizontal,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { adminStore } from '../adminStore';
import { uploadMultipleFiles } from '../../lib/storage';
import type { Project, ProjectStatus, MediaItem } from '../../types/database';

export const ProjectsManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>(() => adminStore.getProjects());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Modal / Form state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Device file upload & media library picker state
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check query params to auto-open editor if navigated with ?action=new or ?edit=:id
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');

    if (action === 'new') {
      handleOpenCreate();
      setSearchParams({});
    } else if (editId) {
      const p = projects.find(item => item.id === editId);
      if (p) {
        handleOpenEdit(p);
      }
      setSearchParams({});
    }
  }, [searchParams]);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const reloadProjects = () => {
    setProjects(adminStore.getProjects());
  };

  const handleOpenCreate = () => {
    setEditingProject({
      title: '',
      client_name: '',
      scope: 'Piling, Anchoring & Excavation',
      status: 'In Progress',
      location: 'Mumbai, Maharashtra',
      project_value: '',
      delivery_model: 'Turnkey Substructure & Shoring',
      basement_depth: '18m Depth / 3-4 Basements',
      volume_cum: '50,000+ CuM Hard Basalt',
      piling_spec: '800mm & 1000mm Dia Contiguous Bored Piles (IS 2911)',
      anchoring_spec: '35T to 65T Multi-Strand Prestressed Rock Anchors (IS 10270)',
      strata_type: 'Massive Basalt Rock & High Coastal Water Table',
      machinery_deployed: '2x Poclain EX-380, 4x EX-210, 2x Hydraulic Piling Rigs, 16x Dumpers',
      timeline_duration: 'Completed on Fast-Track Schedule',
      safety_metrics: 'Zero LTI • Strict PPE & Vibration Compliance',
      challenge_solution: '',
      scope_checklist: '• Bulk Earthmoving & Basalt Rock Breaking\n• Contiguous Bored Piles (CBP) Shoring Wall\n• High-Load Prestressed Multi-Strand Rock Anchors\n• Continuous Deep Pit Dewatering Network',
      description: '',
      is_published: true,
      is_featured: false,
      images: [],
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project, images: [...(project.images || [])] });
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingProject(null);
    setIsMediaPickerOpen(false);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;

    adminStore.saveProject(editingProject as any);
    reloadProjects();
    handleCloseEditor();
    showToast('Project details saved successfully.');
  };

  const handleDeleteProject = (id: string) => {
    adminStore.deleteProject(id);
    reloadProjects();
    setDeleteConfirmId(null);
    showToast('Project deleted.');
  };

  // Device file picker upload handler
  const handleDevicePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    setIsUploadingPhotos(true);
    try {
      const uploadedMedia = await uploadMultipleFiles(files, 'projects');
      const currentImages = editingProject?.images || [];
      
      const newImages = uploadedMedia.map((m, idx) => {
        // Also register into central media library
        adminStore.addMediaItem(m);

        return {
          id: `pi-${Date.now()}-${idx}`,
          project_id: editingProject?.id || '',
          media_id: m.id,
          url: m.public_url,
          is_cover: currentImages.length === 0 && idx === 0,
          display_order: currentImages.length + idx,
          created_at: new Date().toISOString(),
        };
      });

      setEditingProject({
        ...editingProject,
        images: [...currentImages, ...newImages as any],
      });

      showToast(`Uploaded and added ${newImages.length} photo(s) to project.`);
    } catch (err: any) {
      console.error('Failed to upload project photos:', err);
      showToast('Error uploading photos to Supabase storage.');
    } finally {
      setIsUploadingPhotos(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Select existing asset from Media Library
  const handleSelectFromMedia = (mediaItem: MediaItem) => {
    const currentImages = editingProject?.images || [];
    // Prevent duplicate addition
    if (currentImages.some(img => img.url === mediaItem.public_url)) {
      showToast('Photo is already attached to this project.');
      return;
    }

    const newImageObj = {
      id: `pi-${Date.now()}`,
      project_id: editingProject?.id || '',
      media_id: mediaItem.id,
      url: mediaItem.public_url,
      is_cover: currentImages.length === 0,
      display_order: currentImages.length,
      created_at: new Date().toISOString(),
    };

    setEditingProject({
      ...editingProject,
      images: [...currentImages, newImageObj as any],
    });
    setIsMediaPickerOpen(false);
    showToast('Photo selected from Media Library.');
  };

  const handleSetCover = (index: number) => {
    const updatedImages = (editingProject?.images || []).map((img, i) => ({
      ...img,
      is_cover: i === index,
    }));
    setEditingProject({ ...editingProject, images: updatedImages });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = (editingProject?.images || []).filter((_, i) => i !== index);
    // If the removed image was cover, assign cover to first remaining
    if (updatedImages.length > 0 && !updatedImages.some(img => img.is_cover)) {
      updatedImages[0].is_cover = true;
    }
    setEditingProject({ ...editingProject, images: updatedImages });
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const list = [...(editingProject?.images || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    setEditingProject({
      ...editingProject,
      images: list.map((item, idx) => ({ ...item, display_order: idx })),
    });
  };

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.scope || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.client_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'All' ? true :
      statusFilter === 'Draft' ? !p.is_published :
      p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const scopeOptions = [
    'Piling, Anchoring & Excavation',
    'Civil & Infrastructure',
    'Excavation Only',
    'Demolition',
    'Road construction',
    'slope stabilization',
    'Piling only',
  ];

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-safety text-black font-header font-bold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-header text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide">
            Project Portfolios
          </h1>
          <p className="text-xs sm:text-sm text-concrete">
            Manage site details, image galleries, status progression, and website visibility.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-safety hover:bg-[#e05e00] text-black font-header font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-safety/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a] border border-slate-800 p-3 sm:p-4 rounded-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project name, developer, or scope..."
            className="w-full bg-[#1e293b]/70 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-safety"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {['All', 'In Progress', 'Completed', 'Upcoming', 'Draft'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-safety text-black font-bold'
                  : 'bg-slate-800/80 text-concrete hover:text-white hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => {
          const coverImg = project.images?.find(i => i.is_cover)?.url || project.images?.[0]?.url;
          return (
            <div
              key={project.id}
              className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col group"
            >
              {/* Cover Image & Status Header */}
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                {coverImg ? (
                  <img
                    src={coverImg}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">
                    No Cover Image
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/60"></div>

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shadow-sm ${
                      project.status === 'Completed'
                        ? 'bg-emerald-500 text-black'
                        : project.status === 'Upcoming'
                        ? 'bg-blue-500 text-white'
                        : 'bg-amber-500 text-black'
                    }`}
                  >
                    {project.status}
                  </span>

                  <div className="flex items-center gap-1">
                    {!project.is_published && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        Draft
                      </span>
                    )}
                    {project.is_featured && (
                      <span className="p-1 rounded bg-safety text-black" title="Spotlight Featured">
                        <Star className="w-3 h-3 fill-black" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Photo Count */}
                <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] font-mono text-concrete-light">
                  <ImageIcon className="w-3.5 h-3.5 text-safety" />
                  <span>{project.images?.length || 0} Photos</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-header text-lg font-bold text-white uppercase leading-snug line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-safety font-medium tracking-wide mt-0.5">
                    {project.scope}
                  </p>
                  {project.client_name && project.client_name !== project.title && (
                    <p className="text-[11px] text-concrete line-clamp-1 mt-1">
                      Client: {project.client_name}
                    </p>
                  )}
                  {project.project_value && (
                    <p className="text-[11px] text-slate-400 font-mono mt-1">
                      Value: ₹{project.project_value}
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {project.location || 'Mumbai'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(project)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-concrete-light hover:text-white transition-colors"
                      title="Edit project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(project.id)}
                      className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/40 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-[#0f172a] border border-slate-800 rounded-xl">
          <p className="text-concrete text-sm">No projects found matching the criteria.</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROJECT EDITOR MODAL / DRAWER                                             */}
      {/* ========================================================================= */}
      {isEditorOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#111c30]">
              <div>
                <h2 className="font-header text-xl font-bold uppercase text-white tracking-wider">
                  {editingProject.id ? 'Edit Construction Project' : 'Add New Project'}
                </h2>
                <p className="text-xs text-concrete">
                  Enter project parameters, assign cover photograph, and manage gallery.
                </p>
              </div>
              <button
                onClick={handleCloseEditor}
                className="p-1.5 rounded-lg text-concrete hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* SECTION 1: Core Project Identity & Commercials */}
              <div className="border-b border-slate-800 pb-4">
                <span className="font-mono text-[11px] text-safety uppercase tracking-widest font-bold block mb-3">
                  1. Core Identity & Commercials
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="e.g. Prestige City Mulund"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Client / Developer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.client_name || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, client_name: e.target.value })}
                      placeholder="e.g. Prestige Estates Projects Ltd / L&T"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Engineering Scope / Category *
                    </label>
                    <select
                      value={editingProject.scope || 'Piling, Anchoring & Excavation'}
                      onChange={(e) => setEditingProject({ ...editingProject, scope: e.target.value })}
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    >
                      {scopeOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Project Status *
                    </label>
                    <select
                      value={editingProject.status || 'In Progress'}
                      onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as ProjectStatus })}
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    >
                      <option value="In Progress">In Progress (Active On-Site)</option>
                      <option value="Completed">Completed Landmark</option>
                      <option value="Upcoming">Upcoming / Awarded</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Site Location & Corridor
                    </label>
                    <input
                      type="text"
                      value={editingProject.location || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      placeholder="e.g. Mulund West, Western Suburbs, Mumbai"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Contract Value (INR)
                    </label>
                    <input
                      type="text"
                      value={editingProject.project_value || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, project_value: e.target.value })}
                      placeholder="e.g. ₹20,05,99,882 (or Confidential)"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Contract & Delivery Model
                    </label>
                    <input
                      type="text"
                      value={editingProject.delivery_model || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, delivery_model: e.target.value })}
                      placeholder="e.g. Turnkey Substructure, Piling & Deep Rock Excavation"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Subterranean Scale & Geotechnical Specifications */}
              <div className="border-b border-slate-800 pb-4">
                <span className="font-mono text-[11px] text-safety uppercase tracking-widest font-bold block mb-3">
                  2. Subterranean Scale & Geotechnical Specifications
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Excavation Depth & Basement Levels
                    </label>
                    <input
                      type="text"
                      value={editingProject.basement_depth || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, basement_depth: e.target.value })}
                      placeholder="e.g. 18.5m Depth / 4 Basement Levels"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Earth & Rock Cutting Volume (CuM)
                    </label>
                    <input
                      type="text"
                      value={editingProject.volume_cum || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, volume_cum: e.target.value })}
                      placeholder="e.g. 85,000 CuM Hard Basalt"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Piling Specifications
                    </label>
                    <input
                      type="text"
                      value={editingProject.piling_spec || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, piling_spec: e.target.value })}
                      placeholder="e.g. 800mm & 1000mm Dia Contiguous Bored Piles (IS 2911)"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Rock Anchoring Specifications
                    </label>
                    <input
                      type="text"
                      value={editingProject.anchoring_spec || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, anchoring_spec: e.target.value })}
                      placeholder="e.g. 450 Multi-Strand Tiebacks, 45T to 65T Capacity (IS 10270)"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Strata & Ground Conditions Handled
                    </label>
                    <input
                      type="text"
                      value={editingProject.strata_type || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, strata_type: e.target.value })}
                      placeholder="e.g. Massive Grade-I Basalt, Amygdaloidal Joints & High Groundwater"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Heavy Machinery Deployed & Safety */}
              <div className="border-b border-slate-800 pb-4">
                <span className="font-mono text-[11px] text-safety uppercase tracking-widest font-bold block mb-3">
                  3. Plant & Heavy Machinery Deployed & Safety
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Specific Fleet & Machinery Deployed
                    </label>
                    <input
                      type="text"
                      value={editingProject.machinery_deployed || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, machinery_deployed: e.target.value })}
                      placeholder="e.g. 2x Poclain EX-380, 4x EX-210 Breakers, 2x Hydraulic Piling Rigs, 16x Dumpers"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      Execution Timeline & Duration
                    </label>
                    <input
                      type="text"
                      value={editingProject.timeline_duration || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, timeline_duration: e.target.value })}
                      placeholder="e.g. Completed in 8 Months (Delivered Ahead of Schedule)"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                      HSE, Safety Hours & Vibration Compliance
                    </label>
                    <input
                      type="text"
                      value={editingProject.safety_metrics || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, safety_metrics: e.target.value })}
                      placeholder="e.g. 140,000 Safe Hours • Zero LTI • Vibration Damped"
                      className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Engineering Challenge, Solution & Scope Checklist */}
              <div className="border-b border-slate-800 pb-4 space-y-4">
                <span className="font-mono text-[11px] text-safety uppercase tracking-widest font-bold block">
                  4. Engineering Challenge, Solution & Narrative
                </span>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                    Geotechnical Challenge & Engineered Solution
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.challenge_solution || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, challenge_solution: e.target.value })}
                    placeholder="Describe specific site constraints (proximity to high-rises, coastal water table, hard basalt) and the engineering technique OM Enterprises used..."
                    className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                    Itemized Scope of Work Checklist (Bulleted)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.scope_checklist || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, scope_checklist: e.target.value })}
                    placeholder="• Bulk Earthmoving & Hard Basalt Cutting&#10;• Contiguous Bored Piles (CBP) Shoring Wall&#10;• High-Load Prestressed Multi-Strand Rock Anchors&#10;• Continuous Deep Pit Dewatering Network"
                    className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-concrete mb-1">
                    General Project Summary / Overview
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    placeholder="High-level executive summary of the project package..."
                    className="w-full bg-[#1e293b]/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety"
                  />
                </div>
              </div>

              {/* Toggles: Featured & Published */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.is_published ?? true}
                    onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked })}
                    className="w-4 h-4 accent-safety rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Published on Public Website</span>
                    <span className="text-[10px] text-concrete block">Uncheck to save as private draft</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.is_featured ?? false}
                    onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                    className="w-4 h-4 accent-safety rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Feature on Homepage Spotlight</span>
                    <span className="text-[10px] text-concrete block">Highlighted in top 4 spotlight cards</span>
                  </div>
                </label>
              </div>

              {/* Image Gallery & Cover Selector */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-header text-sm font-bold uppercase text-white tracking-wide flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-safety" />
                    <span>Project Images ({editingProject.images?.length || 0})</span>
                  </h3>
                  <span className="text-[11px] text-concrete font-mono">
                    Tap Star to set Cover Image
                  </span>
                </div>

                {/* Add Image Controls: Local Device Upload & Library Picker */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleDevicePhotosUpload}
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isUploadingPhotos}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 min-w-[180px] px-3.5 py-2.5 bg-safety hover:bg-safety-hover text-black font-header font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-safety/20"
                  >
                    {isUploadingPhotos ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading from Device...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Photos from Device</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4 text-safety" />
                    <span>Select from Library</span>
                  </button>
                </div>

                {/* Thumbnails grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {editingProject.images?.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className={`relative aspect-video rounded-lg overflow-hidden border bg-slate-900 group ${
                        img.is_cover ? 'border-safety ring-2 ring-safety/30' : 'border-slate-800'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />

                      {/* Cover Badge */}
                      {img.is_cover && (
                        <div className="absolute top-1 left-1 bg-safety text-black text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shadow">
                          COVER
                        </div>
                      )}

                      {/* Overlay Controls */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                        <button
                          type="button"
                          onClick={() => handleSetCover(idx)}
                          className={`p-1 rounded ${img.is_cover ? 'text-safety' : 'text-white hover:text-safety'}`}
                          title="Set as Cover Image"
                        >
                          <Star className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveImage(idx, 'up')}
                          className="p-1 rounded text-white hover:text-safety disabled:opacity-30"
                          title="Move Left"
                        >
                          &larr;
                        </button>
                        <button
                          type="button"
                          disabled={idx === (editingProject.images?.length || 0) - 1}
                          onClick={() => handleMoveImage(idx, 'down')}
                          className="p-1 rounded text-white hover:text-safety disabled:opacity-30"
                          title="Move Right"
                        >
                          &rarr;
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 rounded text-red-400 hover:text-red-300"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Submit Controls */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditor}
                  className="px-4 py-2.5 rounded-lg text-xs font-mono text-concrete hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-safety hover:bg-[#e05e00] text-black font-header font-bold text-xs uppercase tracking-wider shadow-lg shadow-safety/20 transition-colors"
                >
                  Save Project Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION DIALOG                                                */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-red-900/50 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-header text-lg font-bold uppercase text-white">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-xs text-concrete leading-relaxed">
              Are you sure you want to delete this project? This will remove its references from the website portfolio.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-mono text-concrete hover:text-white bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteConfirmId)}
                className="px-3.5 py-2 rounded-lg text-xs font-header font-bold uppercase bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MEDIA LIBRARY PICKER MODAL                                                */}
      {/* ========================================================================= */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border-subtle rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-header text-lg font-bold uppercase text-text-primary tracking-wide flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-safety" />
                <span>Select Photo from Central Media Library</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-text-secondary">
              Click any photo to attach it to this project gallery.
            </p>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-3 p-1">
              {adminStore.getMedia().map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleSelectFromMedia(m)}
                  className="group relative aspect-video rounded-lg overflow-hidden border border-border-subtle hover:border-safety cursor-pointer bg-slate-900 transition-all shadow-sm"
                >
                  <img src={m.public_url} alt={m.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="px-2 py-1 bg-safety text-black text-[10px] font-bold rounded">
                      Choose
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface-subtle hover:bg-border-subtle text-text-primary text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
