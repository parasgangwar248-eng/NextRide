import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface RouteStop {
  name_en: string;
  name_hi: string;
  km: number;
}

export interface TransitRoute {
  id: string;
  route_code: string;
  name_en: string;
  name_hi: string;
  origin_en: string;
  origin_hi: string;
  destination_en: string;
  destination_hi: string;
  stops: RouteStop[];
  base_fare: number;
  distance_km: number;
  duration_mins: number;
  is_active: boolean;
}

export type TripStatus = 'scheduled' | 'boarding' | 'in_transit' | 'completed' | 'delayed' | 'cancelled';

export interface Trip {
  id: string;
  route_id: string;
  route?: TransitRoute;
  driver_name: string;
  driver_phone: string;
  vehicle_number: string;
  departure_time: string;
  estimated_arrival: string;
  status: TripStatus;
  total_seats: number;
  booked_seats: number;
  current_stop_index: number;
  delay_minutes: number;
}

export interface Booking {
  id: string;
  trip_id: string;
  passenger_name: string;
  passenger_phone: string;
  seat_count: number;
  total_fare: number;
  boarding_stop: string;
  dropoff_stop: string;
  otp_code: string;
  status: 'confirmed' | 'boarded' | 'cancelled';
  created_at: string;
}

interface MobilityContextType {
  routes: TransitRoute[];
  trips: Trip[];
  bookings: Booking[];
  activeTicket: Booking | null;
  selectedRouteId: string | null;
  setSelectedRouteId: (id: string | null) => void;
  bookSeat: (params: {
    tripId: string;
    passengerName: string;
    passengerPhone: string;
    seatCount: number;
    boardingStop: string;
    dropoffStop: string;
  }) => Promise<{ success: boolean; booking?: Booking; error?: string }>;
  startTrip: (tripId: string) => void;
  departStop: (tripId: string) => void;
  reportDelay: (tripId: string, minutes: number) => void;
  arriveStop: (tripId: string) => void;
  completeTrip: (tripId: string) => void;
  verifyOtp: (tripId: string, otp: string) => { success: boolean; message: string };
  isSupabaseLive: boolean;
  refreshData: () => Promise<void>;
}

