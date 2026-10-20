import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Wrench, 
  Layers, 
  ArrowRight, 
  X, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  FileText,
  Phone,
  HardHat,
  Filter
} from 'lucide-react';
import { HashLink } from 'react-router-hash-link';
import { Navbar } from './Navbar';
import { ProjectLightbox } from './ProjectLightbox';
import { ImageWithFallback } from './ImageWithFallback';
import { useProjects } from '../src/hooks/useCMS';
import { projectData as staticProjectData } from '../projects.config';

export const ProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { projects: liveProjects } = useProjects();
  const sourceProjects = liveProjects.length > 0 ? liveProjects : staticProjectData;

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'In Progress'>('All');
  const [scopeFilter, setScopeFilter] = useState('All');
  const [selectedClient, setSelectedClient] = useState('All');

  // Modal Dossier state
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Listen to searchParams to auto-open specific project dossier
  useEffect(() => {
    const projectQuery = searchParams.get('project') || searchParams.get('id');
    if (projectQuery && sourceProjects.length > 0) {
      const normQuery = decodeURIComponent(projectQuery).trim().toLowerCase();
      const match = sourceProjects.find((p: any) => {
        const pTitle = (p.title || '').trim().toLowerCase();
        const pId = (p.id || '').trim().toLowerCase();
        const pClient = (p.client_name || p.name || '').trim().toLowerCase();
        return (
          pTitle === normQuery ||
          pId === normQuery ||
          pTitle.includes(normQuery) ||
          normQuery.includes(pTitle) ||
          pClient === normQuery
        );
      });
      if (match) {
        setSelectedProject(match);
      }
    }
  }, [searchParams, sourceProjects]);

  const handleOpenProject = (project: any) => {
    setSelectedProject(project);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('project', project.title || project.id);
    setSearchParams(newParams, { replace: true });
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    if (searchParams.has('project') || searchParams.has('id')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('project');
      newParams.delete('id');
      setSearchParams(newParams, { replace: true });
    }
  };

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  // Helper to extract image URL strings uniformly
  const getImages = (p: any): string[] => {
    if (!p?.images || !Array.isArray(p.images)) return [];
    return p.images.map((img: any) => (typeof img === 'string' ? img : img.url)).filter(Boolean);
  };

  // Unique clients for quick filters
  const marqueeClients = [
    'All',
    'Prestige Estates',
    'Raymond',
    'Piramal',
    'L&T Construction',
    'Welspun',
    'Breach Candy',
    'HCC',
    'B.E. Billimoria',
  ];

  // Unique scopes
  const allScopes = useMemo(() => {
    const raw = sourceProjects.map((p: any) => p.scope).filter(Boolean);
    return ['All', ...Array.from(new Set(raw))];
  }, [sourceProjects]);

  // Counts for status tabs
  const completedCount = useMemo(
    () => sourceProjects.filter((p: any) => (p.status || '').toLowerCase() === 'completed').length,
    [sourceProjects]
  );
  const inProgressCount = useMemo(
    () => sourceProjects.filter((p: any) => (p.status || '').toLowerCase() !== 'completed').length,
    [sourceProjects]
  );

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return sourceProjects.filter((p: any) => {
      const title = (p.title || '').toLowerCase();
      const client = (p.client_name || p.name || '').toLowerCase();
      const scope = (p.scope || '').toLowerCase();
      const location = (p.location || '').toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        title.includes(search) ||
        client.includes(search) ||
        scope.includes(search) ||
        location.includes(search);

      const matchesStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'Completed'
          ? (p.status || '').toLowerCase() === 'completed'
          : (p.status || '').toLowerCase() !== 'completed';

      const matchesScope = scopeFilter === 'All' ? true : p.scope === scopeFilter;

      const matchesClient =
        selectedClient === 'All'
          ? true
          : client.includes(selectedClient.toLowerCase()) ||
            title.includes(selectedClient.toLowerCase());

      return matchesSearch && matchesStatus && matchesScope && matchesClient;
    });
  }, [sourceProjects, searchTerm, statusFilter, scopeFilter, selectedClient]);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setInitialImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImages([]);
    setInitialImageIndex(0);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary relative selection:bg-safety selection:text-[var(--color-safety-text)]">
      <Navbar />

      <main className="relative z-10 flex flex-col pt-28 sm:pt-32 pb-24">
        {/* TIER 1: MACRO HEADER & PROOF BAR */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 border-b border-border-subtle bg-surface/30">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-text-secondary uppercase tracking-wider mb-4">
              <HashLink to="/" className="hover:text-safety transition-colors">
                Home
              </HashLink>
              <span>/</span>
              <span className="text-text-primary">Substructure Projects</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safety/10 border border-safety/30 text-safety text-xs font-mono font-bold uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Audited Engineering Case Studies</span>
                </div>
                <h1 className="font-header text-4xl sm:text-5xl lg:text-6xl uppercase font-bold text-text-primary tracking-tight">
                  Engineered Substructures & Landmark Portfolio
                </h1>
                <p className="font-body text-text-secondary text-sm sm:text-base mt-3 leading-relaxed">
                  Over two decades of verified multi-tier deep rock excavations, bored shore piling, and high-load prestressed rock anchoring delivered for India’s tier-1 developers across Mumbai.
                </p>
              </div>

              {/* Static Proof Strip (Report Benchmark: Zero Fragile JS Odometers) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface border border-border-subtle p-3.5 rounded-xl shadow-sm">
                <div className="text-center px-2">
                  <span className="font-header text-xl sm:text-2xl font-bold text-text-primary block">
                    ₹150+ Cr
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">
                    Documented Value
                  </span>
                </div>
                <div className="text-center px-2 border-l border-border-subtle">
                  <span className="font-header text-xl sm:text-2xl font-bold text-text-primary block">
                    89+ Units
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">
                    Owned Heavy Iron
                  </span>
                </div>
                <div className="text-center px-2 border-l border-border-subtle">
                  <span className="font-header text-xl sm:text-2xl font-bold text-text-primary block">
                    20+ Yrs
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">
                    Since 2004
                  </span>
                </div>
                <div className="text-center px-2 border-l border-border-subtle">
                  <span className="font-header text-xl sm:text-2xl font-bold text-safety block">
                    ISO 9001
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">
                    Quality Standard
                  </span>
                </div>
              </div>
            </div>

            {/* FACETED CONTROLS & FILTER BAR */}
            <div className="space-y-4 pt-2">
              {/* Row 1: Status Toggle & Live Search Input */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Status Tabs (Webuild / L&T Benchmark) */}
                <div className="flex items-center p-1 bg-surface border border-border-subtle rounded-xl self-start">
                  <button
                    onClick={() => setStatusFilter('All')}
                    className={`px-4 py-2 rounded-lg font-header text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      statusFilter === 'All'
                        ? 'bg-safety text-black shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <span>All Projects</span>
                    <span className="text-[10px] font-mono opacity-80">({sourceProjects.length})</span>
                  </button>

                  <button
                    onClick={() => setStatusFilter('Completed')}
                    className={`px-4 py-2 rounded-lg font-header text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      statusFilter === 'Completed'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <span>Completed Landmarks</span>
                    <span className="text-[10px] font-mono opacity-80">({completedCount})</span>
                  </button>

                  <button
                    onClick={() => setStatusFilter('In Progress')}
                    className={`px-4 py-2 rounded-lg font-header text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      statusFilter === 'In Progress'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <span>Active Sites</span>
                    <span className="text-[10px] font-mono opacity-80">({inProgressCount})</span>
                  </button>
                </div>

                {/* Live Keyword Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by project, client (Piramal, L&T), location, or machinery..."
                    className="w-full bg-surface border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-safety transition-colors"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary text-xs"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Client Quick Filter Strip */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary whitespace-nowrap flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-safety" />
                  <span>Developer Filter:</span>
                </span>
                {marqueeClients.map((client) => (
                  <button
                    key={client}
                    onClick={() => setSelectedClient(client)}
                    className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                      selectedClient === client
                        ? 'bg-safety/20 text-safety border border-safety/50 font-bold'
                        : 'bg-surface border border-border-subtle text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {client}
                  </button>
                ))}
              </div>

              {/* Row 3: Scope Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs border-t border-border-subtle/50 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary whitespace-nowrap flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-safety" />
                  <span>Engineering Scope:</span>
                </span>
                {allScopes.map((scope) => (
                  <button
                    key={scope}
                    onClick={() => setScopeFilter(scope)}
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer ${
                      scopeFilter === scope
                        ? 'bg-text-primary text-background font-bold shadow-sm'
                        : 'bg-surface-subtle text-text-secondary hover:text-text-primary border border-transparent'
                    }`}
                  >
                    {scope}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TIER 2: 3-COLUMN B2B PROJECT CARDS GRID */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Results Counter */}
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-border-subtle">
              <span className="font-mono text-xs text-text-secondary">
                Showing <strong className="text-text-primary">{filteredProjects.length}</strong> verified project case studies
              </span>

              {(searchTerm || statusFilter !== 'All' || scopeFilter !== 'All' || selectedClient !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setScopeFilter('All');
                    setSelectedClient('All');
                  }}
                  className="text-xs font-mono text-safety hover:underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project: any, i: number) => {
                const images = getImages(project);
                const coverImage = images[0] || '';
                const clientName = project.client_name || project.name || 'Private Developer';
                const isCompleted = (project.status || '').toLowerCase() === 'completed';
                const contractVal = project.project_value || project.contractValue;

                return (
                  <div
                    key={project.id || i}
                    className="group bg-surface border border-border-subtle hover:border-safety/60 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      {/* 16:9 Image Thumbnail with Overlay Badges */}
                      <div 
                        className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer"
                        onClick={() => handleOpenProject(project)}
                      >
                        <ImageWithFallback
                          src={coverImage}
                          fallbackSrc="https://placehold.co/800x450/png?text=Site+Photograph"
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none gap-2">
                          <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold shadow-sm ${
                            isCompleted 
                              ? 'bg-emerald-500/90 text-white' 
                              : 'bg-amber-500/90 text-black'
                          }`}>
                            {isCompleted ? '✓ Completed' : '⚙ In Progress'}
                          </span>

                          {contractVal && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-safety border border-safety/40 shadow-sm">
                              {contractVal}
                            </span>
                          )}
                        </div>

                        {/* Photo Count badge bottom right */}
                        {images.length > 1 && (
                          <div className="absolute bottom-3 right-3 z-10">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white/90 border border-white/20">
                              📷 {images.length} Photos
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-5 sm:p-6 space-y-3">
                        <div className="flex items-center gap-2 text-xs">
                          <Building2 className="w-3.5 h-3.5 text-safety flex-shrink-0" />
                          <span className="font-header font-bold uppercase text-safety truncate">
                            {clientName}
                          </span>
                        </div>

                        <h3 
                          className="font-header text-xl font-bold uppercase text-text-primary group-hover:text-safety transition-colors cursor-pointer line-clamp-1"
                          onClick={() => handleOpenProject(project)}
                        >
                          {project.title}
                        </h3>

                        {project.location && (
                          <div className="flex items-center gap-1.5 text-xs text-text-secondary font-mono">
                            <MapPin className="w-3 h-3 text-text-secondary flex-shrink-0" />
                            <span className="truncate">{project.location}</span>
                          </div>
                        )}

                        {/* 3-Metric Hard Spec Pill Strip (The Report Standard) */}
                        <div className="pt-2 border-t border-border-subtle grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="p-2 rounded-lg bg-surface-subtle border border-border-subtle/50">
                            <span className="text-[9px] uppercase text-text-secondary block">Depth / Scale</span>
                            <span className="font-bold text-text-primary block truncate">
                              {project.basement_depth || 'Deep Basement Pit'}
                            </span>
                          </div>

                          <div className="p-2 rounded-lg bg-surface-subtle border border-border-subtle/50">
                            <span className="text-[9px] uppercase text-text-secondary block">Volume / Earth</span>
                            <span className="font-bold text-text-primary block truncate">
                              {project.volume_cum || 'Hard Basalt Breaking'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => handleOpenProject(project)}
                        className="w-full py-2.5 px-4 rounded-lg bg-surface-subtle hover:bg-safety hover:text-black border border-border-subtle font-header font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                      >
                        <span>View Technical Fact Sheet</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="py-20 text-center space-y-4 bg-surface border border-border-subtle rounded-2xl max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-full bg-safety/10 text-safety flex items-center justify-center mx-auto">
                  <Filter className="w-5 h-5" />
                </div>
                <h3 className="font-header text-xl uppercase font-bold text-text-primary">
                  No Projects Match Your Active Filters
                </h3>
                <p className="text-xs text-text-secondary font-mono max-w-sm mx-auto">
                  Try clearing your search terms or resetting the developer/scope filter.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setScopeFilter('All');
                    setSelectedClient('All');
                  }}
                  className="px-4 py-2 bg-safety text-black font-header font-bold text-xs uppercase tracking-wider rounded-lg"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* TIER 4: IN-PAGE LEAD CONVERSION ANCHOR (PCL Model) */}
        <section className="py-16 px-4 bg-surface-subtle/50 border-t border-border-subtle">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-safety font-bold block">
              Constructability & Feasibility Review
            </span>
            <h2 className="font-header text-3xl sm:text-4xl md:text-5xl uppercase font-bold text-text-primary">
              Planning a Substructure or Piling Package in Mumbai?
            </h2>
            <p className="font-body text-text-secondary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Connect directly with Mr. Ashok Kumar Pal (Proprietor) and our senior geotechnical estimating directors for initial basement rock cutting feasibility, pile socketing verification, and BOQ estimates.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <HashLink
                to="/#contact"
                className="px-6 py-3.5 rounded-lg bg-safety hover:bg-safety-hover text-black font-header font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-safety/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Submit Tender Drawings / RFP</span>
                <ArrowRight className="w-4 h-4" />
              </HashLink>

              <a
                href="tel:+919930900048"
                className="px-6 py-3.5 rounded-lg bg-surface hover:bg-border-subtle border border-border-subtle font-mono text-xs font-bold text-text-primary transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-safety" />
                <span>Direct Line: +91 99309 00048</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* TIER 3: INTERACTIVE TECHNICAL DETAIL DOSSIER (Deep Case Study Modal) */}
      {selectedProject && (() => {
        const pImages = getImages(selectedProject);
        const pClient = selectedProject.client_name || selectedProject.name || 'Private Developer';
        const isDone = (selectedProject.status || '').toLowerCase() === 'completed';
        const pVal = selectedProject.project_value || selectedProject.contractValue;

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
            onClick={handleCloseProject}
          >
            <div 
              className="bg-surface border border-border-subtle rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-border-subtle flex items-start justify-between gap-4 bg-surface-subtle">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-header text-xs font-bold uppercase text-safety flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{pClient}</span>
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                      isDone ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    }`}>
                      {isDone ? 'Completed Landmark' : 'Active Ongoing Site'}
                    </span>
                    {pVal && (
                      <span className="text-[10px] font-mono font-bold text-safety px-2 py-0.5 rounded bg-safety/10 border border-safety/30">
                        {pVal}
                      </span>
                    )}
                  </div>
                  <h2 className="font-header text-2xl sm:text-3xl uppercase font-bold text-text-primary">
                    {selectedProject.title}
                  </h2>
                  {selectedProject.location && (
                    <p className="text-xs text-text-secondary font-mono flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-text-secondary" />
                      <span>{selectedProject.location}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCloseProject}
                  className="p-2 rounded-lg bg-surface hover:bg-border-subtle text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  aria-label="Close Case Study"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs sm:text-sm">
                {/* 8-PILLAR TECHNICAL FACT SHEET TABLE (STRABAG / Bechtel Model) */}
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-safety font-bold block mb-3 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>8-Field Technical Specification Dossier</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
                      <span className="text-[10px] font-mono uppercase text-text-secondary block">Client / Owner</span>
                      <span className="font-header font-bold text-text-primary block mt-0.5">{pClient}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
                      <span className="text-[10px] font-mono uppercase text-text-secondary block">Contract Value</span>
                      <span className="font-mono font-bold text-safety block mt-0.5">{pVal || 'Disclosed under Tender'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
                      <span className="text-[10px] font-mono uppercase text-text-secondary block">Delivery Model</span>
                      <span className="font-header font-bold text-text-primary block mt-0.5">
                        {selectedProject.delivery_model || 'Turnkey Substructure & Shoring'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
                      <span className="text-[10px] font-mono uppercase text-text-secondary block">Depth & Basements</span>
                      <span className="font-mono font-bold text-text-primary block mt-0.5">
                        {selectedProject.basement_depth || '18m Depth / 3-4 Basements'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
                      <span className="text-[10px] font-mono uppercase text-text-secondary block">Earth / Rock Volume</span>
                      <span className="font-mono font-bold text-text-primary block mt-0.5">
                        {selectedProject.volume_cum || '50,000+ CuM Hard Basalt'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
                      <span className="text-[10px] font-mono uppercase text-text-secondary block">Piling Specifications</span>
                      <span className="font-mono text-text-primary block mt-0.5">
                        {selectedProject.piling_spec || '800mm & 1000mm Dia Bored Piles (IS 2911)'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
                      <span className="text-[10px] font-mono uppercase text-text-secondary block">Rock Anchoring</span>
                      <span className="font-mono text-text-primary block mt-0.5">
                        {selectedProject.anchoring_spec || '35T to 65T Multi-Strand Tiebacks (IS 10270)'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
                      <span className="text-[10px] font-mono uppercase text-text-secondary block">Strata Handled</span>
                      <span className="font-mono text-text-primary block mt-0.5">
                        {selectedProject.strata_type || 'Massive Basalt Rock & Coastal Groundwater'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
                      <span className="text-[10px] font-mono uppercase text-text-secondary block">HSE & Safe Hours</span>
                      <span className="font-mono text-emerald-500 font-bold block mt-0.5">
                        {selectedProject.safety_metrics || 'Zero LTI • ISO 45001 Compliance'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* MACHINERY DEPLOYED BANNER */}
                <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-safety/10 flex items-center justify-center text-safety flex-shrink-0">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-text-secondary block">
                        Self-Performed Owned Heavy Fleet Deployed
                      </span>
                      <span className="font-header font-bold text-text-primary block">
                        {selectedProject.machinery_deployed || '2x Poclain EX-380, 4x EX-210 Breakers, 2x Piling Rigs, 16x Dumpers'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-black/20 text-text-secondary whitespace-nowrap">
                    100% In-House Fleet
                  </span>
                </div>

                {/* GEOTECHNICAL CHALLENGE & ENGINEERED SOLUTION */}
                {selectedProject.challenge_solution && (
                  <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle space-y-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-safety font-bold block flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Geotechnical Challenge & Engineered Mitigation</span>
                    </span>
                    <p className="text-text-secondary leading-relaxed font-body">
                      {selectedProject.challenge_solution}
                    </p>
                  </div>
                )}

                {/* SCOPE CHECKLIST */}
                {selectedProject.scope_checklist && (
                  <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle space-y-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-text-primary font-bold block">
                      Executed Package Breakdown
                    </span>
                    <div className="font-mono text-xs text-text-secondary whitespace-pre-line leading-relaxed">
                      {selectedProject.scope_checklist}
                    </div>
                  </div>
                )}

                {/* CAPTIONED PHOTO GALLERY */}
                {pImages.length > 0 && (
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-text-secondary font-bold block mb-3">
                      Site Execution & Progress Photography ({pImages.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {pImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded-lg overflow-hidden border border-border-subtle bg-slate-900 cursor-pointer group"
                          onClick={() => openLightbox(pImages, idx)}
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Maximize2 className="w-5 h-5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Conversion Bar */}
              <div className="p-4 sm:p-5 border-t border-border-subtle bg-surface-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-text-secondary font-mono">
                  Need constructability advice for a similar project?
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href="tel:+919930900048"
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-surface border border-border-subtle text-xs font-mono font-bold text-text-primary hover:text-safety transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-safety" />
                    <span>Call Chief Engineer</span>
                  </a>

                  <HashLink
                    to="/#contact"
                    onClick={handleCloseProject}
                    className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-safety hover:bg-safety-hover text-black font-header font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-safety/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </HashLink>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Lightbox */}
      {isLightboxOpen && lightboxImages.length > 0 && (
        <ProjectLightbox
          images={lightboxImages}
          initialImageIndex={initialImageIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
};