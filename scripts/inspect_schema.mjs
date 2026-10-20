import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cuorugoykxvkldyztiin.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1b3J1Z295a3h2a2xkeXp0aWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNDE0MDUsImV4cCI6MjEwNzkxNzQwNX0.QI36gtYJw5kXWGVbmVreefFr5GV46ofo4_MODi4oHRM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspect() {
  const tables = ['projects', 'project_images', 'hero_slides', 'team_members', 'media_library', 'contact_messages', 'company_content'];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`Table [${t}]: Error:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`Table [${t}] columns:`, Object.keys(data[0]));
      console.log(`Table [${t}] sample row:`, data[0]);
    } else {
      console.log(`Table [${t}] is empty. Fetching headers...`);
      // Attempt insert with dummy to see columns or read schema
      const { error: insErr } = await supabase.from(t).insert([{}]);
      console.log(`Table [${t}] insert error response:`, insErr?.message);
    }
  }
}

inspect();
