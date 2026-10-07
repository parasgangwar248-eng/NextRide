-- ==============================================================================
-- NextRide Waiting List Migration
-- Table: public.waiting_list
-- Purpose: Pre-launch waiting list collection for Bareilly pilot routes (in validation)
-- Security: Row Level Security (RLS) enabled.
--           Only INSERT is allowed for public visitors.
--           Nobody from the public can query or view other people's submissions.
-- ==============================================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.waiting_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL UNIQUE,
    email TEXT,
    interest_type TEXT DEFAULT 'commuter' CHECK (interest_type IN ('commuter', 'driver', 'partner', 'other')),
    route_interest TEXT DEFAULT 'Bareilly Pilot Corridor (In Validation)',
    source TEXT DEFAULT 'web_coming_soon_landing',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_waiting_list_mobile ON public.waiting_list(mobile_number);
CREATE INDEX IF NOT EXISTS idx_waiting_list_created_at ON public.waiting_list(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;

-- 4. Secure Policies:
-- Allow anyone to submit to the waiting list
DROP POLICY IF EXISTS "Allow public inserts into waiting_list" ON public.waiting_list;
CREATE POLICY "Allow public inserts into waiting_list"
    ON public.waiting_list
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- (Notice: No SELECT policy is granted to anon, ensuring maximum user privacy)
