import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Project, HeroSlide, TeamMember, ContactMessage } from '../types/database';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

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
