import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, SharedRoute, Booking, Language } from './lib/types';
import { INITIAL_ROUTES } from './lib/mockData';
import { getSupabaseClient } from './lib/supabaseClient';
import { Navbar } from './components/Navbar';
import { TravellerView } from './components/TravellerView';
import { DriverView } from './components/DriverView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { AuthGateway } from './components/AuthGateway';
import { BookingModal } from './components/BookingModal';
import { SafetyModal } from './components/SafetyModal';
import { SettingsModal } from './components/SettingsModal';
import { SupabaseGuideModal } from './components/SupabaseGuideModal';
import { Footer } from './components/Footer';
import { Zap, Radio, Ticket, Car, ShieldCheck } from 'lucide-react';
import { translations } from './lib/translations';

const STORAGE_ROUTES_KEY = 'nextride_routes_v2';
const STORAGE_BOOKINGS_KEY = 'nextride_bookings_v2';
const STORAGE_USER_KEY = 'nextride_user_v2';
const STORAGE_LANG_KEY = 'nextride_lang_v2';

export function App() {
  // Language (English or Hindi)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    return (saved as Language) || 'en';
  });

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    localStorage.setItem(STORAGE_LANG_KEY, nextLang);
  };

  const t = translations[lang];

  // Authentication & Guest State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser?.role || 'traveller';
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings' | 'live-map' | 'driver-routes' | 'driver-post'>('explore');

  // Shared Routes state (E-Rickshaws & Autos)
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
        otp: '4891',
        route_id: 'route-e101',
        traveller_id: 'traveller-1',
        passenger_name: 'Anita Sharma',
        passenger_phone: '+91 97112 33445',
        pickup_point: 'Rampur Village Chowk',
        drop_point: 'Krishi Mandi & Tehsil Hub',
        seats_booked: 2,
        booking_type: 'shared_seat',
        total_fare: 30,
        status: 'confirmed',
        payment_status: 'cash_on_ride',
        created_at: new Date().toISOString(),
        route: INITIAL_ROUTES[0],
      }
    ];
  });

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isSupabaseGuideOpen, setIsSupabaseGuideOpen] = useState(false);
  const [selectedRouteForBooking, setSelectedRouteForBooking] = useState<SharedRoute | null>(null);

  // Sync LocalStorage
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
            total_trips: profile.total_trips || 0,
          });
        }
      }

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
          vehicle_type: r.vehicle_type || 'E-Rickshaw Shared (Toto / Electric)',
          vehicle_model: r.vehicle_model || 'Mahindra Treo Electric',
          plate_number: r.plate_number || 'DL-5E-AR-0000',
          origin: r.origin_name || r.origin,
          destination: r.destination_name || r.destination,
          intermediate_stops: r.intermediate_stops || [],
          departure_time: r.departure_time,
          frequency: r.frequency || 'Continuous',
          price_per_seat: Number(r.price_per_seat),
          full_vehicle_price: Number(r.full_vehicle_price || r.price_per_seat * 4),
          available_seats: Number(r.available_seats),
          total_seats: Number(r.total_seats || 4),
          luggage_space: r.luggage_space || 'Allowed',
          is_electric: (r.vehicle_type || '').includes('E-Rickshaw'),
          has_carrier: true,
          eta_mins: 3,
          status: 'active',
        }));
        setRoutes(mappedRoutes);
      }
    } catch (err) {
      console.log('Supabase sync:', err);
    }
  };

  useEffect(() => {
    fetchSupabaseData();
  }, []);

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
    setIsGuestMode(false);
  };

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
  };

  const handleBookRide = (route: SharedRoute) => {
    setSelectedRouteForBooking(route);
  };

  const handleConfirmBooking = async (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);

    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === newBooking.route_id) {
          const remaining = Math.max(0, r.available_seats - newBooking.seats_booked);
          return { ...r, available_seats: remaining };
        }
        return r;
      })
    );

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
          status: 'confirmed',
        });
      } catch (e) {
        console.error('Supabase booking save:', e);
      }
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    const bookingToCancel = bookings.find(b => b.id === bookingId);
    if (bookingToCancel) {
      // Restock seats
      setRoutes(prev =>
        prev.map(r => {
          if (r.id === bookingToCancel.route_id) {
            return {
              ...r,
              available_seats: Math.min(r.total_seats, r.available_seats + bookingToCancel.seats_booked)
            };
          }
          return r;
        })
      );
    }
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const handleAddRoute = async (newRoute: SharedRoute) => {
    setRoutes((prev) => [newRoute, ...prev]);

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
          status: 'active',
        });
      } catch (e) {
        console.error('Supabase route post:', e);
      }
    }
  };

  const handleDeleteRoute = (routeId: string) => {
    setRoutes((prev) => prev.filter((r) => r.id !== routeId));
  };

  // If user is not logged in and not in guest mode, show the Login Page first!
  if (!currentUser && !isGuestMode) {
    return (
      <AuthGateway
        onLoginSuccess={handleLoginSuccess}
        onExploreAsGuest={() => setIsGuestMode(true)}
        lang={lang}
        onToggleLang={toggleLang}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white pb-14 md:pb-0">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenSupabaseGuide={() => setIsSupabaseGuideOpen(true)}
        onOpenSafety={() => setIsSafetyOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        lang={lang}
        onToggleLang={toggleLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Portals */}
      <main className="flex-1">
        {activeRole === 'admin' ? (
          <AdminPanel
            currentUser={currentUser}
            routes={routes}
            bookings={bookings}
            lang={lang}
            onLogout={handleLogout}
            onSwitchToTraveller={() => setActiveRole('traveller')}
            onSwitchToDriver={() => setActiveRole('driver')}
          />
        ) : activeRole === 'traveller' ? (
          <TravellerView
            routes={routes}
            bookings={bookings}
            currentUser={currentUser}
            onBookRide={handleBookRide}
            onCancelBooking={handleCancelBooking}
            onOpenAuth={() => setIsAuthOpen(true)}
            lang={lang}
          />
        ) : (
          <DriverView
            routes={routes}
            bookings={bookings}
            currentUser={currentUser}
            onAddRoute={handleAddRoute}
            onDeleteRoute={handleDeleteRoute}
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenSupabaseGuide={() => setIsSupabaseGuideOpen(true)}
        onOpenSafety={() => setIsSafetyOpen(true)}
        lang={lang}
      />

      {/* Mobile Bottom Navigation Bar (Ola / Uber / Rapido Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => {
            setActiveRole('traveller');
            setActiveTab('explore');
          }}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            activeRole === 'traveller' && activeTab === 'explore'
              ? 'text-brand-600 font-black'
              : 'text-slate-500 font-medium'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px]">{t.findRide.split(' ')[0]}</span>
        </button>

        <button
          onClick={() => {
            setActiveRole('traveller');
            setActiveTab('live-map');
          }}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            activeRole === 'traveller' && activeTab === 'live-map'
              ? 'text-brand-600 font-black'
              : 'text-slate-500 font-medium'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="text-[10px]">Radar</span>
        </button>

        <button
          onClick={() => {
            setActiveRole('driver');
          }}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            activeRole === 'driver'
              ? 'text-brand-600 font-black'
              : 'text-slate-500 font-medium'
          }`}
        >
          <Car className="w-5 h-5" />
          <span className="text-[10px]">{t.driverPortal.split(' ')[0]}</span>
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-slate-600 hover:text-slate-900 font-bold"
        >
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <span className="text-[10px]">Settings</span>
        </button>

        <button
          onClick={() => setIsSafetyOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-red-600 font-bold"
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px]">SOS 112</span>
        </button>
      </div>

      {/* Auth Modal (Create Account / Switch Account) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={activeRole}
      />

      {/* Settings & Accounts Management Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onSwitchUser={handleLoginSuccess}
        onCreateAnotherAccount={() => {
          setIsSettingsOpen(false);
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        onOpenSupabaseGuide={() => {
          setIsSettingsOpen(false);
          setIsSupabaseGuideOpen(true);
        }}
        lang={lang}
        onToggleLang={toggleLang}
      />

      {/* Booking Seat Modal with 4-Digit OTP */}
      <BookingModal
        isOpen={!!selectedRouteForBooking}
        route={selectedRouteForBooking}
        currentUser={currentUser}
        onClose={() => setSelectedRouteForBooking(null)}
        onConfirmBooking={handleConfirmBooking}
        lang={lang}
      />

      {/* Safety & SOS Modal */}
      <SafetyModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
        lang={lang}
      />

      {/* Supabase Guide Modal */}
      <SupabaseGuideModal
        isOpen={isSupabaseGuideOpen}
        onClose={() => setIsSupabaseGuideOpen(false)}
        onConfigSaved={fetchSupabaseData}
      />
    </div>
  );
}

export default App;

