-- =======================================================================
-- NEXTRIDE - SUPABASE DATABASE SCHEMA (V3 - Live Multi-Device Sync)
-- Rural Shared Mobility Platform for E-Rickshaws & Autos
-- "Your next ride, on time, every time"
-- =======================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'traveller',
    village_town TEXT,
    avatar_url TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.95,
    total_trips INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Shared Routes & Auto Fleet Table (Stores all published driver routes)
CREATE TABLE IF NOT EXISTS public.routes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    driver_id TEXT NOT NULL,
    driver_name TEXT NOT NULL DEFAULT 'Driver Partner',
    driver_phone TEXT DEFAULT '+91 99881 77263',
    driver_rating NUMERIC(2, 1) DEFAULT 4.95,
    vehicle_type TEXT NOT NULL DEFAULT 'E-Rickshaw Shared (Toto / Electric)',
    vehicle_model TEXT DEFAULT 'Mahindra Treo Electric',
    plate_number TEXT DEFAULT 'UP-25-ER-0000',
    origin_name TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    intermediate_stops TEXT[] DEFAULT '{}',
    departure_time TEXT NOT NULL DEFAULT 'Continuous Electric Shuttle',
    departure_date DATE DEFAULT CURRENT_DATE,
    frequency TEXT DEFAULT 'Continuous Electric Shuttle',
    price_per_seat NUMERIC(10, 2) NOT NULL DEFAULT 15.00,
    full_vehicle_price NUMERIC(10, 2) DEFAULT 60.00,
    available_seats INTEGER NOT NULL DEFAULT 4,
    total_seats INTEGER NOT NULL DEFAULT 4,
    is_electric BOOLEAN DEFAULT TRUE,
    has_carrier BOOLEAN DEFAULT TRUE,
    luggage_space TEXT DEFAULT 'Handbags & sacks allowed',
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- If table already existed, add missing columns safely
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS driver_name TEXT DEFAULT 'Driver Partner';
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS driver_phone TEXT DEFAULT '+91 99881 77263';
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS driver_rating NUMERIC(2, 1) DEFAULT 4.95;
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS vehicle_model TEXT DEFAULT 'Mahindra Treo Electric';
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS plate_number TEXT DEFAULT 'UP-25-ER-0000';
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS full_vehicle_price NUMERIC(10, 2) DEFAULT 60.00;
ALTER TABLE public.routes ADD COLUMN IF NOT EXISTS is_electric BOOLEAN DEFAULT TRUE;

-- 4. Passenger Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    otp TEXT DEFAULT '4891',
    route_id TEXT NOT NULL,
    traveller_id TEXT NOT NULL,
    passenger_name TEXT NOT NULL,
    passenger_phone TEXT NOT NULL,
    pickup_point TEXT NOT NULL,
    drop_point TEXT NOT NULL,
    seats_booked INTEGER NOT NULL DEFAULT 1,
    booking_type TEXT DEFAULT 'shared_seat',
    total_fare NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'confirmed',
    payment_status TEXT DEFAULT 'cash_on_ride',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS otp TEXT DEFAULT '4891';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_type TEXT DEFAULT 'shared_seat';

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 6. Open RLS Policies for Seamless Cross-Device Transit Sync
DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public profiles insert" ON public.profiles;
CREATE POLICY "Public profiles insert" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public profiles update" ON public.profiles;
CREATE POLICY "Public profiles update" ON public.profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public routes read" ON public.routes;
CREATE POLICY "Public routes read" ON public.routes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public routes insert" ON public.routes;
CREATE POLICY "Public routes insert" ON public.routes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public routes update" ON public.routes;
CREATE POLICY "Public routes update" ON public.routes FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public routes delete" ON public.routes;
CREATE POLICY "Public routes delete" ON public.routes FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public bookings read" ON public.bookings;
CREATE POLICY "Public bookings read" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public bookings insert" ON public.bookings;
CREATE POLICY "Public bookings insert" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public bookings update" ON public.bookings;
CREATE POLICY "Public bookings update" ON public.bookings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public bookings delete" ON public.bookings;
CREATE POLICY "Public bookings delete" ON public.bookings FOR DELETE USING (true);
