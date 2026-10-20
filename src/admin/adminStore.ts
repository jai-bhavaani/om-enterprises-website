import { projectData as staticProjects } from '../../projects.config';
import { LEADERS as staticTeam } from '../data/team';
import { services as staticServices, stats as staticStats } from '../../data';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { 
  Project, 
  HeroSlide, 
  TeamMember, 
  ContactMessage, 
  MediaItem 
} from '../types/database';

// Initialize default mock media library from project images
const initialMediaLibrary: MediaItem[] = [];
const initialProjects: Project[] = staticProjects.map((p, idx) => {
  const images = (p.images || []).map((imgUrl, imgIdx) => {
    const mediaId = `media-${idx}-${imgIdx}`;
    const mediaItem: MediaItem = {
      id: mediaId,
      filename: `${p.title.replace(/\s+/g, '_')}_${imgIdx + 1}.jpg`,
      storage_path: `projects/${p.title}/${imgIdx + 1}.jpg`,
      public_url: imgUrl,
      file_size_bytes: 420000,
      mime_type: 'image/jpeg',
      alt_text: `${p.title} construction site photograph ${imgIdx + 1}`,
      created_at: new Date(2025, 0, idx + 1).toISOString(),
    };
    initialMediaLibrary.push(mediaItem);

    return {
      id: `pi-${idx}-${imgIdx}`,
      project_id: `proj-${idx}`,
      media_id: mediaId,
      url: imgUrl,
      is_cover: imgIdx === 0,
      display_order: imgIdx,
      created_at: new Date(2025, 0, idx + 1).toISOString(),
    };
  });

  const isMulund = p.title.toLowerCase().includes('mulund') || p.title.toLowerCase().includes('prestige');
  const isPiramal = p.title.toLowerCase().includes('piramal');
  const isRaymond = p.title.toLowerCase().includes('raymond');
  const isLT = p.title.toLowerCase().includes('forest') || p.title.toLowerCase().includes('l & t');
  const isAshirwad = p.title.toLowerCase().includes('ashirwad');
  const isBreach = p.title.toLowerCase().includes('breach');

  const contractVal = (p as any).contractValue || (
    isMulund ? '₹20,05,99,882' :
    isRaymond ? '₹20,00,00,000' :
    isPiramal ? '₹20,50,00,000' :
    isLT ? '₹16,12,21,470' :
    isAshirwad ? '₹1,95,00,000' :
    isBreach ? '₹1,02,50,074' : '₹10,48,42,000'
  );

  return {
    id: `proj-${idx}`,
    title: p.title,
    client_name: p.name,
    scope: p.scope || 'Piling, Anchoring & Excavation',
    status: (p.status === 'Completed' ? 'Completed' : 'In Progress') as any,
    description: `Turnkey execution of ${p.scope || 'substructure packages'} adhering to IS 2911 and IS 10270 standards with dedicated self-performed heavy machinery.`,
    location: isMulund ? 'Mulund West, Mumbai' : isPiramal ? 'Worli Seaface, Mumbai' : isRaymond ? 'Bandra West, Mumbai' : isLT ? 'Powai Corridor, Mumbai' : 'Mumbai Metropolitan Region, MH',
    project_value: contractVal,
    delivery_model: 'Turnkey Substructure, Piling & Deep Excavation',
    basement_depth: isPiramal ? '19.5m Depth / 4 Basements' : isMulund ? '18.0m Depth / 3-4 Basements' : isLT ? '16.5m Depth / 3 Basements' : '14.0m Depth / 3 Basements',
    volume_cum: isMulund ? '85,000 CuM Hard Basalt' : isPiramal ? '65,000 CuM Hard Basalt' : isRaymond ? '90,000 CuM Mass Earthmoving' : '45,000 CuM Earth & Rock',
    piling_spec: '800mm & 1000mm Dia Contiguous Bored Piles (CBP)',
    anchoring_spec: '35T to 65T Multi-Strand Prestressed Rock Anchors',
    strata_type: 'Massive Grade-I Basalt Rock, Fractured Joints & Coastal Water Table',
    machinery_deployed: '2x Poclain EX-380, 4x EX-210 Breakers, 2x Hydraulic Piling Rigs, 16x Heavy Dumpers',
    timeline_duration: p.status === 'Completed' ? 'Completed in 8 Months (Delivered Ahead of Schedule)' : 'Active On-Site Execution',
    safety_metrics: '120,000+ Safe Man-Hours (Zero Incident / 0 LTI)',
    challenge_solution: 'Deep rock excavation in high-density urban environment. Controlled hydraulic rock breaking and continuous piezometer/seismograph monitoring were deployed to ensure zero structural settlement of adjacent towers.',
    scope_checklist: '• Bulk Earthmoving & Hard Basalt Cutting\n• Contiguous Bored Piles (CBP) Shoring Wall\n• High-Load Prestressed Multi-Strand Rock Anchors\n• Continuous Deep Pit Dewatering Network\n• Wire-Mesh Shotcreting & Surface Stabilization',
    is_featured: idx < 4,
    is_published: true,
    display_order: idx,
    created_at: new Date(2024, 6, idx + 1).toISOString(),
    updated_at: new Date(2025, 1, 10).toISOString(),
    images,
  };
});

