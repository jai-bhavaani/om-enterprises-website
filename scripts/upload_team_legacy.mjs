import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://cuorugoykxvkldyztiin.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1b3J1Z295a3h2a2xkeXp0aWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNDE0MDUsImV4cCI6MjEwNzkxNzQwNX0.QI36gtYJw5kXWGVbmVreefFr5GV46ofo4_MODi4oHRM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function upload() {
  const filePath = 'src/assets/images/om_team_legacy.jpg';
  const fileBuffer = fs.readFileSync(filePath);
  const storagePath = 'team/om_team_legacy.jpg';

  console.log('Uploading to Supabase storage...');
  const { data, error } = await supabase.storage
    .from('media')
    .upload(storagePath, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) {
    console.error('Storage upload error:', error.message);
  } else {
    console.log('Uploaded successfully to storage:', data);
  }

  const { data: pubData } = supabase.storage.from('media').getPublicUrl(storagePath);
  console.log('Public URL:', pubData.publicUrl);

  // Add to media_library table
  const { data: mediaRow, error: dbErr } = await supabase
    .from('media_library')
    .insert([{
      filename: 'om_team_legacy.jpg',
      storage_path: storagePath,
      public_url: pubData.publicUrl,
      file_size_bytes: fileBuffer.length,
      mime_type: 'image/jpeg',
      alt_text: 'OM Enterprises & Edilite Construction Team - A Legacy of Strength',
    }])
    .select()
    .single();

  if (dbErr) {
    console.log('DB insert notice:', dbErr.message);
  } else {
    console.log('Inserted into media_library:', mediaRow.id);
  }
}

upload();
