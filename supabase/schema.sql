-- NextRide Supabase Database Schema
-- Reliable Shared-Mobility Network for Rural and Semi-Urban Communities

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('passenger', 'driver', 'admin')),
    vehicle_number TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Transit Routes Table
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_code TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    origin_en TEXT NOT NULL,
    origin_hi TEXT NOT NULL,
    destination_en TEXT NOT NULL,
    destination_hi TEXT NOT NULL,
    stops JSONB NOT NULL DEFAULT '[]'::jsonb,
    base_fare NUMERIC(10,2) NOT NULL DEFAULT 20.00,
    distance_km NUMERIC(5,1) NOT NULL,
    duration_mins INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Vehicle Trips & Departures Table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    driver_name TEXT NOT NULL DEFAULT 'Rajesh Kumar',
    driver_phone TEXT NOT NULL DEFAULT '+91 98765 43210',
    vehicle_number TEXT NOT NULL DEFAULT 'UP-25-AT-4482',
    departure_time TIMESTAMPTZ NOT NULL,
    estimated_arrival TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'boarding', 'in_transit', 'completed', 'delayed', 'cancelled')) DEFAULT 'scheduled',
    total_seats INTEGER NOT NULL DEFAULT 16,
    booked_seats INTEGER NOT NULL DEFAULT 0,
    current_stop_index INTEGER NOT NULL DEFAULT 0,
    delay_minutes INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Passenger Bookings & Digital Tickets
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    passenger_name TEXT NOT NULL,
    passenger_phone TEXT NOT NULL,
    seat_count INTEGER NOT NULL DEFAULT 1,
    total_fare NUMERIC(10,2) NOT NULL,
    boarding_stop TEXT NOT NULL,
    dropoff_stop TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'boarded', 'cancelled')) DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Live GPS Telemetry
CREATE TABLE IF NOT EXISTS public.live_tracking (
    trip_id UUID PRIMARY KEY REFERENCES public.trips(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    speed_kmh DOUBLE PRECISION NOT NULL DEFAULT 0,
    heading DOUBLE PRECISION NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_tracking ENABLE ROW LEVEL SECURITY;

-- 8. Permissive Read & Insert Policies for NextRide Shared App Operations
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on routes" ON public.routes FOR SELECT USING (true);
CREATE POLICY "Allow public read access on trips" ON public.trips FOR SELECT USING (true);
CREATE POLICY "Allow public update on trips" ON public.trips FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on bookings" ON public.bookings FOR UPDATE USING (true);

CREATE POLICY "Allow public read/write on live_tracking" ON public.live_tracking FOR ALL USING (true);

-- 9. Enable Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_tracking;

-- 10. Seed Authentic Rural and Semi-Urban Mobility Network Routes
INSERT INTO public.routes (route_code, name_en, name_hi, origin_en, origin_hi, destination_en, destination_hi, stops, base_fare, distance_km, duration_mins)
VALUES 
(
    'NR-101',
    'Chandpur Village Mandi ↔ Greenfield Tehsil Junction',
    'चांदपुर ग्रामीण मंडी ↔ ग्रीनफील्ड तहसील जंक्शन',
    'Chandpur Village Mandi',
    'चांदपुर ग्रामीण मंडी',
    'Greenfield Tehsil Junction',
    'ग्रीनफील्ड तहसील जंक्शन',
    '[
        {"name_en": "Chandpur Village Mandi", "name_hi": "चांदपुर ग्रामीण मंडी", "km": 0},
        {"name_en": "Bishanpur Crossing", "name_hi": "बिशनपुर चौराहा", "km": 4.2},
        {"name_en": "Kalyanpur Health Post", "name_hi": "कल्याणपुर स्वास्थ्य केंद्र", "km": 9.5},
        {"name_en": "Greenfield Tehsil Junction", "name_hi": "ग्रीनफील्ड तहसील जंक्शन", "km": 16.0}
    ]'::jsonb,
    25.00,
    16.0,
    35
),
(
    'NR-102',
    'Rampur Block Centre ↔ District Civil Hospital',
    'रामपुर ब्लॉक सेंटर ↔ जिला सिविल अस्पताल',
    'Rampur Block Centre',
    'रामपुर ब्लॉक सेंटर',
    'District Civil Hospital',
    'जिला सिविल अस्पताल',
    '[
        {"name_en": "Rampur Block Centre", "name_hi": "रामपुर ब्लॉक सेंटर", "km": 0},
        {"name_en": "Kisan Seva Kendra", "name_hi": "किसान सेवा केंद्र", "km": 6.0},
        {"name_en": "Adarsh Nagar By-pass", "name_hi": "आदर्श नगर बाईपास", "km": 13.8},
        {"name_en": "District Civil Hospital", "name_hi": "जिला सिविल अस्पताल", "km": 21.4}
    ]'::jsonb,
    35.00,
    21.4,
    45
),
(
    'NR-204',
    'Kisan Krishi Mandi ↔ Central Railway Station',
    'किसान कृषि मंडी ↔ केंद्रीय रेलवे स्टेशन',
    'Kisan Krishi Mandi',
    'किसान कृषि मंडी',
    'Central Railway Station',
    'केंद्रीय रेलवे स्टेशन',
    '[
        {"name_en": "Kisan Krishi Mandi", "name_hi": "किसान कृषि मंडी", "km": 0},
        {"name_en": "Fertilizer Depot", "name_hi": "खाद गोदाम", "km": 3.5},
        {"name_en": "Old Grain Market", "name_hi": "पुरानी अनाज मंडी", "km": 8.0},
        {"name_en": "Central Railway Station", "name_hi": "केंद्रीय रेलवे स्टेशन", "km": 12.5}
    ]'::jsonb,
    20.00,
    12.5,
    30
),
(
    'NR-305',
    'Shantipura Panchayat ↔ Industrial Hub & Degree College',
    'शांतिपुरा पंचायत ↔ औद्योगिक केंद्र एवं डिग्री कॉलेज',
    'Shantipura Panchayat',
    'शांतिपुरा पंचायत',
    'Industrial Hub & Degree College',
    'औद्योगिक केंद्र एवं डिग्री कॉलेज',
    '[
        {"name_en": "Shantipura Panchayat", "name_hi": "शांतिपुरा पंचायत", "km": 0},
        {"name_en": "Government Girls School", "name_hi": "राजकीय कन्या विद्यालय", "km": 5.1},
        {"name_en": "Industrial Sector 4", "name_hi": "औद्योगिक सेक्टर 4", "km": 11.2},
        {"name_en": "Degree College Campus", "name_hi": "डिग्री कॉलेज परिसर", "km": 18.0}
    ]'::jsonb,
    30.00,
    18.0,
    40
);
