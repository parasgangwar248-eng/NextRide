-- =======================================================================
-- NEXTRIDE - SUPABASE DATABASE SCHEMA
-- Rural Shared Mobility Platform
-- "Your next ride, on time, every time"
-- =======================================================================

-- 1. Enable UUID Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. User Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('traveller', 'driver', 'admin')),
    village_town TEXT,
    avatar_url TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    total_trips INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Driver Vehicles Table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vehicle_type TEXT NOT NULL, -- 'Jeep / Cruiser', 'Tata Magic / Van', 'Auto / E-Rickshaw', 'Mini Bus', 'Bike / Scooter', 'Car'
    model_name TEXT NOT NULL,   -- e.g. "Mahindra Bolero", "Tata Magic Gold", "Bajaj Maxima"
    plate_number TEXT NOT NULL,
    total_seats INTEGER NOT NULL DEFAULT 4,
    has_carrier BOOLEAN DEFAULT TRUE,
    is_ac BOOLEAN DEFAULT FALSE,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Shared Routes & Rides Table
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    origin_name TEXT NOT NULL,        -- e.g. "Rampur Village"
    destination_name TEXT NOT NULL,   -- e.g. "District Hub / Market"
    intermediate_stops TEXT[] DEFAULT '{}', -- e.g. ARRAY['Kisan Mandi', 'Old Toll Gate', 'Tehsil Chowk']
    departure_time TEXT NOT NULL,     -- e.g. "08:30 AM"
    departure_date DATE DEFAULT CURRENT_DATE,
    frequency TEXT DEFAULT 'Daily Morning & Evening',
    price_per_seat NUMERIC(10, 2) NOT NULL DEFAULT 40.00,
    available_seats INTEGER NOT NULL DEFAULT 6,
    total_seats INTEGER NOT NULL DEFAULT 6,
    luggage_space TEXT DEFAULT 'Moderate luggage & farm produce bag allowed',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'in_transit', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Bookings / Seat Reservations Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    traveller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    seats_booked INTEGER NOT NULL DEFAULT 1,
    total_fare NUMERIC(10, 2) NOT NULL,
    pickup_point TEXT NOT NULL,
    drop_point TEXT NOT NULL,
    passenger_name TEXT NOT NULL,
    passenger_phone TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'cash_on_ride' CHECK (payment_status IN ('cash_on_ride', 'upi_paid', 'wallet')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 7. Idempotent RLS Policies (Clean drop and re-create)

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Vehicles Policies
DROP POLICY IF EXISTS "Vehicles are viewable by everyone" ON public.vehicles;
CREATE POLICY "Vehicles are viewable by everyone" 
ON public.vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Drivers can insert their vehicles" ON public.vehicles;
CREATE POLICY "Drivers can insert their vehicles" 
ON public.vehicles FOR INSERT WITH CHECK (auth.uid() = driver_id);

DROP POLICY IF EXISTS "Drivers can update their vehicles" ON public.vehicles;
CREATE POLICY "Drivers can update their vehicles" 
ON public.vehicles FOR UPDATE USING (auth.uid() = driver_id);

-- Routes Policies
DROP POLICY IF EXISTS "Routes are viewable by everyone" ON public.routes;
CREATE POLICY "Routes are viewable by everyone" 
ON public.routes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Drivers can insert their routes" ON public.routes;
CREATE POLICY "Drivers can insert their routes" 
ON public.routes FOR INSERT WITH CHECK (auth.uid() = driver_id);

DROP POLICY IF EXISTS "Drivers can update their own routes" ON public.routes;
CREATE POLICY "Drivers can update their own routes" 
ON public.routes FOR UPDATE USING (auth.uid() = driver_id);

DROP POLICY IF EXISTS "Drivers can delete their own routes" ON public.routes;
CREATE POLICY "Drivers can delete their own routes" 
ON public.routes FOR DELETE USING (auth.uid() = driver_id);

-- Bookings Policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT USING (
    auth.uid() = traveller_id OR 
    auth.uid() IN (SELECT r.driver_id FROM public.routes r WHERE r.id = route_id)
);

DROP POLICY IF EXISTS "Travellers can insert bookings" ON public.bookings;
CREATE POLICY "Travellers can insert bookings" 
ON public.bookings FOR INSERT WITH CHECK (auth.uid() = traveller_id);

DROP POLICY IF EXISTS "Travellers & Drivers can update booking status" ON public.bookings;
CREATE POLICY "Travellers & Drivers can update booking status" 
ON public.bookings FOR UPDATE USING (
    auth.uid() = traveller_id OR 
    auth.uid() IN (SELECT r.driver_id FROM public.routes r WHERE r.id = route_id)
);

-- 8. Auto-create Profile Trigger on User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, phone, village_town)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'NextRide Member'),
    COALESCE(new.raw_user_meta_data->>'role', 'traveller'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'village_town', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
