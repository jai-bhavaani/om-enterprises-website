import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Project, HeroSlide, TeamMember, ContactMessage } from '../types/database';

const defaultSupabaseUrl = 'https://cuorugoykxvkldyztiin.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1b3J1Z295a3h2a2xkeXp0aWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNDE0MDUsImV4cCI6MjEwNzkxNzQwNX0.QI36gtYJw5kXWGVbmVreefFr5GV46ofo4_MODi4oHRM';

const rawUrl = (
  import.meta.env.VITE_SUPABASE_URL || 
  (import.meta.env as any).SUPABASE_URL || 
  defaultSupabaseUrl
).trim();
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  (import.meta.env as any).SUPABASE_ANON_KEY || 
  defaultAnonKey
).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Log a helpful warning in development if Supabase credentials are missing
 */
if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.info(
    '%c[OM Enterprises CMS]%c Supabase credentials not set in .env. Running in local fallback mode with bundled static data.',
    'color: #FF6B00; font-weight: bold;',
    'color: inherit;'
  );
}

// ============================================================================
// DATA ACCESS LAYER
// ============================================================================

/**
 * Fetch all published projects for the public website
 */
export async function getPublishedProjects(): Promise<Project[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (
        id,
        is_cover,
        display_order,
        media_library (
          public_url,
          alt_text
        )
      )
    `)
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching projects from Supabase:', error);
    throw error;
  }

  // Transform nested relations into clean UI-ready format
  return (data || []).map((p: any) => ({
    ...p,
    images: (p.project_images || [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((pi: any) => ({
        id: pi.id,
        url: pi.media_library?.public_url || '',
        is_cover: pi.is_cover,
        display_order: pi.display_order,
      })),
  }));
}

/**
 * Fetch active hero slides for the public homepage carousel
 */
export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('hero_slides')
    .select(`
      *,
      media_library (
        public_url,
        alt_text
      )
    `)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching hero slides from Supabase:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch published team members
 */
export async function getPublishedTeam(): Promise<TeamMember[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching team members from Supabase:', error);
    throw error;
  }

  return data || [];
}

export function isUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Submit client contact message from the website contact form
 */
export async function submitContactInquiry(message: {
  full_name: string;
  email: string;
  phone?: string;
  project_location?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { 
      success: true, 
      error: 'Running in offline simulation mode. Set Supabase keys to persist in live database.' 
    };
  }

  const { error } = await supabase
    .from('contact_messages')
    .insert([
      {
        full_name: message.full_name,
        email: message.email,
        phone: message.phone || null,
        project_location: message.project_location || null,
        message: message.message,
        status: 'New',
      },
    ]);

  if (error) {
    console.error('Error submitting contact inquiry:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================================================
// ADMIN FULL-STACK CRUD OPERATIONS
// ============================================================================

/**
 * Fetch all projects (published & draft) for the Admin CMS
 */
export async function getAllProjects(): Promise<Project[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (
        id,
        media_id,
        is_cover,
        display_order,
        media_library (
          id,
          public_url,
          alt_text
        )
      )
    `)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all projects:', error);
    throw error;
  }

  return (data || []).map((p: any) => ({
    ...p,
    images: (p.project_images || [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((pi: any) => ({
        id: pi.id,
        media_id: pi.media_id,
        url: pi.media_library?.public_url || '',
        is_cover: pi.is_cover,
        display_order: pi.display_order,
      })),
  }));
}

/**
 * Create a new Project in Supabase and link its project_images
 */
export async function createProjectRecord(
  projectData: Partial<Project> & { title: string }
): Promise<{ success: boolean; data?: Project; error?: string }> {
  if (!supabase) return { success: false, error: 'Database client not connected' };

  try {
    const payload = {
      title: projectData.title,
      client_name: projectData.client_name || projectData.title,
      scope: projectData.scope || 'Piling, Anchoring & Excavation',
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
      display_order: projectData.display_order ?? 0,
    };

    const { data: newProj, error: pErr } = await supabase
      .from('projects')
      .insert([payload])
      .select()
      .single();

    if (pErr) throw pErr;

    const insertedImages: any[] = [];
    if (projectData.images && projectData.images.length > 0) {
      const validImages = projectData.images.filter(img => img.media_id && isUUID(img.media_id));
      if (validImages.length > 0) {
        const imagePayloads = validImages.map((img, idx) => ({
          project_id: newProj.id,
          media_id: img.media_id,
          is_cover: img.is_cover ?? idx === 0,
          display_order: idx,
        }));

        const { data: imgData, error: imgErr } = await supabase
          .from('project_images')
          .insert(imagePayloads)
          .select(`*, media_library(public_url)`);

        if (!imgErr && imgData) {
          imgData.forEach((pi: any) => {
            insertedImages.push({
              id: pi.id,
              media_id: pi.media_id,
              url: pi.media_library?.public_url || '',
              is_cover: pi.is_cover,
              display_order: pi.display_order,
            });
          });
        }
      }
    }

    return {
      success: true,
      data: {
        ...newProj,
        images: insertedImages,
      },
    };
  } catch (err: any) {
    console.error('Error creating project:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Update an existing Project in Supabase and sync its project_images
 */
export async function updateProjectRecord(
  id: string,
  projectData: Partial<Project>
): Promise<{ success: boolean; data?: Project; error?: string }> {
  if (!supabase) return { success: false, error: 'Database client not connected' };

  try {
    const payload: any = {
      updated_at: new Date().toISOString(),
    };
    if (projectData.title !== undefined) payload.title = projectData.title;
    if (projectData.client_name !== undefined) payload.client_name = projectData.client_name;
    if (projectData.scope !== undefined) payload.scope = projectData.scope;
    if (projectData.status !== undefined) payload.status = projectData.status;
    if (projectData.description !== undefined) payload.description = projectData.description;
    if (projectData.location !== undefined) payload.location = projectData.location;
    if (projectData.project_value !== undefined) payload.project_value = projectData.project_value;
    if (projectData.delivery_model !== undefined) payload.delivery_model = projectData.delivery_model;
    if (projectData.basement_depth !== undefined) payload.basement_depth = projectData.basement_depth;
    if (projectData.volume_cum !== undefined) payload.volume_cum = projectData.volume_cum;
    if (projectData.piling_spec !== undefined) payload.piling_spec = projectData.piling_spec;
    if (projectData.anchoring_spec !== undefined) payload.anchoring_spec = projectData.anchoring_spec;
    if (projectData.strata_type !== undefined) payload.strata_type = projectData.strata_type;
    if (projectData.machinery_deployed !== undefined) payload.machinery_deployed = projectData.machinery_deployed;
    if (projectData.timeline_duration !== undefined) payload.timeline_duration = projectData.timeline_duration;
    if (projectData.safety_metrics !== undefined) payload.safety_metrics = projectData.safety_metrics;
    if (projectData.challenge_solution !== undefined) payload.challenge_solution = projectData.challenge_solution;
    if (projectData.scope_checklist !== undefined) payload.scope_checklist = projectData.scope_checklist;
    if (projectData.is_featured !== undefined) payload.is_featured = projectData.is_featured;
    if (projectData.is_published !== undefined) payload.is_published = projectData.is_published;
    if (projectData.display_order !== undefined) payload.display_order = projectData.display_order;

    const { data: updatedProj, error: pErr } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (pErr) throw pErr;

    // Synchronize images if images array is supplied
    if (projectData.images !== undefined) {
      await supabase.from('project_images').delete().eq('project_id', id);

      const validImages = projectData.images.filter(img => img.media_id && isUUID(img.media_id));
      if (validImages.length > 0) {
        const imagePayloads = validImages.map((img, idx) => ({
          project_id: id,
          media_id: img.media_id,
          is_cover: img.is_cover ?? idx === 0,
          display_order: idx,
        }));

        await supabase.from('project_images').insert(imagePayloads);
      }
    }

    return { success: true, data: updatedProj };
  } catch (err: any) {
    console.error('Error updating project:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete a Project and its linked project_images from Supabase
 */
export async function deleteProjectRecord(id: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database client not connected' };

  try {
    await supabase.from('project_images').delete().eq('project_id', id);
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting project:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all hero slides for Admin CMS
 */
export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('hero_slides')
    .select(`
      *,
      media_library (
        id,
        public_url,
        alt_text
      )
    `)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all hero slides:', error);
    throw error;
  }

  return (data || []).map((s: any) => ({
    ...s,
    desktop_image_url: s.desktop_image_url || s.media_library?.public_url || '',
    mobile_image_url: s.mobile_image_url || s.desktop_image_url || s.media_library?.public_url || '',
    media: s.media_library,
  }));
}

/**
 * Save / Publish Hero Carousel Slides to Supabase
 */
export async function saveHeroSlidesToDb(slides: HeroSlide[]): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database client not connected' };

  try {
    const currentValidUuids = slides.map(s => s.id).filter(isUUID);
    if (currentValidUuids.length > 0) {
      await supabase.from('hero_slides').delete().not('id', 'in', `(${currentValidUuids.join(',')})`);
    }

    for (let idx = 0; idx < slides.length; idx++) {
      const s = slides[idx];
      const mediaId = isUUID(s.media_id) ? s.media_id : null;

      if (isUUID(s.id)) {
        await supabase
          .from('hero_slides')
          .update({
            title: s.title,
            subtitle: s.subtitle || '',
            cta_text: s.cta_text || 'View Project',
            cta_link: s.cta_link || '/projects',
            is_active: s.is_active ?? true,
            display_order: idx,
            media_id: mediaId,
          })
          .eq('id', s.id);
      } else if (mediaId) {
        const { data: createdSlide } = await supabase
          .from('hero_slides')
          .insert([{
            title: s.title,
            subtitle: s.subtitle || '',
            cta_text: s.cta_text || 'View Project',
            cta_link: s.cta_link || '/projects',
            is_active: s.is_active ?? true,
            display_order: idx,
            media_id: mediaId,
          }])
          .select()
          .single();

        if (createdSlide) {
          s.id = createdSlide.id;
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error saving hero slides:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all Team Members for Admin CMS
 */
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all team members:', error);
    throw error;
  }

  return data || [];
}

/**
 * Create a Team Member record in Supabase
 */
export async function createTeamMemberRecord(
  member: Partial<TeamMember> & { name: string; role: string }
): Promise<{ success: boolean; data?: TeamMember; error?: string }> {
  if (!supabase) return { success: false, error: 'Database client not connected' };

  try {
    const { data, error } = await supabase
      .from('team_members')
      .insert([{
        name: member.name,
        role: member.role,
        bio: member.bio || '',
        image_url: member.image_url || '',
        display_order: member.display_order ?? 0,
        is_published: member.is_published ?? true,
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Update a Team Member record in Supabase
 */
export async function updateTeamMemberRecord(
  id: string,
  member: Partial<TeamMember>
): Promise<{ success: boolean; data?: TeamMember; error?: string }> {
  if (!supabase) return { success: false, error: 'Database client not connected' };

  try {
    const payload: any = { updated_at: new Date().toISOString() };
    if (member.name !== undefined) payload.name = member.name;
    if (member.role !== undefined) payload.role = member.role;
    if (member.bio !== undefined) payload.bio = member.bio;
    if (member.image_url !== undefined) payload.image_url = member.image_url;
    if (member.display_order !== undefined) payload.display_order = member.display_order;
    if (member.is_published !== undefined) payload.is_published = member.is_published;

    const { data, error } = await supabase
      .from('team_members')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete a Team Member from Supabase
 */
export async function deleteTeamMemberRecord(id: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database client not connected' };

  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
