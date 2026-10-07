-- ==============================================================================
-- NextRide Waiting List Migration
-- Table: public.waiting_list
-- Purpose: Pre-launch waiting list collection for Bareilly pilot routes (in validation)
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

-- 2. Indexes for quick lookup and duplicate verification
CREATE INDEX IF NOT EXISTS idx_waiting_list_mobile ON public.waiting_list(mobile_number);
CREATE INDEX IF NOT EXISTS idx_waiting_list_created_at ON public.waiting_list(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;

-- 4. Policies:
-- Allow anyone (anonymous visitors) to join the waiting list
CREATE POLICY "Allow public inserts into waiting_list"
    ON public.waiting_list
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow public to check duplicate status by phone
CREATE POLICY "Allow public read-check on waiting_list"
    ON public.waiting_list
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 5. Optional count function
CREATE OR REPLACE VIEW public.waiting_list_stats AS
SELECT 
    COUNT(*) as total_signups,
    COUNT(*) FILTER (WHERE interest_type = 'commuter') as commuters,
    COUNT(*) FILTER (WHERE interest_type = 'driver') as drivers
FROM public.waiting_list;
