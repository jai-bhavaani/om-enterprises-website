export type ProjectStatus = 'Upcoming' | 'In Progress' | 'On Hold' | 'Completed';

export interface MediaItem {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  file_size_bytes: number;
  mime_type: string;
  alt_text?: string | null;
  width?: number | null;
  height?: number | null;
  created_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  media_id: string;
  is_cover: boolean;
  display_order: number;
  created_at: string;
  media?: MediaItem;
}

export interface Project {
  id: string;
  title: string;
  client_name?: string | null;
  scope: string;
  status: ProjectStatus;
  description?: string | null;
  location?: string | null;
  project_value?: string | null;
  delivery_model?: string | null;
  basement_depth?: string | null;
  volume_cum?: string | null;
  piling_spec?: string | null;
  anchoring_spec?: string | null;
  strata_type?: string | null;
  machinery_deployed?: string | null;
  timeline_duration?: string | null;
  safety_metrics?: string | null;
  challenge_solution?: string | null;
  scope_checklist?: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  images?: (ProjectImage & { url: string })[];
}

export interface HeroSlide {
  id: string;
  media_id: string;
  desktop_image_url?: string;
  mobile_media_id?: string;
  mobile_image_url?: string;
  title: string;
  subtitle?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  media?: MediaItem;
  mobile_media?: MediaItem;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  image_url: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type MessageStatus = 'New' | 'Read' | 'Replied' | 'Archived';

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  project_location?: string | null;
  message: string;
  status: MessageStatus;
  internal_notes?: string | null;
  created_at: string;
}

export interface CompanyStats {
  yearsExperience: number;
  teamSize: number;
  satisfactionRate: number;
}

export interface CompanyContactInfo {
  email: string;
  phone: string;
  address: string;
  officeHours?: string;
}
