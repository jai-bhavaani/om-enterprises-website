/**
 * Content Migration & Seeding Script for OM Enterprises CMS
 * 
 * Usage:
 *   npx ts-node scripts/migrate-content.ts
 * 
 * Prerequisites:
 *   Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment or .env
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: Please provide VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration() {
  console.log('🚀 Starting OM Enterprises Content Migration...');

  // 1. Verify connection
  const { error: testErr } = await supabase.from('projects').select('id').limit(1);
  if (testErr) {
    console.error('Database connection failed. Ensure schema.sql has been executed in Supabase SQL editor.', testErr);
    return;
  }
  console.log('✓ Connected to Supabase PostgreSQL database.');

  // 2. Seed Company Content
  console.log('Seeding company information and metrics...');
  const companyContent = [
    {
      key: 'stats',
      value: { yearsExperience: 20, teamSize: 185, satisfactionRate: 100 },
      description: 'Core homepage statistics',
    },
    {
      key: 'contact',
      value: {
        email: 'omenterprise20@gmail.com',
        phone: '+91-022-49697792',
        address: '412 B2B Agrawal Co-Op Premises, D’Monte Lane, Kanchpada, Malad West, Mumbai – 400064, Maharashtra, India.',
        operatingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
      },
      description: 'Registered office details',
    },
  ];

  for (const item of companyContent) {
    const { error } = await supabase.from('company_content').upsert(item, { onConflict: 'key' });
    if (error) console.warn(`Failed to seed ${item.key}:`, error.message);
  }
  console.log('✓ Company content seeded.');

  console.log('🎉 Migration script completed successfully.');
}

runMigration().catch(console.error);
