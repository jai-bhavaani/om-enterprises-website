/**
 * OM ENTERPRISES / EDILITE CONSTRUCTIONS
 * Live Database & Supabase Storage Seeding Script
 * 
 * Usage:
 *   node scripts/seed_live_database.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read .env file directly
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
      }
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  console.log('🚀 Starting OM Enterprises Live Supabase Seed...');
  console.log(`Connecting to: ${supabaseUrl}`);

  // 1. Check connection
  const { data: testData, error: testError } = await supabase.from('projects').select('id').limit(1);
  if (testError && testError.code === '42501') {
    console.warn('⚠️ Row-level security restriction encountered.');
    console.warn('👉 Please run "supabase/setup_live_storage_and_database.sql" in your Supabase SQL editor to grant upload permissions.');
  } else if (testError) {
    console.error('❌ Connection error:', testError.message);
  } else {
    console.log('✓ Successfully connected to Supabase PostgreSQL database.');
  }

  // 2. Check storage bucket
  const { data: buckets } = await supabase.storage.listBuckets();
  const mediaBucketExists = buckets?.some(b => b.name === 'media' || b.id === 'media');
  if (!mediaBucketExists) {
    console.log('⚠️ Storage bucket "media" not found.');
    console.log('👉 Please execute "supabase/setup_live_storage_and_database.sql" in your Supabase dashboard to create the public bucket with 1-click.');
  } else {
    console.log('✓ Storage bucket "media" verified.');
  }

  // 3. Seed Company Stats & Info
  console.log('Seeding company core data...');
  await supabase.from('company_content').upsert([
    {
      key: 'stats',
      value: { yearsExperience: 20, teamSize: 185, satisfactionRate: 100 },
      description: 'Core homepage metrics'
    },
    {
      key: 'contact',
      value: {
        email: 'omenterprise20@gmail.com',
        phone: '+91-022-49697792',
        address: '412 B2B Agrawal Co-Op Premises, D’Monte Lane, Kanchpada, Malad West, Mumbai – 400064, Maharashtra, India.',
        operatingHours: 'Mon - Sat: 9:00 AM - 7:00 PM'
      },
      description: 'Registered office details'
    }
  ], { onConflict: 'key' });

  // 4. Seed Authentic Leadership Team
  const authenticTeam = [
    {
      name: 'Ashok Kumar Pal',
      role: 'Proprietor',
      bio: 'Visionary founder and proprietor of OM Enterprises with over two decades of leadership in civil infrastructure and deep foundation engineering.',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
      is_published: true,
      display_order: 0,
    },
    {
      name: 'Ramlokesh Pal',
      role: 'Manager',
      bio: 'Oversees daily technical operations and project deployment with rigorous adherence to timeline and budget control.',
      image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400',
      is_published: true,
      display_order: 1,
    },
    {
      name: 'Jeeut Prasad',
      role: 'DGM',
      bio: 'Deputy General Manager bringing extensive structural technical expertise, engineering design, and quality compliance.',
      image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400',
      is_published: true,
      display_order: 2,
    },
    {
      name: 'Adalat Yadav',
      role: 'All Project In charge',
      bio: 'Oversees site execution teams, heavy machinery operations, and on-site engineering safety standards.',
      image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400',
      is_published: true,
      display_order: 3,
    },
    {
      name: 'Pravin Chavan',
      role: 'Project Manager',
      bio: 'Leads complex deep excavation and rock-anchoring projects with precision coordination.',
      image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400',
      is_published: true,
      display_order: 4,
    },
    {
      name: 'Surendra Yadav',
      role: 'Supervisor',
      bio: 'Dedicated on-site supervisor ensuring continuous safety protocol adherence and high equipment availability.',
      image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
      is_published: true,
      display_order: 5,
    },
  ];

  console.log('Seeding leadership profiles...');
  for (const member of authenticTeam) {
    const { error: teamErr } = await supabase.from('team_members').insert([member]);
    if (teamErr && teamErr.code !== '23505') {
      console.warn(`Could not insert ${member.name}:`, teamErr.message);
    }
  }

  console.log('🎉 Seeding script completed.');
}

runSeed().catch(console.error);