// Default Authentic Rural & Semi-Urban Seed Data
const DEFAULT_ROUTES: TransitRoute[] = [
  {
    id: 'r-101',
    route_code: 'NR-101',
    name_en: 'Chandpur Village Mandi ↔ Greenfield Tehsil Junction',
    name_hi: 'चांदपुर ग्रामीण मंडी ↔ ग्रीनफील्ड तहसील जंक्शन',
    origin_en: 'Chandpur Village Mandi',
    origin_hi: 'चांदपुर ग्रामीण मंडी',
    destination_en: 'Greenfield Tehsil Junction',
    destination_hi: 'ग्रीनफील्ड तहसील जंक्शन',
    stops: [
      { name_en: 'Chandpur Village Mandi', name_hi: 'चांदपुर ग्रामीण मंडी', km: 0 },
      { name_en: 'Bishanpur Crossing', name_hi: 'बिशनपुर चौराहा', km: 4.2 },
      { name_en: 'Kalyanpur Health Post', name_hi: 'कल्याणपुर स्वास्थ्य केंद्र', km: 9.5 },
      { name_en: 'Greenfield Tehsil Junction', name_hi: 'ग्रीनफील्ड तहसील जंक्शन', km: 16.0 },
    ],
    base_fare: 25,
    distance_km: 16.0,
    duration_mins: 35,
    is_active: true,
  },
  {
    id: 'r-102',
    route_code: 'NR-102',
    name_en: 'Rampur Block Centre ↔ District Civil Hospital',
    name_hi: 'रामपुर ब्लॉक सेंटर ↔ जिला सिविल अस्पताल',
    origin_en: 'Rampur Block Centre',
    origin_hi: 'रामपुर ब्लॉक सेंटर',
    destination_en: 'District Civil Hospital',
    destination_hi: 'जिला सिविल अस्पताल',
    stops: [
      { name_en: 'Rampur Block Centre', name_hi: 'रामपुर ब्लॉक सेंटर', km: 0 },
      { name_en: 'Kisan Seva Kendra', name_hi: 'किसान सेवा केंद्र', km: 6.0 },
      { name_en: 'Adarsh Nagar By-pass', name_hi: 'आदर्श नगर बाईपास', km: 13.8 },
      { name_en: 'District Civil Hospital', name_hi: 'जिला सिविल अस्पताल', km: 21.4 },
    ],
    base_fare: 35,
    distance_km: 21.4,
    duration_mins: 45,
    is_active: true,
  },
  {
    id: 'r-204',
    route_code: 'NR-204',
    name_en: 'Kisan Krishi Mandi ↔ Central Railway Station',
    name_hi: 'किसान कृषि मंडी ↔ केंद्रीय रेलवे स्टेशन',
    origin_en: 'Kisan Krishi Mandi',
    origin_hi: 'किसान कृषि मंडी',
    destination_en: 'Central Railway Station',
    destination_hi: 'केंद्रीय रेलवे स्टेशन',
    stops: [
      { name_en: 'Kisan Krishi Mandi', name_hi: 'किसान कृषि मंडी', km: 0 },
      { name_en: 'Fertilizer Depot', name_hi: 'खाद गोदाम', km: 3.5 },
      { name_en: 'Old Grain Market', name_hi: 'पुरानी अनाज मंडी', km: 8.0 },
      { name_en: 'Central Railway Station', name_hi: 'केंद्रीय रेलवे स्टेशन', km: 12.5 },
    ],
    base_fare: 20,
    distance_km: 12.5,
    duration_mins: 30,
    is_active: true,
  },
  {
    id: 'r-305',
    route_code: 'NR-305',
    name_en: 'Shantipura Panchayat ↔ Industrial Hub & Degree College',
    name_hi: 'शांतिपुरा पंचायत ↔ औद्योगिक केंद्र एवं डिग्री कॉलेज',
    origin_en: 'Shantipura Panchayat',
    origin_hi: 'शांतिपुरा पंचायत',
    destination_en: 'Industrial Hub & Degree College',
    destination_hi: 'औद्योगिक केंद्र एवं डिग्री कॉलेज',
    stops: [
      { name_en: 'Shantipura Panchayat', name_hi: 'शांतिपुरा पंचायत', km: 0 },
      { name_en: 'Government Girls School', name_hi: 'राजकीय कन्या विद्यालय', km: 5.1 },
      { name_en: 'Industrial Sector 4', name_hi: 'औद्योगिक सेक्टर 4', km: 11.2 },
      { name_en: 'Degree College Campus', name_hi: 'डिग्री कॉलेज परिसर', km: 18.0 },
    ],
    base_fare: 30,
    distance_km: 18.0,
    duration_mins: 40,
    is_active: true,
  }
];

