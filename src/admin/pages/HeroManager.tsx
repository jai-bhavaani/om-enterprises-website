import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Eye, 
  Check, 
  EyeOff, 
  Save, 
  Monitor, 
  Smartphone, 
  Image as ImageIcon, 
  Search, 
  X, 
  FolderOpen,
  Upload,
  Loader2
} from 'lucide-react';
import { adminStore } from '../adminStore';
import { uploadFileToStorage } from '../../lib/storage';
import type { HeroSlide, MediaItem } from '../../types/database';

export const HeroManager: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(() => adminStore.getHeroSlides());
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Device file upload state
  const [isUploadingSlideImage, setIsUploadingSlideImage] = useState(false);
  const slideFileInputRef = useRef<HTMLInputElement | null>(null);

  // Media picker modal state: target slide index and which image slot ('desktop' or 'mobile')
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{
    slideIndex: number;
    slot: 'desktop' | 'mobile';
  } | null>(null);
  const [mediaSearchTerm, setMediaSearchTerm] = useState('');

  const mediaLibrary: MediaItem[] = adminStore.getMedia();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const list = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    setSlides(list);
    setActivePreviewIndex(targetIndex);
  };

  const handleToggleActive = (index: number) => {
    const list = [...slides];
    list[index].is_active = !list[index].is_active;
    setSlides(list);
  };

  const handleUpdateField = (index: number, field: keyof HeroSlide, value: any) => {
    const list = [...slides];
    (list[index] as any)[field] = value;
    setSlides(list);
  };

  const handleDeleteSlide = (index: number) => {
    const list = slides.filter((_, i) => i !== index);
    setSlides(list);
    if (activePreviewIndex >= list.length) {
      setActivePreviewIndex(Math.max(0, list.length - 1));
    }
  };

  const handleAddSlide = () => {
    const media = adminStore.getMedia();
    const fallbackDesktop = media[0]?.public_url || 'https://placehold.co/1920x1080/png?text=OM+Hero+Slide';
    const fallbackMobile = media.length > 1 ? media[1]?.public_url : fallbackDesktop;

    const newSlide: HeroSlide = {
      id: `hero-${Date.now()}`,
      media_id: media[0]?.id || 'media-default',
      desktop_image_url: fallbackDesktop,
      mobile_image_url: fallbackMobile,
      title: 'New Featured Engineering Project',
      subtitle: 'Civil & Foundation Engineering',
      cta_text: 'View Project',
      cta_link: '/projects',
      is_active: true,
      display_order: slides.length,
      created_at: new Date().toISOString(),
      media: {
        id: 'media-new',
        filename: 'slide.jpg',
        storage_path: 'hero/slide.jpg',
        public_url: fallbackDesktop,
        file_size_bytes: 500000,
        mime_type: 'image/jpeg',
        created_at: new Date().toISOString(),
      },
    };

    setSlides([...slides, newSlide]);
    setActivePreviewIndex(slides.length);
  };

  const handleSelectMedia = (url: string, mediaId?: string) => {
    if (!mediaPickerTarget) return;
    const { slideIndex, slot } = mediaPickerTarget;
    const list = [...slides];

    if (slot === 'desktop') {
      list[slideIndex].desktop_image_url = url;
      if (mediaId) list[slideIndex].media_id = mediaId;
      if (list[slideIndex].media) {
        list[slideIndex].media!.public_url = url;
      }
    } else {
      list[slideIndex].mobile_image_url = url;
      if (mediaId) list[slideIndex].mobile_media_id = mediaId;
    }

    setSlides(list);
    setMediaPickerTarget(null);
    setMediaSearchTerm('');
    showToast(`Updated ${slot === 'desktop' ? 'Desktop' : 'Mobile'} image.`);
  };

  const handleDeviceSlideUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !mediaPickerTarget) return;
    const file = e.target.files[0];
    setIsUploadingSlideImage(true);
    try {
      const res = await uploadFileToStorage(file, 'hero', `${slides[mediaPickerTarget.slideIndex]?.title || 'hero'}_slide`);
      if (res.success && res.mediaItem) {
        adminStore.addMediaItem(res.mediaItem);
        handleSelectMedia(res.mediaItem.public_url, res.mediaItem.id);
        showToast('Slide image uploaded to Supabase storage.');
      } else {
        showToast(res.error || 'Failed to upload image');
      }
    } catch (err: any) {
      showToast('Error uploading slide image');
    } finally {
      setIsUploadingSlideImage(false);
      if (slideFileInputRef.current) slideFileInputRef.current.value = '';
    }
  };

  const handleSaveAll = () => {
    adminStore.saveHeroSlides(slides);
    showToast('Hero carousel slides published to live homepage.');
  };

  const currentPreviewSlide = slides[activePreviewIndex] || slides[0];

  // Resolve current active preview image depending on preview viewport
  const currentDesktopImg = currentPreviewSlide?.desktop_image_url || currentPreviewSlide?.media?.public_url || 'https://placehold.co/1920x1080';
  const currentMobileImg = currentPreviewSlide?.mobile_image_url || currentDesktopImg;
  const activePreviewImg = previewViewport === 'mobile' ? currentMobileImg : currentDesktopImg;

  const filteredMedia = mediaLibrary.filter(m => 
    m.filename.toLowerCase().includes(mediaSearchTerm.toLowerCase()) ||
    (m.alt_text || '').toLowerCase().includes(mediaSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-safety text-black font-header font-bold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-header text-2xl sm:text-3xl font-bold uppercase text-text-primary tracking-wide flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-safety" />
            <span>Homepage Hero Carousel</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Configure selected slides for the live homepage with separate aspect ratios for Desktop (16:9) and Mobile (9:16).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddSlide}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-subtle hover:bg-border-subtle text-text-primary font-mono text-xs border border-border-subtle transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-safety" />
            <span>Add Slide</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-safety hover:bg-safety-hover text-[var(--color-safety-text)] font-header font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-safety/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Live Preview Screen with Viewport Switcher */}
      {currentPreviewSlide && (
        <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-xl">
          {/* Preview Header & Viewport Switcher */}
          <div className="px-4 py-3 bg-surface-subtle border-b border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-text-primary font-bold">
                Live Simulation: Slide #{activePreviewIndex + 1}
              </span>
              <span className="text-text-secondary truncate max-w-[200px] hidden sm:inline">
                ({currentPreviewSlide.title})
              </span>
            </div>

            {/* Viewport Selector */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border-subtle">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  previewViewport === 'desktop'
                    ? 'bg-safety text-[var(--color-safety-text)] font-bold shadow-xs'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (16:9)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  previewViewport === 'mobile'
                    ? 'bg-safety text-[var(--color-safety-text)] font-bold shadow-xs'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (9:16)</span>
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="p-4 sm:p-6 bg-surface-subtle/40 flex items-center justify-center">
            {previewViewport === 'desktop' ? (
              /* Desktop Viewport Preview (16:9) */
              <div className="relative h-72 sm:h-80 md:h-96 w-full rounded-xl bg-slate-900 overflow-hidden flex items-center hero-preview-canvas shadow-lg border border-border-subtle">
                <img
                  src={activePreviewImg}
                  alt={currentPreviewSlide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent pointer-events-none"></div>

                <div className="relative z-10 px-6 sm:px-12 max-w-xl text-white">
                  {currentPreviewSlide.subtitle && (
                    <span className="text-safety font-body text-xs sm:text-sm uppercase tracking-widest block mb-2 font-bold drop-shadow-xs">
                      {currentPreviewSlide.subtitle}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-4xl font-header font-bold text-white uppercase leading-tight mb-4 drop-shadow-sm">
                    {currentPreviewSlide.title}
                  </h2>
                  <div className="inline-block px-4 py-2 bg-safety text-black font-header font-bold text-xs uppercase tracking-wider rounded shadow-sm">
                    {currentPreviewSlide.cta_text || 'View Project'}
                  </div>
                </div>

                <div className="absolute bottom-3 right-4 z-10 font-mono text-[10px] bg-black/60 backdrop-blur-xs text-white/80 px-2 py-1 rounded border border-white/20">
                  Desktop 16:9 • 1920 &times; 1080 Viewport
                </div>
              </div>
            ) : (
              /* Mobile Viewport Preview (9:16 Smartphone Mockup) */
              <div className="relative w-[320px] sm:w-[350px] h-[540px] rounded-[36px] bg-slate-950 overflow-hidden flex flex-col justify-end p-6 border-4 border-slate-700 shadow-2xl hero-preview-canvas">
                {/* Smartphone Speaker Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-20"></div>

                <img
                  src={activePreviewImg}
                  alt={currentPreviewSlide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none"></div>

                <div className="relative z-10 text-white mb-4">
                  {currentPreviewSlide.subtitle && (
                    <span className="text-safety font-body text-[11px] uppercase tracking-widest block mb-1 font-bold">
                      {currentPreviewSlide.subtitle}
                    </span>
                  )}
                  <h2 className="text-xl font-header font-bold text-white uppercase leading-tight mb-3">
                    {currentPreviewSlide.title}
                  </h2>
                  <div className="w-full text-center py-2.5 bg-safety text-black font-header font-bold text-xs uppercase tracking-wider rounded">
                    {currentPreviewSlide.cta_text || 'View Project'}
                  </div>
                </div>

                <div className="absolute top-10 right-4 z-10 font-mono text-[9px] bg-black/70 backdrop-blur-xs text-white/90 px-2 py-0.5 rounded border border-white/20">
                  Mobile 9:16
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide Stack Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-header text-sm font-bold uppercase text-text-primary tracking-wider">
            Configured Sequence ({slides.length} Slides)
          </h3>
          <span className="text-xs font-mono text-text-secondary">
            {slides.filter(s => s.is_active).length} Active on Live Site
          </span>
        </div>

        <div className="space-y-3">
          {slides.map((slide, index) => {
            const desktopThumb = slide.desktop_image_url || slide.media?.public_url || '';
            const mobileThumb = slide.mobile_image_url || desktopThumb;
            const isSelected = activePreviewIndex === index;

            return (
              <div
                key={slide.id || index}
                onClick={() => setActivePreviewIndex(index)}
                className={`p-4 rounded-xl border bg-surface transition-all cursor-pointer ${
                  isSelected
                    ? 'border-safety ring-2 ring-safety/30 shadow-md'
                    : 'border-border-subtle hover:border-safety/40 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Sequence number */}
                    <span className="w-7 h-7 rounded-lg bg-surface-subtle text-safety font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 border border-border-subtle">
                      #{index + 1}
                    </span>

                    {/* Dual Mini Thumbnails */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Desktop landscape thumb */}
                      <div className="w-14 h-9 rounded bg-surface-subtle overflow-hidden border border-border-subtle relative" title="Desktop Image (16:9)">
                        <img src={desktopThumb} alt="Desktop" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 bg-black/70 text-[8px] font-mono text-white px-0.5">D</span>
                      </div>
                      {/* Mobile portrait thumb */}
                      <div className="w-6 h-9 rounded bg-surface-subtle overflow-hidden border border-border-subtle relative" title="Mobile Image (9:16)">
                        <img src={mobileThumb} alt="Mobile" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 bg-black/70 text-[8px] font-mono text-white px-0.5">M</span>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-header text-sm font-bold text-text-primary uppercase truncate">
                        {slide.title}
                      </h4>
                      <p className="text-xs text-text-secondary truncate">
                        {slide.subtitle || 'No subtitle configured'}
                      </p>
                    </div>
                  </div>

                  {/* Inline Controls */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(index);
                      }}
                      className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 border transition-colors cursor-pointer ${
                        slide.is_active
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-surface-subtle text-text-secondary border-border-subtle'
                      }`}
                      title="Toggle Visibility on Homepage"
                    >
                      {slide.is_active ? <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span className="font-bold">{slide.is_active ? 'Active' : 'Hidden'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSlide(index, 'up');
                      }}
                      className="p-1.5 rounded-lg bg-surface-subtle hover:bg-border-subtle text-text-primary disabled:opacity-30 border border-border-subtle cursor-pointer transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={index === slides.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSlide(index, 'down');
                      }}
                      className="p-1.5 rounded-lg bg-surface-subtle hover:bg-border-subtle text-text-primary disabled:opacity-30 border border-border-subtle cursor-pointer transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlide(index);
                      }}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-400 border border-red-200 dark:border-red-900/40 cursor-pointer transition-colors"
                      title="Remove Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Editing Panel when selected */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-border-subtle space-y-4" onClick={(e) => e.stopPropagation()}>
                    {/* SECTION: SCREEN RATIO MEDIA SELECTION */}
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-safety font-bold block mb-2">
                        Screen Ratio Photography (Desktop & Mobile)
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Desktop Image Slot (16:9) */}
                        <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-subtle/50 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-text-primary flex items-center gap-1.5">
                              <Monitor className="w-3.5 h-3.5 text-safety" />
                              <span>Desktop Screen (16:9 Landscape)</span>
                            </span>
                            <span className="text-[10px] font-mono text-text-secondary bg-surface px-2 py-0.5 rounded border border-border-subtle">
                              1920 × 1080
                            </span>
                          </div>

                          {/* Desktop Thumbnail Preview */}
                          <div className="aspect-video w-full rounded-lg bg-surface border border-border-subtle overflow-hidden relative group/img">
                            <img
                              src={desktopThumb}
                              alt="Desktop preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setMediaPickerTarget({ slideIndex: index, slot: 'desktop' })}
                                className="px-3 py-1.5 rounded bg-safety text-[var(--color-safety-text)] font-header font-bold text-xs uppercase cursor-pointer"
                              >
                                Change Image
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={slide.desktop_image_url || ''}
                              onChange={(e) => handleUpdateField(index, 'desktop_image_url', e.target.value)}
                              placeholder="Desktop image URL or /src/assets/..."
                              className="flex-1 bg-surface border border-border-subtle rounded px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-safety font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setMediaPickerTarget({ slideIndex: index, slot: 'desktop' })}
                              className="px-2.5 py-1.5 rounded bg-surface hover:bg-border-subtle border border-border-subtle text-xs font-mono text-text-primary flex items-center gap-1 cursor-pointer transition-colors"
                              title="Choose from Media Library"
                            >
                              <FolderOpen className="w-3.5 h-3.5 text-safety" />
                              <span className="hidden sm:inline">Library</span>
                            </button>
                          </div>
                        </div>

                        {/* Mobile Image Slot (9:16) */}
                        <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-subtle/50 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-text-primary flex items-center gap-1.5">
                              <Smartphone className="w-3.5 h-3.5 text-safety" />
                              <span>Mobile Screen (9:16 Portrait)</span>
                            </span>
                            <span className="text-[10px] font-mono text-text-secondary bg-surface px-2 py-0.5 rounded border border-border-subtle">
                              1080 × 1920
                            </span>
                          </div>

                          {/* Mobile Thumbnail Preview */}
                          <div className="h-32 w-20 mx-auto rounded-lg bg-surface border border-border-subtle overflow-hidden relative group/mob">
                            <img
                              src={mobileThumb}
                              alt="Mobile preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/mob:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setMediaPickerTarget({ slideIndex: index, slot: 'mobile' })}
                                className="px-2 py-1 rounded bg-safety text-[var(--color-safety-text)] font-header font-bold text-[10px] uppercase cursor-pointer"
                              >
                                Change
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={slide.mobile_image_url || ''}
                              onChange={(e) => handleUpdateField(index, 'mobile_image_url', e.target.value)}
                              placeholder="Mobile portrait URL (fallback to desktop if empty)"
                              className="flex-1 bg-surface border border-border-subtle rounded px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-safety font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setMediaPickerTarget({ slideIndex: index, slot: 'mobile' })}
                              className="px-2.5 py-1.5 rounded bg-surface hover:bg-border-subtle border border-border-subtle text-xs font-mono text-text-primary flex items-center gap-1 cursor-pointer transition-colors"
                              title="Choose from Media Library"
                            >
                              <FolderOpen className="w-3.5 h-3.5 text-safety" />
                              <span className="hidden sm:inline">Library</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION: TEXT & CTA CONTENT */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-text-secondary mb-1">
                          Headline Title
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => handleUpdateField(index, 'title', e.target.value)}
                          className="w-full bg-surface border border-border-subtle rounded px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-safety"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-text-secondary mb-1">
                          Subtitle / Scope Category
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle || ''}
                          onChange={(e) => handleUpdateField(index, 'subtitle', e.target.value)}
                          className="w-full bg-surface border border-border-subtle rounded px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-safety"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-text-secondary mb-1">
                          Button CTA Text & Link
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={slide.cta_text || ''}
                            onChange={(e) => handleUpdateField(index, 'cta_text', e.target.value)}
                            placeholder="View Project"
                            className="w-1/2 bg-surface border border-border-subtle rounded px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-safety"
                          />
                          <input
                            type="text"
                            value={slide.cta_link || ''}
                            onChange={(e) => handleUpdateField(index, 'cta_link', e.target.value)}
                            placeholder="/projects"
                            className="w-1/2 bg-surface border border-border-subtle rounded px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-safety"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MEDIA LIBRARY QUICK PICKER MODAL                                          */}
      {/* ========================================================================= */}
      {mediaPickerTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border-subtle rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-subtle/50">
              <div>
                <h3 className="font-header text-lg font-bold uppercase text-text-primary tracking-wide flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-safety" />
                  <span>
                    Select {mediaPickerTarget.slot === 'desktop' ? 'Desktop (16:9 Landscape)' : 'Mobile (9:16 Portrait)'} Photograph
                  </span>
                </h3>
                <p className="text-xs text-text-secondary font-mono">
                  Slide #{mediaPickerTarget.slideIndex + 1}: {slides[mediaPickerTarget.slideIndex]?.title}
                </p>
              </div>
              <button
                onClick={() => setMediaPickerTarget(null)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions & Search filter */}
            <input
              type="file"
              ref={slideFileInputRef}
              onChange={handleDeviceSlideUpload}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
            />

            <div className="p-4 border-b border-border-subtle bg-surface flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  value={mediaSearchTerm}
                  onChange={(e) => setMediaSearchTerm(e.target.value)}
                  placeholder="Filter media library by filename or keywords..."
                  className="w-full bg-surface-subtle border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-xs text-text-primary focus:outline-none focus:border-safety"
                />
              </div>

              <button
                type="button"
                disabled={isUploadingSlideImage}
                onClick={() => slideFileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-safety hover:bg-safety-hover text-black font-header font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-safety/20 whitespace-nowrap"
              >
                {isUploadingSlideImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload From Device</span>
                  </>
                )}
              </button>
            </div>

            {/* Grid of Library Media */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectMedia(item.public_url, item.id)}
                  className="group relative aspect-video bg-surface-subtle rounded-xl overflow-hidden border border-border-subtle hover:border-safety cursor-pointer shadow-xs transition-all"
                >
                  <img
                    src={item.public_url}
                    alt={item.alt_text || item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                    <span className="text-[10px] font-mono truncate">{item.filename}</span>
                    <span className="text-[9px] text-safety uppercase font-bold mt-0.5">Click to Assign</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border-subtle bg-surface-subtle/50 flex justify-between items-center text-xs">
              <span className="text-text-secondary font-mono">
                {filteredMedia.length} assets available
              </span>
              <button
                type="button"
                onClick={() => setMediaPickerTarget(null)}
                className="px-4 py-2 rounded-lg bg-surface hover:bg-border-subtle text-text-primary border border-border-subtle font-mono transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
