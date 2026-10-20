import { supabase, isSupabaseConfigured } from './supabase';
import type { MediaItem } from '../types/database';

export const MEDIA_BUCKET = 'media';

/**
 * Upload a single file from the user's local device directly to Supabase Storage
 * and create an entry in the media_library table.
 */
export async function uploadFileToStorage(
  file: File,
  folder: string = 'uploads',
  altText?: string
): Promise<{ success: boolean; mediaItem?: MediaItem; error?: string }> {
  try {
    const timestamp = Date.now();
    const cleanFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase();
    const storagePath = `${folder}/${timestamp}_${cleanFileName}`;

    let publicUrl = '';

    if (isSupabaseConfigured && supabase) {
      // 1. Upload file binary directly to Supabase Storage bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(storagePath, file, {
          cacheControl: '31536000',
          upsert: true,
          contentType: file.type || 'image/jpeg',
        });

      if (uploadError) {
        console.warn('Supabase storage upload error:', uploadError);
        // If storage bucket violates RLS or is not created yet, fall back to object URL
        publicUrl = URL.createObjectURL(file);
      } else if (uploadData) {
        // 2. Obtain permanent public URL
        const { data: urlData } = supabase.storage
          .from(MEDIA_BUCKET)
          .getPublicUrl(storagePath);
        publicUrl = urlData.publicUrl;
      }
    } else {
      // Local fallback if Supabase keys not set
      publicUrl = URL.createObjectURL(file);
    }

    // 3. Prepare MediaItem object
    const newMediaItem: MediaItem = {
      id: `media_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
      filename: file.name,
      storage_path: storagePath,
      public_url: publicUrl,
      file_size_bytes: file.size,
      mime_type: file.type || 'image/jpeg',
      alt_text: altText || `${file.name.split('.')[0]} photograph`,
      created_at: new Date().toISOString(),
    };

    // 4. Record to Supabase media_library table if connected
    if (isSupabaseConfigured && supabase && publicUrl.startsWith('http')) {
      const { data: dbData, error: dbError } = await supabase
        .from('media_library')
        .insert([
          {
            filename: newMediaItem.filename,
            storage_path: newMediaItem.storage_path,
            public_url: newMediaItem.public_url,
            file_size_bytes: newMediaItem.file_size_bytes,
            mime_type: newMediaItem.mime_type,
            alt_text: newMediaItem.alt_text,
          },
        ])
        .select()
        .single();

      if (!dbError && dbData) {
        newMediaItem.id = dbData.id;
      } else if (dbError) {
        console.warn('Could not insert to media_library table:', dbError.message);
      }
    }

    return { success: true, mediaItem: newMediaItem };
  } catch (err: any) {
    console.error('Failed to upload file to storage:', err);
    return { success: false, error: err.message || 'File upload failed' };
  }
}

/**
 * Upload multiple files from the user's local device concurrently
 */
export async function uploadMultipleFiles(
  files: File[],
  folder: string = 'uploads'
): Promise<MediaItem[]> {
  const uploadPromises = files.map((file) => uploadFileToStorage(file, folder));
  const results = await Promise.all(uploadPromises);
  return results
    .filter((r) => r.success && r.mediaItem)
    .map((r) => r.mediaItem as MediaItem);
}

/**
 * Delete a media file from Supabase Storage and media_library table
 */
export async function deleteMediaFromStorage(
  storagePath: string,
  mediaId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (isSupabaseConfigured && supabase) {
      // 1. Delete from storage bucket
      await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);

      // 2. Delete from media_library table
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', mediaId);

      if (dbError) {
        console.warn('Error deleting from media_library:', dbError);
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