const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-101',
    route_id: 'r-101',
    driver_name: 'Rajesh Kumar Verma',
    driver_phone: '+91 98765 43210',
    vehicle_number: 'UP-25-NR-1082',
    departure_time: new Date(Date.now() + 8 * 60 * 1000).toISOString(), // 8 mins away
    estimated_arrival: new Date(Date.now() + 43 * 60 * 1000).toISOString(),
    status: 'scheduled',
    total_seats: 16,
    booked_seats: 9,
    current_stop_index: 0,
    delay_minutes: 0,
  },
  {
    id: 'trip-102',
    route_id: 'r-102',
    driver_name: 'Suresh Chandra Sharma',
    driver_phone: '+91 94123 78901',
    vehicle_number: 'UP-25-NR-3319',
    departure_time: new Date(Date.now() + 22 * 60 * 1000).toISOString(), // 22 mins away
    estimated_arrival: new Date(Date.now() + 67 * 60 * 1000).toISOString(),
    status: 'scheduled',
    total_seats: 14,
    booked_seats: 6,
    current_stop_index: 0,
    delay_minutes: 0,
  },
  {
    id: 'trip-204',
    route_id: 'r-204',
    driver_name: 'Mahendra Singh Yadav',
    driver_phone: '+91 98370 11223',
    vehicle_number: 'UP-25-NR-8840',
    departure_time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    estimated_arrival: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    status: 'in_transit',
    total_seats: 18,
    booked_seats: 15,
    current_stop_index: 1,
    delay_minutes: 0,
  },
  {
    id: 'trip-305',
    route_id: 'r-305',
    driver_name: 'Anil Kumar Prajapati',
    driver_phone: '+91 97190 55667',
    vehicle_number: 'UP-25-NR-5521',
    departure_time: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
    estimated_arrival: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
    status: 'scheduled',
    total_seats: 16,
    booked_seats: 4,
    current_stop_index: 0,
    delay_minutes: 0,
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    trip_id: 'trip-101',
    passenger_name: 'Rameshwar Dayal',
    passenger_phone: '9897123450',
    seat_count: 2,
    total_fare: 50,
    boarding_stop: 'Chandpur Village Mandi',
    dropoff_stop: 'Greenfield Tehsil Junction',
    otp_code: '4821',
    status: 'confirmed',
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'bk-1002',
    trip_id: 'trip-101',
    passenger_name: 'Sunita Devi',
    passenger_phone: '9412098765',
    seat_count: 1,
    total_fare: 25,
    boarding_stop: 'Bishanpur Crossing',
    dropoff_stop: 'Greenfield Tehsil Junction',
    otp_code: '7914',
    status: 'boarded',
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  }
];

const MobilityContext = createContext<MobilityContextType | undefined>(undefined);

