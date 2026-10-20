import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const envContent = fs.readFileSync(path.join(rootDir, '.env'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
    }
  }
});

const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const folderToTitle = {
  "Ariisto Mulund": "Ariisto, Mulund",
  "Aristo Glory": "Ariisto Glory",
  "Arristo Goregaon": "Ariisto Goregaon",
  "Ashirwad Bunglow": "Ashirwad Bungalow, Bandra West",
  "Aurum Venturs": "Aurum Ventures",
  "B E Billimoria Andheri": "B. E. Billimoria Andheri",
  "B E Billimoria Raptacos Thane": "B. E. Billimoria Raptacos Thane",
  "Breaking": "Breaking Works",
  "Breach Candy Hospital": "Breach Candy Hospital",
  "Chembur Demoliotion": "Chembur Demolition",
  "Chistiya height Null bazar": "Chistiya Height, Null Bazar",
  "HCC Jammu": "HCC Jammu",
  "Kasturi Chirabazar": "Kasturi Chirabazar",
  "L & T Forest Hill": "L&T Forest Hill",
  "Lulu Walkeshwar": "Lulu Walkeshwar",
  "Mahindra Kandivali": "Mahindra & Mahindra, Kandivali",
  "Piramal": "Piramal Gulita",
  "Piramal Agastya": "Piramal Agastya",
  "Piramal Vaikunth": "Piramal Vaikunth",
  "Piraml Revanta Mulund": "Piramal Revanta, Mulund",
  "Prestige mulund": "Prestige Mulund",
  "Raymond Bandra Site": "Raymond Bandra",
  "RNA BAM Market Photos": "RNA BAM Market, Kandivali",
  "RNA Metroppolis": "RNA Metropolis",
  "Shanti Housing": "Vasai Madhuban Shantee Housing",
  "VJTF Borivali": "VJTF Borivali",
  "Welspun": "Welspun Thane",
  "Welspun One ( JNPA SEZ Site )": "Welspun One (JNPA SEZ Site)"
};

async function linkImages() {
  console.log('🔗 Linking media_library items to project_images...');

  // 1. Fetch projects
  const { data: projects, error: pErr } = await sb.from('projects').select('id, title');
  if (pErr) throw pErr;

  // 2. Fetch media library items
  const { data: mediaItems, error: mErr } = await sb
    .from('media_library')
    .select('id, storage_path, public_url')
    .ilike('storage_path', 'projects/%');
  if (mErr) throw mErr;

  console.log(`Found ${projects.length} projects and ${mediaItems.length} project media items.`);

  // Clear existing project_images to prevent duplicates
  await sb.from('project_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  let totalLinked = 0;
  const marqueeForHero = [];

  for (const [folderName, mappedTitle] of Object.entries(folderToTitle)) {
    const proj = projects.find(p => p.title.toLowerCase() === mappedTitle.toLowerCase() || p.title.toLowerCase().includes(mappedTitle.toLowerCase()));
    if (!proj) continue;

    const folderSlug = folderName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const matchedMedia = mediaItems.filter(m => m.storage_path.includes(`projects/${folderSlug}/`));

    for (let i = 0; i < matchedMedia.length; i++) {
      const m = matchedMedia[i];
      await sb.from('project_images').insert([{
        project_id: proj.id,
        media_id: m.id,
        is_cover: i === 0,
        display_order: i
      }]);
      totalLinked++;
    }

    if (matchedMedia.length > 0) {
      marqueeForHero.push({
        projectId: proj.id,
        title: mappedTitle,
        mediaId: matchedMedia[0].id,
        url: matchedMedia[0].public_url
      });
      console.log(`  ✓ Linked ${matchedMedia.length} photos for "${mappedTitle}"`);
    }
  }

  console.log(`\n🎉 Total linked project images: ${totalLinked}`);

  // 3. Clear & seed hero_slides
  console.log('\n--- Seeding Live Hero Slides ---');
  await sb.from('hero_slides').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const selectedForHero = [
    'Prestige Mulund',
    'Piramal Gulita',
    'Raymond Bandra',
    'L&T Forest Hill',
    'Ashirwad Bungalow, Bandra West'
  ];

  let slideOrder = 0;
  for (const heroTitle of selectedForHero) {
    const candidate = marqueeForHero.find(c => c.title.toLowerCase() === heroTitle.toLowerCase());
    if (candidate) {
      const { error } = await sb.from('hero_slides').insert([{
        media_id: candidate.mediaId,
        title: candidate.title,
        subtitle: 'Piling, Anchoring & Deep Excavation Contractor',
        cta_text: 'View Technical Dossier',
        cta_link: `/projects?project=${encodeURIComponent(candidate.title)}`,
        is_active: true,
        display_order: slideOrder++
      }]);
      if (error) {
        console.warn(`  ⚠️ Failed to insert hero slide "${candidate.title}":`, error.message);
      } else {
        console.log(`  ✓ Hero Slide ${slideOrder} active: "${candidate.title}"`);
      }
    }
  }

  console.log('\n✅ All projects, site photos, and hero slides are now live in Supabase!');
}

linkImages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
