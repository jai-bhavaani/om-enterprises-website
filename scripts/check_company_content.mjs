import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cuorugoykxvkldyztiin.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1b3J1Z295a3h2a2xkeXp0aWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNDE0MDUsImV4cCI6MjEwNzkxNzQwNX0.QI36gtYJw5kXWGVbmVreefFr5GV46ofo4_MODi4oHRM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('company_content').select('*');
  console.log('SELECT company_content:', { data, error });

  const { data: insData, error: insErr } = await supabase.from('company_content').insert([{
    key: 'test',
    value: { hello: 'world' }
  }]);
  console.log('INSERT company_content:', { insData, error: insErr });
}

check();