const initialHeroSlides: HeroSlide[] = initialProjects.slice(0, 5).map((p, idx) => {
  const desktopImg = p.images?.[0]?.url || '';
  const mobileImg = (p.images && p.images.length > 1) ? p.images[1]?.url : desktopImg;
  return {
    id: `hero-${idx}`,
    media_id: p.images?.[0]?.media_id || `media-hero-${idx}`,
    desktop_image_url: desktopImg,
    mobile_image_url: mobileImg,
    title: p.title,
    subtitle: p.scope,
    cta_text: 'View Project',
    cta_link: '/projects',
    is_active: true,
    display_order: idx,
    created_at: new Date().toISOString(),
    media: initialMediaLibrary.find(m => m.public_url === desktopImg),
  };
});

const initialTeam: TeamMember[] = staticTeam.map((member, idx) => ({
  id: `team-${idx}`,
  name: member.name,
  role: member.role,
  bio: member.bio,
  image_url: member.image,
  display_order: idx,
  is_published: true,
  created_at: new Date(2024, 0, 1).toISOString(),
  updated_at: new Date().toISOString(),
}));

const initialMessages: ContactMessage[] = [];

const initialCompanyContent = {
  stats: {
    yearsExperience: 20,
    teamSize: 200,
    satisfactionRate: 100,
  },
  contact: {
    email: 'omenterprise20@gmail.com',
    phone: '+91 99309 00048',
    address: '412, B2B Agrawal Centre, D’Monte Lane, Kanchpada, Malad West, Mumbai – 400064, Maharashtra, India.',
    operatingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
  },
  about: {
    headline: 'A Legacy of Strength',
    description: 'For over 20 years, OM Enterprises has delivered reliable civil and foundational engineering solutions, enabling architects and developers to build complex projects with confidence.',
    establishedYear: '2004',
  }
};

// ============================================================================
// ADMIN LOCAL STORAGE SINGLETON WITH SYNC
// ============================================================================

class AdminStore {
  private projects: Project[] = [];
  private media: MediaItem[] = [];
  private hero: HeroSlide[] = [];
  private team: TeamMember[] = [];
  private messages: ContactMessage[] = [];
  private content = initialCompanyContent;

  constructor() {
    this.loadFromStorage();
    this.syncWithSupabase();
  }

  private loadFromStorage() {
    try {
      const storedProj = localStorage.getItem('om_cms_projects');
      const storedMedia = localStorage.getItem('om_cms_media');
      const storedHero = localStorage.getItem('om_cms_hero');
      const storedTeam = localStorage.getItem('om_cms_team');
      const storedMsgs = localStorage.getItem('om_cms_messages');
      const storedContent = localStorage.getItem('om_cms_content');

      this.projects = storedProj ? JSON.parse(storedProj) : initialProjects;
      this.media = storedMedia ? JSON.parse(storedMedia) : initialMediaLibrary;
      if (storedHero) {
        const parsedHero: HeroSlide[] = JSON.parse(storedHero);
        this.hero = parsedHero.map(s => ({
          ...s,
          desktop_image_url: s.desktop_image_url || s.media?.public_url || '',
          mobile_image_url: s.mobile_image_url || s.desktop_image_url || s.media?.public_url || '',
        }));
      } else {
        this.hero = initialHeroSlides;
      }
      this.team = storedTeam ? JSON.parse(storedTeam) : initialTeam;
      // Filter out any legacy mock demo messages
      this.messages = storedMsgs 
        ? JSON.parse(storedMsgs).filter((m: any) => !m.id?.startsWith('msg-')) 
        : [];
      this.content = storedContent ? JSON.parse(storedContent) : initialCompanyContent;
    } catch {
      this.projects = initialProjects;
      this.media = initialMediaLibrary;
      this.hero = initialHeroSlides;
      this.team = initialTeam;
      this.messages = [];
    }
  }