export const MobilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<TransitRoute[]>(DEFAULT_ROUTES);
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('nextride_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('nextride_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });
  const [activeTicket, setActiveTicket] = useState<Booking | null>(() => {
    const saved = localStorage.getItem('nextride_active_ticket');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('nextride_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('nextride_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (activeTicket) {
      localStorage.setItem('nextride_active_ticket', JSON.stringify(activeTicket));
    } else {
      localStorage.removeItem('nextride_active_ticket');
    }
  }, [activeTicket]);

  // If Supabase is connected, attempt syncing
  const refreshData = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data: routeData } = await supabase.from('routes').select('*');
      const { data: tripData } = await supabase.from('trips').select('*');
      const { data: bookingData } = await supabase.from('bookings').select('*');

      if (routeData && routeData.length > 0) {
        setRoutes(routeData as unknown as TransitRoute[]);
      }
      if (tripData && tripData.length > 0) {
        setTrips(tripData as unknown as Trip[]);
      }
      if (bookingData && bookingData.length > 0) {
        setBookings(bookingData as unknown as Booking[]);
      }
    } catch (err) {
      console.warn('Supabase fetch notice: using local state fallback', err);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured) {
      refreshData();
    }
  }, []);

  // Associate routes to trips
  const tripsWithRoutes = trips.map(trip => {
    const matchedRoute = routes.find(r => r.id === trip.route_id);
    return {
      ...trip,
      route: matchedRoute,
    };
  });

  const bookSeat = async (params: {
    tripId: string;
    passengerName: string;
    passengerPhone: string;
    seatCount: number;
    boardingStop: string;
    dropoffStop: string;
  }) => {
    const targetTrip = trips.find(t => t.id === params.tripId);
    if (!targetTrip) return { success: false, error: 'Trip not found' };

    const availableSeats = targetTrip.total_seats - targetTrip.booked_seats;
    if (availableSeats < params.seatCount) {
      return { success: false, error: 'Not enough seats available' };
    }

    const route = routes.find(r => r.id === targetTrip.route_id);
    const fare = (route ? route.base_fare : 25) * params.seatCount;

    // Generate random 4-digit authentic OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const newBooking: Booking = {
      id: 'bk-' + Date.now().toString().slice(-6),
      trip_id: params.tripId,
      passenger_name: params.passengerName,
      passenger_phone: params.passengerPhone,
      seat_count: params.seatCount,
      total_fare: fare,
      boarding_stop: params.boardingStop,
      dropoff_stop: params.dropoffStop,
      otp_code: otp,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };

    // Update local state
    setTrips(prev =>
      prev.map(t =>
        t.id === params.tripId ? { ...t, booked_seats: t.booked_seats + params.seatCount } : t
      )
    );
    setBookings(prev => [newBooking, ...prev]);
    setActiveTicket(newBooking);

    // Sync with Supabase if live
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('bookings').insert([newBooking]);
        await supabase
          .from('trips')
          .update({ booked_seats: targetTrip.booked_seats + params.seatCount })
          .eq('id', params.tripId);
      } catch (e) {
        console.warn('Supabase write error, preserved locally:', e);
      }
    }

    return { success: true, booking: newBooking };
  };

  // Driver Ops Actions
  const startTrip = (tripId: string) => {
    setTrips(prev =>
      prev.map(t => (t.id === tripId ? { ...t, status: 'boarding' as TripStatus } : t))
    );
  };

  const departStop = (tripId: string) => {
    setTrips(prev =>
      prev.map(t => (t.id === tripId ? { ...t, status: 'in_transit' as TripStatus } : t))
    );
  };

  const reportDelay = (tripId: string, minutes: number) => {
    setTrips(prev =>
      prev.map(t =>
        t.id === tripId
          ? {
              ...t,
              status: 'delayed' as TripStatus,
              delay_minutes: t.delay_minutes + minutes,
            }
          : t
      )
    );
  };

  const arriveStop = (tripId: string) => {
    setTrips(prev =>
      prev.map(t => {
        if (t.id !== tripId) return t;
        const currentRoute = routes.find(r => r.id === t.route_id);
        const maxStops = currentRoute ? currentRoute.stops.length - 1 : 3;
        const nextIndex = Math.min(t.current_stop_index + 1, maxStops);
        return {
          ...t,
          current_stop_index: nextIndex,
          status: nextIndex === maxStops ? ('completed' as TripStatus) : ('in_transit' as TripStatus),
        };
      })
    );
  };

  const completeTrip = (tripId: string) => {
    setTrips(prev =>
      prev.map(t => (t.id === tripId ? { ...t, status: 'completed' as TripStatus } : t))
    );
  };

  const verifyOtp = (tripId: string, otp: string) => {
    const matchingBooking = bookings.find(
      b => b.trip_id === tripId && b.otp_code.trim() === otp.trim()
    );

    if (!matchingBooking) {
      return { success: false, message: 'Invalid OTP code. Please re-check with the passenger.' };
    }

    if (matchingBooking.status === 'boarded') {
      return { success: false, message: 'Passenger is already verified and boarded.' };
    }

    setBookings(prev =>
      prev.map(b => (b.id === matchingBooking.id ? { ...b, status: 'boarded' } : b))
    );

    if (activeTicket && activeTicket.id === matchingBooking.id) {
      setActiveTicket({ ...activeTicket, status: 'boarded' });
    }

    return {
      success: true,
      message: `Verified! ${matchingBooking.passenger_name} (${matchingBooking.seat_count} seat(s)) boarded.`,
    };
  };

  return (
    <MobilityContext.Provider
      value={{
        routes,
        trips: tripsWithRoutes,
        bookings,
        activeTicket,
        selectedRouteId,
        setSelectedRouteId,
        bookSeat,
        startTrip,
        departStop,
        reportDelay,
        arriveStop,
        completeTrip,
        verifyOtp,
        isSupabaseLive: isSupabaseConfigured,
        refreshData,
      }}
    >
      {children}
    </MobilityContext.Provider>
  );
};

export const useMobility = (): MobilityContextType => {
  const context = useContext(MobilityContext);
  if (!context) {
    throw new Error('useMobility must be used within a MobilityProvider');
  }
  return context;
};
