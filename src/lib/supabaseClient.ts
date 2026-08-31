import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Fallback keys or environment variables
const envUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ckgbpkgitvjijcuruill.supabase.co';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GIfgMIjAfZHPHN8WmW0UFg_aE7dWIaB';

// Local storage override keys
const STORAGE_URL_KEY = 'nextride_supabase_url';
const STORAGE_ANON_KEY = 'nextride_supabase_anon';

export function getSavedSupabaseConfig() {
  const customUrl = localStorage.getItem(STORAGE_URL_KEY);
  const customAnon = localStorage.getItem(STORAGE_ANON_KEY);
  
  return {
    url: customUrl || envUrl || '',
    anonKey: customAnon || envAnonKey || '',
    isCustom: !!customUrl
  };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (url && anonKey) {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_ANON_KEY);
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSavedSupabaseConfig();
  
  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }
  
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

export function resetSupabaseClient() {
  supabaseInstance = null;
}
