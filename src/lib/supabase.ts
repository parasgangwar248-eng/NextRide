import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variable credentials configured securely in Vercel / .env
const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const LOCAL_STORAGE_WAITING_LIST_KEY = 'nextride_local_waiting_list';

export const isSupabaseConfigured = Boolean(
  envUrl &&
  envKey &&
  envUrl.startsWith('https://') &&
  !envUrl.includes('your-project-id') &&
  !envUrl.includes('your-project')
);

if (isSupabaseConfigured) {
  console.log('[NextRide] Supabase connected to:', envUrl);
} else {
  console.warn(
    '[NextRide] Supabase is NOT configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file or Vercel Environment Variables.'
  );
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(envUrl, envKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

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

// Get locally saved entries (fallback mode if backend is unreachable)
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
  errorDetail?: string;
}

/**
 * Join NextRide Waiting List
 * Validates, checks duplicates, and inserts directly into Supabase.
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

  // 2. If Supabase is connected, insert into Supabase
  if (supabase) {
    try {
      console.log('[NextRide] Submitting to Supabase waiting_list table...', newEntry);

      // Perform direct insert WITHOUT .select() so no SELECT policy is required
      const { error: insertError } = await supabase
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
        ]);

      if (insertError) {
        console.error('[NextRide] Supabase insert error:', insertError);

        // PostgreSQL unique violation error code 23505 (phone already exists)
        if (
          insertError.code === '23505' ||
          insertError.message?.toLowerCase().includes('unique') ||
          insertError.message?.toLowerCase().includes('duplicate')
        ) {
          saveLocalEntry(newEntry);
          return {
            success: true,
            isDuplicate: true,
            message: 'You’re already on the list! We have your spot reserved.',
            entry: newEntry,
            storageType: 'supabase',
          };
        }

        // Table doesn't exist or RLS issue
        saveLocalEntry(newEntry);
        return {
          success: true,
          message: 'Saved to local queue. Note: Supabase reported: ' + insertError.message,
          entry: newEntry,
          storageType: 'local_fallback',
          errorDetail: insertError.message,
        };
      }

      console.log('[NextRide] Successfully inserted row into Supabase waiting_list!');
      saveLocalEntry(newEntry);

      return {
        success: true,
        isDuplicate: false,
        entry: newEntry,
        storageType: 'supabase',
      };
    } catch (err: any) {
      console.error('[NextRide] Unexpected Supabase network exception:', err);
      saveLocalEntry(newEntry);
      return {
        success: true,
        message: 'Saved to local queue.',
        entry: newEntry,
        storageType: 'local_fallback',
        errorDetail: err?.message,
      };
    }
  }

  // 3. Fallback: Local storage queue (when Supabase env variables are not yet provided)
  console.warn('[NextRide] No Supabase client initialized. Saving to localStorage queue.');
  saveLocalEntry(newEntry);
  return {
    success: true,
    isDuplicate: false,
    entry: newEntry,
    storageType: 'local_fallback',
    errorDetail: 'SUPABASE_NOT_CONFIGURED',
  };
}

/**
 * Fetch total waiting list count
 */
export async function getWaitingListCount(): Promise<number> {
  const count = getLocalWaitingList().length;
  return count;
}
