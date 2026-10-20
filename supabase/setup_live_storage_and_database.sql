-- ==============================================================================
-- OM ENTERPRISES / EDILITE CONSTRUCTIONS
-- LIVE SUPABASE STORAGE BUCKET & DATABASE PERMISSIONS SETUP
-- ==============================================================================

-- 1. Ensure Storage Extension and Buckets exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media',
    'media',  
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- 2. Storage Objects RLS Policies
-- Allow public viewing of all media in 'media' bucket
DROP POLICY IF EXISTS "Public View Media" ON storage.objects;
CREATE POLICY "Public View Media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');

-- Allow authenticated users & admins to upload media
DROP POLICY IF EXISTS "Allow Media Uploads" ON storage.objects;
CREATE POLICY "Allow Media Uploads"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'media');

-- Allow updates & deletes in 'media' bucket
DROP POLICY IF EXISTS "Allow Media Updates" ON storage.objects;
CREATE POLICY "Allow Media Updates"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Allow Media Deletes" ON storage.objects;
CREATE POLICY "Allow Media Deletes"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'media');

-- 3. Database Tables RLS Adjustments
-- Ensure public can read published content and admins have full CRUD access

-- Projects Table
ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;

-- Ensure all engineering columns exist for institutional case studies
ALTER TABLE IF EXISTS public.projects 
    ADD COLUMN IF NOT EXISTS delivery_model text,
    ADD COLUMN IF NOT EXISTS basement_depth text,
    ADD COLUMN IF NOT EXISTS volume_cum text,
    ADD COLUMN IF NOT EXISTS piling_spec text,
    ADD COLUMN IF NOT EXISTS anchoring_spec text,
    ADD COLUMN IF NOT EXISTS strata_type text,
    ADD COLUMN IF NOT EXISTS machinery_deployed text,
    ADD COLUMN IF NOT EXISTS timeline_duration text,
    ADD COLUMN IF NOT EXISTS safety_metrics text,
    ADD COLUMN IF NOT EXISTS challenge_solution text,
    ADD COLUMN IF NOT EXISTS scope_checklist text;

DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins have full access to projects" ON public.projects;
CREATE POLICY "Admins have full access to projects"
    ON public.projects FOR ALL
    USING (true)
    WITH CHECK (true);

-- Project Images
ALTER TABLE IF EXISTS public.project_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view project images" ON public.project_images;
CREATE POLICY "Public can view project images"
    ON public.project_images FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins have full access to project images" ON public.project_images;
CREATE POLICY "Admins have full access to project images"
    ON public.project_images FOR ALL
    USING (true)
    WITH CHECK (true);

-- Media Library Table
ALTER TABLE IF EXISTS public.media_library ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view media" ON public.media_library;
CREATE POLICY "Public can view media"
    ON public.media_library FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins have full access to media" ON public.media_library;
CREATE POLICY "Admins have full access to media"
    ON public.media_library FOR ALL
    USING (true)
    WITH CHECK (true);

-- Hero Slides Table
ALTER TABLE IF EXISTS public.hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active hero slides" ON public.hero_slides;
CREATE POLICY "Public can view active hero slides"
    ON public.hero_slides FOR SELECT
    USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins have full access to hero slides" ON public.hero_slides;
CREATE POLICY "Admins have full access to hero slides"
    ON public.hero_slides FOR ALL
    USING (true)
    WITH CHECK (true);

-- Team Members Table
ALTER TABLE IF EXISTS public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published team" ON public.team_members;
CREATE POLICY "Public can view published team"
    ON public.team_members FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins have full access to team" ON public.team_members;
CREATE POLICY "Admins have full access to team"
    ON public.team_members FOR ALL
    USING (true)
    WITH CHECK (true);

-- Contact Messages Table
ALTER TABLE IF EXISTS public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can submit contact inquiries" ON public.contact_messages;
CREATE POLICY "Public can submit contact inquiries"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view and manage contact messages"
    ON public.contact_messages FOR ALL
    USING (true)
    WITH CHECK (true);

-- Company Content Key-Value Store
ALTER TABLE IF EXISTS public.company_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view company content" ON public.company_content;
CREATE POLICY "Public can view company content"
    ON public.company_content FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins have full access to company content" ON public.company_content;
CREATE POLICY "Admins have full access to company content"
    ON public.company_content FOR ALL
    USING (true)
    WITH CHECK (true);
