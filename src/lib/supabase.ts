import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variable credentials or locally stored credentials
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const LOCAL_STORAGE_CRED_KEY = 'nextride_custom_supabase_creds';
const LOCAL_STORAGE_WAITING_LIST_KEY = 'nextride_local_waiting_list';

function getSavedCreds(): { url: string; anonKey: string } {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_CRED_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return { url: envUrl, anonKey: envKey };
}

const currentCreds = getSavedCreds();

export const isSupabaseConfigured = Boolean(
  currentCreds.url &&
  currentCreds.anonKey &&
  currentCreds.url.startsWith('https://') &&
  !currentCreds.url.includes('your-project-id') &&
  !currentCreds.url.includes('your-project')
);

export let supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(currentCreds.url, currentCreds.anonKey)
  : null;

export function configureSupabase(url: string, anonKey: string) {
  try {
    localStorage.setItem(LOCAL_STORAGE_CRED_KEY, JSON.stringify({ url, anonKey }));
    supabase = createClient(url, anonKey);
    return true;
  } catch (err) {
    console.error('Failed to configure Supabase:', err);
    return false;
  }
}

export function resetSupabaseConfig() {
  localStorage.removeItem(LOCAL_STORAGE_CRED_KEY);
  supabase = envUrl && envKey ? createClient(envUrl, envKey) : null;
}

export interface WaitingListEntry {
  id?: string;
  full_name: string;
  mobile_number: string;
  email?: string;
  interest_type?: 'commuter' | 'driver' | 'partner' | 'other';
  route_interest?: string;
  created_at?: string;
  source?: string;
}

// Clean phone number for duplicate checking (standard 10-digit Indian mobile)
export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

// Get locally saved entries (fallback / offline mode)
export function getLocalWaitingList(): WaitingListEntry[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_WAITING_LIST_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return [];
}

function saveLocalEntry(entry: WaitingListEntry): void {
  const current = getLocalWaitingList();
  current.unshift(entry);
  localStorage.setItem(LOCAL_STORAGE_WAITING_LIST_KEY, JSON.stringify(current));
}

export interface WaitingListResult {
  success: boolean;
  isDuplicate?: boolean;
  message?: string;
  entry?: WaitingListEntry;
  storageType: 'supabase' | 'local_fallback';
}

/**
 * Join NextRide Waiting List
 * Validates, checks duplicates, inserts into Supabase or gracefully stores locally.
 */
export async function joinWaitingList(
  entryData: Omit<WaitingListEntry, 'id' | 'created_at'>
): Promise<WaitingListResult> {
  const normalizedPhone = normalizePhoneNumber(entryData.mobile_number);
  const now = new Date().toISOString();

  const newEntry: WaitingListEntry = {
    ...entryData,
    mobile_number: normalizedPhone,
    route_interest: entryData.route_interest || 'Bareilly Pilot Corridor (In Validation)',
    interest_type: entryData.interest_type || 'commuter',
    created_at: now,
    source: 'web_coming_soon_landing',
  };

  // 1. Check local storage duplicates
  const localEntries = getLocalWaitingList();
  const existingLocal = localEntries.find(
    (e) => normalizePhoneNumber(e.mobile_number) === normalizedPhone
  );

  if (existingLocal) {
    return {
      success: true,
      isDuplicate: true,
      message: 'You’re already on the list! We have your spot reserved.',
      entry: existingLocal,
      storageType: 'local_fallback',
    };
  }

  // 2. If Supabase is connected, try Supabase insert
  if (supabase) {
    try {
      // Check duplicate on Supabase
      const { data: existing, error: checkError } = await supabase
        .from('waiting_list')
        .select('id, full_name, mobile_number, created_at')
        .eq('mobile_number', normalizedPhone)
        .maybeSingle();

      if (!checkError && existing) {
        return {
          success: true,
          isDuplicate: true,
          message: 'You’re already on the list! We have your spot reserved.',
          entry: existing as WaitingListEntry,
          storageType: 'supabase',
        };
      }

      // Insert new row
      const { data, error: insertError } = await supabase
        .from('waiting_list')
        .insert([
          {
            full_name: newEntry.full_name.trim(),
            mobile_number: normalizedPhone,
            email: newEntry.email ? newEntry.email.trim() : null,
            interest_type: newEntry.interest_type,
            route_interest: newEntry.route_interest,
            source: 'web_coming_soon_landing',
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.warn('Supabase insert issue, saving locally:', insertError.message);
        saveLocalEntry(newEntry);
        return {
          success: true,
          message: 'Saved to local waiting list queue. Ready for cloud sync.',
          entry: newEntry,
          storageType: 'local_fallback',
        };
      }

      // Also cache locally for seamless UX
      saveLocalEntry(data as WaitingListEntry);

      return {
        success: true,
        isDuplicate: false,
        entry: data as WaitingListEntry,
        storageType: 'supabase',
      };
    } catch (err: any) {
      console.warn('Supabase request failed, falling back to local storage:', err);
      saveLocalEntry(newEntry);
      return {
        success: true,
        message: 'Saved to waiting list queue.',
        entry: newEntry,
        storageType: 'local_fallback',
      };
    }
  }

  // 3. Fallback: Local storage queue
  saveLocalEntry(newEntry);
  return {
    success: true,
    isDuplicate: false,
    entry: newEntry,
    storageType: 'local_fallback',
  };
}

/**
 * Fetch total waiting list count
 */
export async function getWaitingListCount(): Promise<number> {
  let count = getLocalWaitingList().length;

  if (supabase) {
    try {
      const { count: dbCount, error } = await supabase
        .from('waiting_list')
        .select('*', { count: 'exact', head: true });

      if (!error && typeof dbCount === 'number') {
        return Math.max(dbCount, count);
      }
    } catch {
      // ignore
    }
  }

  return count;
}
