import React, { useState } from 'react';
import { SharedRoute, Booking, UserProfile, Language } from '../lib/types';
import { translations } from '../lib/translations';
import { RideCard } from './RideCard';
import { LiveRouteMap } from './LiveRouteMap';
import { POPULAR_LOCATIONS } from '../lib/mockData';
import { Search, MapPin, Ticket, ArrowRightLeft, Sparkles, Phone, Radio, Zap, Car, Package, Share2, Navigation, CheckCircle2 } from 'lucide-react';
import { InstallPwaButton } from './InstallPwaButton';

interface TravellerViewProps {
  routes: SharedRoute[];
  bookings: Booking[];
  currentUser: UserProfile | null;
  onBookRide: (route: SharedRoute) => void;
  onCancelBooking: (bookingId: string) => void;
  onOpenAuth: () => void;
  lang: Language;
}

export const TravellerView: React.FC<TravellerViewProps> = ({
  routes,
  bookings,
  currentUser,
  onBookRide,
  onCancelBooking,
  lang,
}) => {
  const t = translations[lang];
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'rides' | 'map' | 'my-bookings'>('rides');
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [selectedMapRoute, setSelectedMapRoute] = useState<SharedRoute | null>(null);

  // Filter routes
  const filteredRoutes = routes.filter((route) => {
    const matchesPickup = !pickup.trim() || 
      route.origin.toLowerCase().includes(pickup.toLowerCase()) ||
      route.intermediate_stops.some(s => s.toLowerCase().includes(pickup.toLowerCase()));
      
    const matchesDrop = !drop.trim() || 
      route.destination.toLowerCase().includes(drop.toLowerCase()) ||
      route.intermediate_stops.some(s => s.toLowerCase().includes(drop.toLowerCase()));

    const matchesVehicle = selectedVehicleType === 'all' || 
      (selectedVehicleType === 'erickshaw' && (route.is_electric || route.vehicle_type.includes('E-Rickshaw'))) ||
      (selectedVehicleType === 'cng' && route.vehicle_type.includes('CNG')) ||
      (selectedVehicleType === 'full' && route.vehicle_type.includes('Full Auto')) ||
      (selectedVehicleType === 'cargo' && (route.vehicle_type.includes('Cargo') || route.vehicle_type.includes('Parcel')));

    const matchesPrice = priceFilter === null || route.price_per_seat <= priceFilter;

    return matchesPickup && matchesDrop && matchesVehicle && matchesPrice;
  });

  const swapLocations = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  const userBookings = bookings.filter(b => !currentUser || b.traveller_id === currentUser.id || b.traveller_id.startsWith('guest'));

  const handleShareWhatsApp = (b: Booking) => {
    const text = encodeURIComponent(
      `🛺 *NextRide Trip Pass*\n` +
      `Booking ID: ${b.id}\n` +
      `Start OTP: ${b.otp}\n` +
      `From: ${b.pickup_point}\n` +
      `To: ${b.drop_point}\n` +
      `Auto: ${b.route?.vehicle_model || 'NextRide Auto'}\n` +
      `Fare: ₹${b.total_fare}\n\n` +
      `Track: https://nextride.vercel.app`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      
      {/* PWA Mobile Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <InstallPwaButton variant="banner" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-blue-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl p-6 sm:p-10 lg:p-12 border border-brand-500/30">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-200 text-xs font-extrabold mb-4">
            <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>{t.ruralMobility}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {t.heroTitle}
          </h1>

          <p className="mt-3 text-xs sm:text-base text-blue-100/90 leading-relaxed font-medium">
            {t.heroSubtitle}
          </p>

          {/* Search Box */}
          <div className="mt-6 sm:mt-8 bg-white p-3.5 sm:p-4 rounded-3xl shadow-2xl text-slate-900 border border-slate-100">
            
            {/* Pickup & Drop Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 items-center">
              
              {/* Pickup */}
              <div className="md:col-span-5 relative">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 ml-3 mb-1">
                  {t.pickupLabel}
                </label>
                <div className="flex items-center bg-slate-50 rounded-2xl px-3 py-2.5 border border-slate-200 focus-within:border-brand-600 focus-within:bg-white transition-all">
                  <div className="w-3 h-3 rounded-full bg-brand-600 ring-4 ring-brand-100 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder={t.pickupPlaceholder}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold focus:outline-none placeholder:text-slate-400"
                    list="popular-locations-pickup"
                  />
                  <datalist id="popular-locations-pickup">
                    {POPULAR_LOCATIONS.map((loc, i) => (
                      <option key={i} value={loc} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Swap Button */}
              <div className="hidden md:flex md:col-span-1 justify-center">
                <button
                  onClick={swapLocations}
                  className="p-2.5 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-500 rounded-full transition-colors border border-slate-200 active:rotate-180 duration-200"
                  title="Swap locations"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Drop */}
              <div className="md:col-span-5 relative">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 ml-3 mb-1">
                  {t.dropLabel}
                </label>
                <div className="flex items-center bg-slate-50 rounded-2xl px-3 py-2.5 border border-slate-200 focus-within:border-brand-600 focus-within:bg-white transition-all">
                  <div className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    placeholder={t.dropPlaceholder}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold focus:outline-none placeholder:text-slate-400"
                    list="popular-locations-drop"
                  />
                  <datalist id="popular-locations-drop">
                    {POPULAR_LOCATIONS.map((loc, i) => (
                      <option key={i} value={loc} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Search Icon / Action */}
              <div className="md:col-span-1 flex md:items-end">
                <button
                  onClick={() => {}}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black flex items-center justify-center shadow-lg shadow-brand-500/25 transition-all"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Hub Pills */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs text-slate-600 scrollbar-none">
              <span className="text-[10px] uppercase font-extrabold text-slate-400 shrink-0">{t.popularStops}</span>
              {['Rampur Chowk', 'Krishi Mandi', 'Railway Jn', 'Tehsil', 'Civil Hospital', 'Sabzi Mandi'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (!pickup) setPickup(tag);
                    else setDrop(tag);
                  }}
                  className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-brand-700 rounded-xl text-[11px] font-bold transition-all shrink-0 border border-slate-200/60"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs (Rides vs Live Map vs My Bookings) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('rides')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === 'rides'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{t.availableRides} ({filteredRoutes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === 'map'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>{t.liveMap}</span>
            </button>

            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all relative ${
                activeTab === 'my-bookings'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>{t.myBookings}</span>
              {userBookings.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-black">
                  {userBookings.length}
                </span>
              )}
            </button>
          </div>

          {(pickup || drop || selectedVehicleType !== 'all' || priceFilter !== null) && (
            <button
              onClick={() => {
                setPickup('');
                setDrop('');
                setSelectedVehicleType('all');
                setPriceFilter(null);
              }}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Tab 1: Available Rides Grid */}
        {activeTab === 'rides' && (
          <div className="mt-6 space-y-6">
            
            {/* Auto Specialized Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedVehicleType('all')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all border ${
                  selectedVehicleType === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t.allVehicles}
              </button>

              <button
                onClick={() => setSelectedVehicleType('erickshaw')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all border flex items-center gap-1.5 ${
                  selectedVehicleType === 'erickshaw'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>{t.eRickshaw}</span>
              </button>

              <button
                onClick={() => setSelectedVehicleType('cng')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all border flex items-center gap-1.5 ${
                  selectedVehicleType === 'cng'
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/25'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>{t.cngAuto}</span>
              </button>

              <button
                onClick={() => setSelectedVehicleType('full')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all border flex items-center gap-1.5 ${
                  selectedVehicleType === 'full'
                    ? 'bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-700/25'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{t.fullAuto}</span>
              </button>

              <button
                onClick={() => setSelectedVehicleType('cargo')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all border flex items-center gap-1.5 ${
                  selectedVehicleType === 'cargo'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>{t.parcelAuto}</span>
              </button>

              <button
                onClick={() => setPriceFilter(priceFilter === 20 ? null : 20)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all border ${
                  priceFilter === 20
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {t.under20}
              </button>
            </div>

            {/* Routes Cards Grid */}
            {filteredRoutes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoutes.map((route) => (
                  <RideCard
                    key={route.id}
                    route={route}
                    onBook={onBookRide}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-blue-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{t.noRidesFound}</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  {t.noRidesDesc}
                </p>
                <button
                  onClick={() => {
                    setPickup('');
                    setDrop('');
                    setSelectedVehicleType('all');
                    setPriceFilter(null);
                  }}
                  className="mt-4 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-md"
                >
                  Show All Available Autos
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Live Radar Map View */}
        {activeTab === 'map' && (
          <div className="mt-6">
            <LiveRouteMap
              routes={filteredRoutes}
              selectedRoute={selectedMapRoute}
              onSelectRoute={(r) => setSelectedMapRoute(r)}
              onBookRoute={onBookRide}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 3: My Bookings & Boarding Passes with OTP */}
        {activeTab === 'my-bookings' && (
          <div className="mt-6 space-y-4">
            {userBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-card-soft flex flex-col justify-between"
                  >
                    <div>
                      {/* Ticket Header & 4-Digit OTP */}
                      <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-2">
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Booking ID</span>
                          <p className="font-mono text-sm font-black text-brand-600">{b.id}</p>
                        </div>

                        {/* OTP Box */}
                        <div className="bg-amber-50 border border-amber-300 px-3 py-1 rounded-xl text-right">
                          <span className="text-[9px] font-extrabold uppercase text-amber-800 block">Start Ride OTP</span>
                          <span className="font-mono font-black text-base text-amber-900 tracking-wider">
                            {b.otp || '4891'}
                          </span>
                        </div>
                      </div>

                      {/* Route Details */}
                      <div className="py-3.5 space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                          <p className="font-bold text-slate-800 truncate">From: {b.pickup_point}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <p className="font-bold text-slate-800 truncate">To: {b.drop_point}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1.5 text-slate-500 border-t border-slate-100">
                          <span>Auto: <strong className="text-slate-800">{b.route?.vehicle_model || 'NextRide Shared Auto'}</strong></span>
                          <span>Fare: <strong className="text-slate-900 font-black text-sm">₹{b.total_fare}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {b.route?.driver_phone && (
                          <a
                            href={`tel:${b.route.driver_phone}`}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call Driver
                          </a>
                        )}

                        <button
                          onClick={() => handleShareWhatsApp(b)}
                          className="p-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-xl"
                          title="Share on WhatsApp"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
                      >
                        {t.cancelRide}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Ticket className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No active bookings yet</h3>
                <p className="text-xs text-slate-500 mt-1">Book your seat on any E-Rickshaw or Auto to view your boarding OTP pass here.</p>
                <button
                  onClick={() => setActiveTab('rides')}
                  className="mt-4 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-md"
                >
                  Explore Autos
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
