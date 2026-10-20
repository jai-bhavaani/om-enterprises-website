import { useState, useEffect } from 'react';
import { 
  getPublishedProjects, 
  getActiveHeroSlides, 
  getPublishedTeam, 
  isSupabaseConfigured 
} from '../lib/supabase';
import { projectData as staticProjects } from '../../projects.config';
import { LEADERS as staticTeam } from '../data/team';
import type { HeroCarouselItem } from '../../components/HeroCarousel';

export interface UIProject {
  title: string;
  name: string;
  scope: string;
  status: string;
  images: string[];
  contractValue?: string;
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
}

export function useProjects() {
  const [projects, setProjects] = useState<UIProject[]>(staticProjects);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setProjects(staticProjects);
      setLoading(false);
      return;
    }

    let isMounted = true;
    getPublishedProjects()
      .then((data) => {
        if (!isMounted) return;
        if (data && data.length > 0) {
          // Format database records to match UIProject
          const formatted: UIProject[] = data.map((p) => ({
            title: p.title,
            name: p.client_name || p.title,
            scope: p.scope,
            status: p.status,
            contractValue: p.project_value || undefined,
            delivery_model: p.delivery_model,
            basement_depth: p.basement_depth,
            volume_cum: p.volume_cum,
            piling_spec: p.piling_spec,
            anchoring_spec: p.anchoring_spec,
            strata_type: p.strata_type,
            machinery_deployed: p.machinery_deployed,
            timeline_duration: p.timeline_duration,
            safety_metrics: p.safety_metrics,
            challenge_solution: p.challenge_solution,
            scope_checklist: p.scope_checklist,
            images: (p.images && p.images.length > 0)
              ? p.images.map((img) => img.url)
              : ['https://placehold.co/800x600/png?text=OM+Enterprises+Project'],
          }));
          setProjects(formatted);
        } else {
          // If database is empty, maintain static projects
          setProjects(staticProjects);
        }
      })
      .catch((err) => {
        console.warn('Failed to load projects from Supabase, using local fallback:', err);
        setError(err.message);
        setProjects(staticProjects);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { projects, loading, error };
}

export function useTeam() {
  const [team, setTeam] = useState(staticTeam);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setTeam(staticTeam);
      setLoading(false);
      return;
    }

    let isMounted = true;
    getPublishedTeam()
      .then((data) => {
        if (!isMounted) return;
        if (data && data.length > 0) {
          const formatted = data.map((member) => ({
            name: member.name,
            role: member.role,
            image: member.image_url,
            bio: member.bio || '',
            linkedin: '#',
          }));
          setTeam(formatted);
        } else {
          setTeam(staticTeam);
        }
      })
      .catch((err) => {
        console.warn('Failed to load team from Supabase, using local fallback:', err);
        setTeam(staticTeam);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { team, loading };
}

import { adminStore } from '../admin/adminStore';

export function useHeroSlides() {
  const getAdminSlides = (): HeroCarouselItem[] => {
    const rawSlides = adminStore.getHeroSlides();
    const active = rawSlides.filter((s) => s.is_active);
    if (active.length === 0) return [];

    return active.map((slide) => ({
      image: slide.desktop_image_url || slide.media?.public_url || '',
      mobileImage: slide.mobile_image_url || slide.desktop_image_url || slide.media?.public_url || '',
      title: slide.title,
      subtitle: slide.subtitle || '',
      cta: slide.cta_text || 'View Project',
      link: slide.cta_link || '/projects',
    }));
  };

  const [slides, setSlides] = useState<HeroCarouselItem[]>(() => {
    const fromAdmin = getAdminSlides();
    if (fromAdmin.length > 0) return fromAdmin;
    return staticProjects
      .filter((p) => p.images && p.images.length > 0)
      .slice(0, 5)
      .map((p) => ({
        image: p.images[0],
        mobileImage: p.images.length > 1 ? p.images[1] : p.images[0],
        title: p.title,
        subtitle: p.scope,
        cta: 'View Project',
        link: '/projects',
      }));
  });

  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  useEffect(() => {
    // Listen for real-time publishing updates from adminStore
    const handleHeroUpdate = () => {
      const updated = getAdminSlides();
      if (updated.length > 0) {
        setSlides(updated);
      }
    };

    window.addEventListener('om_hero_updated', handleHeroUpdate);

    if (!isSupabaseConfigured) {
      const fromAdmin = getAdminSlides();
      if (fromAdmin.length > 0) {
        setSlides(fromAdmin);
      }
      setLoading(false);
      return () => {
        window.removeEventListener('om_hero_updated', handleHeroUpdate);
      };
    }

    let isMounted = true;
    getActiveHeroSlides()
      .then((data) => {
        if (!isMounted) return;
        if (data && data.length > 0) {
          const formatted: HeroCarouselItem[] = data.map((slide: any) => ({
            image: slide.desktop_image_url || slide.media_library?.public_url || '',
            mobileImage: slide.mobile_image_url || slide.desktop_image_url || slide.media_library?.public_url || '',
            title: slide.title,
            subtitle: slide.subtitle || '',
            cta: slide.cta_text || 'View Project',
            link: slide.cta_link || '/projects',
          }));
          setSlides(formatted);
        } else {
          const fromAdmin = getAdminSlides();
          if (fromAdmin.length > 0) {
            setSlides(fromAdmin);
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to load hero slides from Supabase, using admin store fallback:', err);
        const fromAdmin = getAdminSlides();
        if (fromAdmin.length > 0) {
          setSlides(fromAdmin);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      window.removeEventListener('om_hero_updated', handleHeroUpdate);
    };
  }, []);

  return { slides, loading };
}