  public async syncWithSupabase() {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      // 1. Fetch live contact inquiries
      const { data: liveMsgs } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (liveMsgs && liveMsgs.length > 0) {
        this.messages = liveMsgs;
        this.persist();
      }

      // 2. Fetch live media library
      const { data: liveMedia } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (liveMedia && liveMedia.length > 0) {
        this.media = liveMedia;
        this.persist();
      }

      // 3. Fetch live team members
      const { data: liveTeam } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (liveTeam && liveTeam.length > 0) {
        this.team = liveTeam;
        this.persist();
      }
    } catch (e) {
      console.warn('Failed to sync adminStore with Supabase:', e);
    }
  }

  private persist() {
    try {
      localStorage.setItem('om_cms_projects', JSON.stringify(this.projects));
      localStorage.setItem('om_cms_media', JSON.stringify(this.media));
      localStorage.setItem('om_cms_hero', JSON.stringify(this.hero));
      localStorage.setItem('om_cms_team', JSON.stringify(this.team));
      localStorage.setItem('om_cms_messages', JSON.stringify(this.messages));
      localStorage.setItem('om_cms_content', JSON.stringify(this.content));
    } catch (e) {
      console.warn('LocalStorage limit reached or disabled:', e);
    }
  }

  // --- PROJECTS ---
  getProjects(): Project[] {
    return [...this.projects];
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  saveProject(projectData: Partial<Project> & { title: string }): Project {
    const existingIndex = this.projects.findIndex(p => p.id === projectData.id);
    if (existingIndex >= 0) {
      const updated: Project = {
        ...this.projects[existingIndex],
        ...projectData,
        updated_at: new Date().toISOString(),
      };
      this.projects[existingIndex] = updated;
      this.persist();
      return updated;
    } else {
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        title: projectData.title,
        client_name: projectData.client_name || projectData.title,
        scope: projectData.scope || 'Civil & Infrastructure',
        status: projectData.status || 'In Progress',
        description: projectData.description || '',
        location: projectData.location || 'Mumbai, Maharashtra',
        project_value: projectData.project_value || '',
        delivery_model: projectData.delivery_model || 'Turnkey Substructure & Shoring',
        basement_depth: projectData.basement_depth || '18m Depth / 3-4 Basements',
        volume_cum: projectData.volume_cum || '50,000+ CuM Hard Basalt',
        piling_spec: projectData.piling_spec || '800mm & 1000mm Dia Contiguous Bored Piles (IS 2911)',
        anchoring_spec: projectData.anchoring_spec || '35T to 65T Multi-Strand Prestressed Rock Anchors (IS 10270)',
        strata_type: projectData.strata_type || 'Massive Basalt Rock & High Coastal Water Table',
        machinery_deployed: projectData.machinery_deployed || '2x Poclain EX-380, 4x EX-210 Breakers, 2x Piling Rigs, 16x Dumpers',
        timeline_duration: projectData.timeline_duration || 'Completed on Fast-Track Schedule',
        safety_metrics: projectData.safety_metrics || 'Zero LTI • Strict PPE & Vibration Compliance',
        challenge_solution: projectData.challenge_solution || '',
        scope_checklist: projectData.scope_checklist || '',
        is_featured: projectData.is_featured ?? false,
        is_published: projectData.is_published ?? true,
        display_order: this.projects.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: projectData.images || [],
      };
      this.projects.unshift(newProject);
      this.persist();
      return newProject;
    }
  }

  deleteProject(id: string): boolean {
    this.projects = this.projects.filter(p => p.id !== id);
    this.persist();
    return true;
  }

  // --- MEDIA ---
  getMedia(): MediaItem[] {
    return [...this.media];
  }

  addMediaItem(item: Omit<MediaItem, 'id' | 'created_at'>): MediaItem {
    const newItem: MediaItem = {
      ...item,
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
    };
    this.media.unshift(newItem);
    this.persist();
    return newItem;
  }

  getMediaUsage(mediaId: string): string[] {
    const usedBy: string[] = [];
    const mediaItem = this.media.find(m => m.id === mediaId);
    if (!mediaItem) return usedBy;

    this.projects.forEach(p => {
      const isUsed = p.images?.some(img => img.media_id === mediaId || img.url === mediaItem.public_url);
      if (isUsed) {
        usedBy.push(`Project: ${p.title}`);
      }
    });

    this.hero.forEach(h => {
      if (
        h.media_id === mediaId ||
        h.mobile_media_id === mediaId ||
        h.desktop_image_url === mediaItem.public_url ||
        h.mobile_image_url === mediaItem.public_url ||
        h.media?.public_url === mediaItem.public_url
      ) {
        usedBy.push(`Hero Slide: ${h.title}`);
      }
    });

    return usedBy;
  }

  deleteMediaItem(id: string): { success: boolean; error?: string } {
    const usage = this.getMediaUsage(id);
    if (usage.length > 0) {
      return {
        success: false,
        error: `Cannot delete. Image is actively in use by: ${usage.join(', ')}. Remove it from these sections first.`
      };
    }
    this.media = this.media.filter(m => m.id !== id);
    this.persist();
    return { success: true };
  }

  // --- HERO ---
  getHeroSlides(): HeroSlide[] {
    return [...this.hero].sort((a, b) => a.display_order - b.display_order);
  }

  saveHeroSlides(slides: HeroSlide[]) {
    this.hero = slides.map((s, idx) => ({
      ...s,
      display_order: idx,
      desktop_image_url: s.desktop_image_url || s.media?.public_url || '',
      mobile_image_url: s.mobile_image_url || s.desktop_image_url || s.media?.public_url || '',
    }));
    this.persist();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('om_hero_updated'));
    }
  }

  // --- TEAM ---
  getTeam(): TeamMember[] {
    return [...this.team].sort((a, b) => a.display_order - b.display_order);
  }

  saveTeamMember(memberData: Partial<TeamMember> & { name: string; role: string; image_url: string }): TeamMember {
    const idx = this.team.findIndex(m => m.id === memberData.id);
    if (idx >= 0) {
      const updated = { ...this.team[idx], ...memberData, updated_at: new Date().toISOString() };
      this.team[idx] = updated;
      this.persist();
      return updated;
    } else {
      const newMember: TeamMember = {
        id: `team-${Date.now()}`,
        name: memberData.name,
        role: memberData.role,
        bio: memberData.bio || '',
        image_url: memberData.image_url,
        display_order: this.team.length,
        is_published: memberData.is_published ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.team.push(newMember);
      this.persist();
      return newMember;
    }
  }

  deleteTeamMember(id: string): boolean {
    this.team = this.team.filter(m => m.id !== id);
    this.persist();
    return true;
  }

  // --- MESSAGES ---
  getMessages(): ContactMessage[] {
    return [...this.messages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  updateMessageStatus(id: string, status: ContactMessage['status'], notes?: string): boolean {
    const msg = this.messages.find(m => m.id === id);
    if (msg) {
      msg.status = status;
      if (notes !== undefined) msg.internal_notes = notes;
      this.persist();

      if (isSupabaseConfigured && supabase) {
        supabase
          .from('contact_messages')
          .update({ status, internal_notes: notes })
          .eq('id', id)
          .then();
      }
      return true;
    }
    return false;
  }

  deleteMessage(id: string): boolean {
    this.messages = this.messages.filter(m => m.id !== id);
    this.persist();

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)
        .then();
    }
    return true;
  }

  // --- CONTENT ---
  getContent() {
    return { ...this.content };
  }

  saveContent(newContent: typeof initialCompanyContent) {
    this.content = newContent;
    this.persist();
  }
}

export const adminStore = new AdminStore();
