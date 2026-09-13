import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, SharedRoute, Booking, Language } from './lib/types';
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

const STORAGE_ROUTES_KEY = 'nextride_routes_v3';
const STORAGE_BOOKINGS_KEY = 'nextride_bookings_v3';
const STORAGE_USER_KEY = 'nextride_user_v3';
const STORAGE_LANG_KEY = 'nextride_lang_v3';

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

  // Shared Routes state (Real published routes only)
  const [routes, setRoutes] = useState<SharedRoute[]>(() => {
    const saved = localStorage.getItem(STORAGE_ROUTES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_BOOKINGS_KEY);
    return saved ? JSON.parse(saved) : [];
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

  // Load from Supabase with live multi-device synchronization
  const fetchSupabaseData = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      // Fetch all published routes from Supabase database
      const { data: routesData, error: routesError } = await supabase
        .from('routes')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!routesError && routesData) {
        const dbRoutes: SharedRoute[] = routesData.map((r: any) => {
          let parsedMeta: any = {};
          if (r.notes) {
            try {
              parsedMeta = JSON.parse(r.notes);
            } catch {
              parsedMeta = { original_notes: r.notes };
            }
          }

          return {
            id: r.id,
            driver_id: r.driver_id || 'drv-partner',
            driver_name: parsedMeta.driver_name || r.driver_name || 'Verified Driver Partner',
            driver_phone: parsedMeta.driver_phone || r.driver_phone || '',
            driver_rating: Number(parsedMeta.driver_rating || r.driver_rating || 4.95),
            driver_avatar: parsedMeta.driver_avatar || r.driver_avatar,
            vehicle_type: parsedMeta.vehicle_type || r.vehicle_type || 'E-Rickshaw Shared (Toto / Electric)',
            vehicle_model: parsedMeta.vehicle_model || r.vehicle_model || 'Mahindra Treo Electric',
            plate_number: parsedMeta.plate_number || r.plate_number || 'UP-25-ER-0000',
            origin: r.origin_name || r.origin || '',
            destination: r.destination_name || r.destination || '',
            intermediate_stops: Array.isArray(r.intermediate_stops) ? r.intermediate_stops : [],
            departure_time: r.departure_time || 'Continuous Electric Shuttle',
            frequency: r.frequency || 'Continuous Electric Shuttle',
            price_per_seat: Number(r.price_per_seat || 15),
            full_vehicle_price: Number(parsedMeta.full_vehicle_price || r.full_vehicle_price || (r.price_per_seat ? r.price_per_seat * 4 : 60)),
            available_seats: Number(r.available_seats !== undefined ? r.available_seats : 4),
            total_seats: Number(r.total_seats || 4),
            luggage_space: r.luggage_space || 'Handbags & sacks allowed',
            is_electric: parsedMeta.is_electric !== undefined ? parsedMeta.is_electric : (r.is_electric !== false),
            has_carrier: true,
            eta_mins: 3,
            status: 'active',
            notes: parsedMeta.original_notes || (typeof r.notes === 'string' && !r.notes.startsWith('{') ? r.notes : ''),
            created_at: r.created_at,
          };
        });

        // Show live database routes
        setRoutes(dbRoutes);
      }

      // Fetch live bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsData) {
        setBookings(bookingsData);
      }
    } catch (err) {
      console.log('Supabase sync:', err);
    }
  };

  // Real-time synchronization & 4-second auto-poll for cross-device updates
  useEffect(() => {
    fetchSupabaseData();

    const supabase = getSupabaseClient();
    if (supabase) {
      const channel = supabase
        .channel('public:transit_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'routes' }, () => {
          fetchSupabaseData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
          fetchSupabaseData();
        })
        .subscribe();

      const pollTimer = setInterval(() => {
        fetchSupabaseData();
      }, 4000);

      return () => {
        supabase.removeChannel(channel);
        clearInterval(pollTimer);
      };
    }
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
    // Generate valid UUID for booking if not valid
    const bookingUuid = (newBooking.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newBooking.id))
      ? newBooking.id
      : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0'));

    const bookingWithUuid = { ...newBooking, id: bookingUuid };
    setBookings((prev) => [bookingWithUuid, ...prev]);

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
        let travellerUuid = newBooking.traveller_id;
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(travellerUuid)) {
          travellerUuid = (currentUser?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUser.id))
            ? currentUser.id
            : '00000000-0000-4000-8000-000000000002';
        }

        await supabase.from('bookings').insert({
          id: bookingUuid,
          route_id: newBooking.route_id,
          traveller_id: travellerUuid,
          passenger_name: newBooking.passenger_name || 'Passenger',
          passenger_phone: newBooking.passenger_phone || '+91 98000 00000',
          pickup_point: newBooking.pickup_point,
          drop_point: newBooking.drop_point,
          seats_booked: newBooking.seats_booked || 1,
          total_fare: newBooking.total_fare,
          status: 'confirmed',
          payment_status: newBooking.payment_status || 'cash_on_ride',
        });
        fetchSupabaseData();
      } catch (e) {
        console.error('Supabase booking save:', e);
      }
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
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

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('bookings').delete().eq('id', bookingId);
      } catch (e) {
        console.log('Cancel sync error:', e);
      }
    }
  };

  const handleAddRoute = async (newRoute: SharedRoute) => {
    // Generate valid UUID for route
    const routeId = (newRoute.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newRoute.id))
      ? newRoute.id
      : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0'));

    const routeWithValidId: SharedRoute = { ...newRoute, id: routeId };

    // 1. Immediately add to local state
    setRoutes((prev) => [routeWithValidId, ...prev.filter(r => r.id !== routeId)]);

    // 2. Write to Supabase database with schema-compatible payload
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let driverUuid = newRoute.driver_id;
        if (!driverUuid || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(driverUuid)) {
          driverUuid = (currentUser?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUser.id))
            ? currentUser.id
            : '00000000-0000-4000-8000-000000000001';
        }

        const metadata = {
          driver_name: newRoute.driver_name || currentUser?.full_name || 'Driver Partner',
          driver_phone: newRoute.driver_phone || currentUser?.phone || '',
          driver_rating: newRoute.driver_rating || currentUser?.rating || 4.95,
          driver_avatar: newRoute.driver_avatar,
          vehicle_type: newRoute.vehicle_type || 'E-Rickshaw Shared (Toto / Electric)',
          vehicle_model: newRoute.vehicle_model || 'Mahindra Treo Electric',
          plate_number: newRoute.plate_number || 'UP-25-ER-0000',
          full_vehicle_price: newRoute.full_vehicle_price || (newRoute.price_per_seat ? newRoute.price_per_seat * 4 : 60),
          is_electric: newRoute.is_electric !== false,
          original_notes: newRoute.notes || '',
        };

        const { data, error } = await supabase.from('routes').insert({
          id: routeId,
          driver_id: driverUuid,
          origin_name: newRoute.origin,
          destination_name: newRoute.destination,
          intermediate_stops: newRoute.intermediate_stops || [],
          departure_time: newRoute.departure_time || 'Continuous Electric Shuttle',
          frequency: newRoute.frequency || 'Continuous Electric Shuttle',
          price_per_seat: newRoute.price_per_seat || 15,
          available_seats: newRoute.available_seats || 4,
          total_seats: newRoute.total_seats || 4,
          luggage_space: newRoute.luggage_space || 'Handbags & sacks allowed',
          status: 'active',
          notes: JSON.stringify(metadata),
        }).select();

        if (error) {
          console.error('Supabase route insert notice:', error);
        } else {
          console.log('Supabase route published successfully:', data);
          fetchSupabaseData();
        }
      } catch (e) {
        console.error('Supabase route post exception:', e);
      }
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    setRoutes((prev) => prev.filter((r) => r.id !== routeId));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('routes').delete().eq('id', routeId);
      } catch (e) {
        console.log('Delete route error:', e);
      }
    }
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

      {/* Mobile Bottom Navigation Bar (Strictly Role-Specific) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-2xl flex items-center justify-around">
        {activeRole === 'driver' ? (
          <>
            <button
              onClick={() => {
                setActiveRole('driver');
              }}
              className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-brand-600 font-black"
            >
              <Car className="w-5 h-5" />
              <span className="text-[10px]">{t.driverPortal.split(' ')[0]}</span>
            </button>

            <button
              onClick={() => {
                setIsSettingsOpen(true);
              }}
              className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-slate-600 hover:text-slate-900 font-bold"
            >
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <span className="text-[10px]">Settings</span>
            </button>

            <button
              onClick={() => setIsSafetyOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-slate-700 font-bold"
            >
              <ShieldCheck className="w-5 h-5 text-slate-600" />
              <span className="text-[10px]">Safety</span>
            </button>
          </>
        ) : activeRole === 'admin' ? (
          <>
            <button
              onClick={() => {
                setActiveRole('admin');
              }}
              className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-amber-600 font-black"
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px]">Admin HQ</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-slate-600 hover:text-slate-900 font-bold"
            >
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <span className="text-[10px]">Settings</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setActiveRole('traveller');
                setActiveTab('explore');
              }}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
                activeTab === 'explore'
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
                activeTab === 'live-map'
                  ? 'text-brand-600 font-black'
                  : 'text-slate-500 font-medium'
              }`}
            >
              <Radio className="w-5 h-5" />
              <span className="text-[10px]">Radar</span>
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
              className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-slate-700 font-bold"
            >
              <ShieldCheck className="w-5 h-5 text-slate-600" />
              <span className="text-[10px]">Safety</span>
            </button>
          </>
        )}
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

