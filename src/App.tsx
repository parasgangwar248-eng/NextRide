import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, SharedRoute, Booking } from './lib/types';
import { INITIAL_ROUTES, DEMO_USERS } from './lib/mockData';
import { getSupabaseClient, getSavedSupabaseConfig } from './lib/supabaseClient';
import { Navbar } from './components/Navbar';
import { TravellerView } from './components/TravellerView';
import { DriverView } from './components/DriverView';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { SupabaseGuideModal } from './components/SupabaseGuideModal';
import { Footer } from './components/Footer';

const STORAGE_ROUTES_KEY = 'nextride_routes_v1';
const STORAGE_BOOKINGS_KEY = 'nextride_bookings_v1';
const STORAGE_USER_KEY = 'nextride_user_v1';

export function App() {
  // Authentication & Role
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser?.role || 'traveller';
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings' | 'driver-routes' | 'driver-post'>('explore');

  // Shared Routes state
  const [routes, setRoutes] = useState<SharedRoute[]>(() => {
    const saved = localStorage.getItem(STORAGE_ROUTES_KEY);
    return saved ? JSON.parse(saved) : INITIAL_ROUTES;
  });

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_BOOKINGS_KEY);
    return saved ? JSON.parse(saved) : [
      {
        id: 'NR-849201',
        route_id: 'route-101',
        traveller_id: 'traveller-1',
        passenger_name: 'Anita Sharma',
        passenger_phone: '+91 97112 33445',
        pickup_point: 'Rampur Village Chowk',
        drop_point: 'District Main Mandi & Hospital',
        seats_booked: 2,
        total_fare: 80,
        status: 'confirmed',
        payment_status: 'cash_on_ride',
        created_at: new Date().toISOString(),
        route: INITIAL_ROUTES[0]
      }
    ];
  });

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSupabaseGuideOpen, setIsSupabaseGuideOpen] = useState(false);
  const [selectedRouteForBooking, setSelectedRouteForBooking] = useState<SharedRoute | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_ROUTES_KEY, JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [currentUser]);

  // Load from Supabase if connected
  const fetchSupabaseData = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      // Check auth session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setCurrentUser({
            id: profile.id,
            email: session.user.email || '',
            full_name: profile.full_name || 'User',
            phone: profile.phone || '',
            role: profile.role || 'traveller',
            village_town: profile.village_town || '',
            rating: profile.rating || 4.9,
            total_trips: profile.total_trips || 0
          });
        }
      }

      // Fetch routes
      const { data: routesData, error: routesError } = await supabase
        .from('routes')
        .select('*')
        .eq('status', 'active');

      if (!routesError && routesData && routesData.length > 0) {
        const mappedRoutes: SharedRoute[] = routesData.map((r: any) => ({
          id: r.id,
          driver_id: r.driver_id,
          driver_name: r.driver_name || 'Verified Driver',
          driver_phone: r.driver_phone || '+91 98000 00000',
          driver_rating: 4.9,
          vehicle_type: r.vehicle_type || 'Jeep / Cruiser',
          vehicle_model: r.vehicle_model || 'Shared Vehicle',
          plate_number: r.plate_number || 'RJ-14-XX-0000',
          origin: r.origin_name || r.origin,
          destination: r.destination_name || r.destination,
          intermediate_stops: r.intermediate_stops || [],
          departure_time: r.departure_time,
          frequency: r.frequency || 'Daily',
          price_per_seat: Number(r.price_per_seat),
          available_seats: Number(r.available_seats),
          total_seats: Number(r.total_seats || 6),
          luggage_space: r.luggage_space || 'Allowed',
          has_carrier: true,
          status: 'active'
        }));
        setRoutes(mappedRoutes);
      }
    } catch (err) {
      console.log('Supabase sync skipped or errored:', err);
    }
  };

  useEffect(() => {
    fetchSupabaseData();
  }, []);

  // Handlers
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveRole(user.role);
  };

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
  };

  const handleBookRide = (route: SharedRoute) => {
    setSelectedRouteForBooking(route);
  };

  const handleConfirmBooking = async (newBooking: Booking) => {
    // 1. Add to local state
    setBookings(prev => [newBooking, ...prev]);

    // 2. Decrement available seats in route
    setRoutes(prev => prev.map(r => {
      if (r.id === newBooking.route_id) {
        const remaining = Math.max(0, r.available_seats - newBooking.seats_booked);
        return { ...r, available_seats: remaining };
      }
      return r;
    }));

    // 3. Persist to Supabase if connected
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('bookings').insert({
          route_id: newBooking.route_id,
          traveller_id: newBooking.traveller_id,
          seats_booked: newBooking.seats_booked,
          total_fare: newBooking.total_fare,
          pickup_point: newBooking.pickup_point,
          drop_point: newBooking.drop_point,
          passenger_name: newBooking.passenger_name,
          passenger_phone: newBooking.passenger_phone,
          payment_status: newBooking.payment_status,
          status: 'confirmed'
        });
      } catch (e) {
        console.error('Failed to save booking to Supabase:', e);
      }
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const handleAddRoute = async (newRoute: SharedRoute) => {
    setRoutes(prev => [newRoute, ...prev]);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('routes').insert({
          driver_id: newRoute.driver_id,
          origin_name: newRoute.origin,
          destination_name: newRoute.destination,
          intermediate_stops: newRoute.intermediate_stops,
          departure_time: newRoute.departure_time,
          price_per_seat: newRoute.price_per_seat,
          available_seats: newRoute.available_seats,
          total_seats: newRoute.total_seats,
          vehicle_type: newRoute.vehicle_type,
          status: 'active'
        });
      } catch (e) {
        console.error('Failed to post route to Supabase:', e);
      }
    }
  };

  const handleDeleteRoute = (routeId: string) => {
    setRoutes(prev => prev.filter(r => r.id !== routeId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenSupabaseGuide={() => setIsSupabaseGuideOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main App Content based on Role */}
      <main className="flex-1">
        {activeRole === 'traveller' ? (
          <TravellerView
            routes={routes}
            bookings={bookings}
            currentUser={currentUser}
            onBookRide={handleBookRide}
            onCancelBooking={handleCancelBooking}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        ) : (
          <DriverView
            routes={routes}
            bookings={bookings}
            currentUser={currentUser}
            onAddRoute={handleAddRoute}
            onDeleteRoute={handleDeleteRoute}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenSupabaseGuide={() => setIsSupabaseGuideOpen(true)} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={activeRole}
      />

      {/* Booking Seat Modal */}
      <BookingModal
        isOpen={!!selectedRouteForBooking}
        route={selectedRouteForBooking}
        currentUser={currentUser}
        onClose={() => setSelectedRouteForBooking(null)}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* Supabase PostgreSQL Guide & Config Modal */}
      <SupabaseGuideModal
        isOpen={isSupabaseGuideOpen}
        onClose={() => setIsSupabaseGuideOpen(false)}
        onConfigSaved={fetchSupabaseData}
      />
    </div>
  );
}
export default App;
