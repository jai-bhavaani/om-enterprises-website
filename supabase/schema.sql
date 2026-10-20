-- ==============================================================================
-- OM ENTERPRISES CONSTRUCTION CMS - DATABASE SCHEMA
-- PostgreSQL schema for Supabase
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Media Library (Centralized image metadata)
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL UNIQUE,
    public_url VARCHAR(1000) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    alt_text VARCHAR(255),
    width INTEGER,
    height INTEGER,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    scope VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'In Progress', -- 'Upcoming', 'In Progress', 'On Hold', 'Completed'
    description TEXT,
    location VARCHAR(255) DEFAULT 'Mumbai, Maharashtra',
    project_value VARCHAR(100),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(display_order);

-- 4. Project Images (Join Table for Multi-Image Ordering & Cover Selection)
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES public.media_library(id) ON DELETE RESTRICT,
    is_cover BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_project_images_project ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_media ON public.project_images(media_id);

-- 5. Homepage Hero Slides
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID NOT NULL REFERENCES public.media_library(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    cta_text VARCHAR(100) DEFAULT 'View Project',
    cta_link VARCHAR(255) DEFAULT '/projects',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Team & Leadership Profiles
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url VARCHAR(1000),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Dynamic Website Content Key-Value Store
CREATE TABLE IF NOT EXISTS public.company_content (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Contact Inquiries Inbox
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    project_location VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'New', -- 'New', 'Read', 'Replied', 'Archived'
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);

-- 9. Audit Logging
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    changes JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Projects: Public reads published; Authenticated admins have full CRUD
CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    USING (is_published = true);

CREATE POLICY "Admins have full access to projects"
    ON public.projects FOR ALL
    USING (auth.role() = 'authenticated');

-- Project Images: Public can view; Admins have full access
CREATE POLICY "Public can view project images"
    ON public.project_images FOR SELECT
    USING (true);

CREATE POLICY "Admins have full access to project images"
    ON public.project_images FOR ALL
    USING (auth.role() = 'authenticated');

-- Media Library: Public can view; Admins have full access
CREATE POLICY "Public can view media"
    ON public.media_library FOR SELECT
    USING (true);

CREATE POLICY "Admins have full access to media"
    ON public.media_library FOR ALL
    USING (auth.role() = 'authenticated');

-- Hero Slides: Public reads active slides; Admins have full access
CREATE POLICY "Public can view active hero slides"
    ON public.hero_slides FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins have full access to hero slides"
    ON public.hero_slides FOR ALL
    USING (auth.role() = 'authenticated');

-- Team: Public reads published; Admins have full access
CREATE POLICY "Public can view published team"
    ON public.team_members FOR SELECT
    USING (is_published = true);

CREATE POLICY "Admins have full access to team"
    ON public.team_members FOR ALL
    USING (auth.role() = 'authenticated');

-- Company Content: Public can read; Admins can update
CREATE POLICY "Public can view company content"
    ON public.company_content FOR SELECT
    USING (true);

CREATE POLICY "Admins have full access to company content"
    ON public.company_content FOR ALL
    USING (auth.role() = 'authenticated');

-- Contact Messages: Public can insert; only Admins can view/update/delete
CREATE POLICY "Public can submit contact inquiries"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view and manage contact messages"
    ON public.contact_messages FOR ALL
    USING (auth.role() = 'authenticated');

-- Audit Logs: Admins only
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
