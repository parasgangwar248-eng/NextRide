import React, { useState } from 'react';
import { SharedRoute, Booking, UserProfile, VehicleCategory } from '../lib/types';
import { RideCard } from './RideCard';
import { POPULAR_LOCATIONS } from '../lib/mockData';
import { Search, MapPin, Calendar, Users, Filter, Ticket, Compass, ArrowRightLeft, Sparkles, AlertCircle, Phone, XCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { InstallPwaButton } from './InstallPwaButton';

interface TravellerViewProps {
  routes: SharedRoute[];
  bookings: Booking[];
  currentUser: UserProfile | null;
  onBookRide: (route: SharedRoute) => void;
  onCancelBooking: (bookingId: string) => void;
  onOpenAuth: () => void;
}

export const TravellerView: React.FC<TravellerViewProps> = ({
  routes,
  bookings,
  currentUser,
  onBookRide,
  onCancelBooking,
  onOpenAuth,
}) => {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'search' | 'my-bookings'>('search');
  const [priceFilter, setPriceFilter] = useState<number | null>(null);

  // Filter routes based on search criteria
  const filteredRoutes = routes.filter((route) => {
    const matchesPickup = !pickup.trim() || 
      route.origin.toLowerCase().includes(pickup.toLowerCase()) ||
      route.intermediate_stops.some(s => s.toLowerCase().includes(pickup.toLowerCase()));
      
    const matchesDrop = !drop.trim() || 
      route.destination.toLowerCase().includes(drop.toLowerCase()) ||
      route.intermediate_stops.some(s => s.toLowerCase().includes(drop.toLowerCase()));

    const matchesVehicle = selectedVehicleType === 'all' || route.vehicle_type === selectedVehicleType;
    const matchesPrice = priceFilter === null || route.price_per_seat <= priceFilter;

    return matchesPickup && matchesDrop && matchesVehicle && matchesPrice;
  });

  const swapLocations = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  const userBookings = bookings.filter(b => !currentUser || b.traveller_id === currentUser.id || b.traveller_id.startsWith('guest'));

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      
      {/* PWA Mobile Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <InstallPwaButton variant="banner" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-blue-800 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl p-6 sm:p-10 lg:p-12 border border-brand-500/30">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Rural Shared Mobility for Villages & Towns</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Your Next Ride, <br className="hidden sm:inline" />
            <span className="text-cyan-300">On Time, Every Time.</span>
          </h1>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-blue-100/90 leading-relaxed">
            Find shared Jeeps, Tata Magic, Auto-rickshaws, and Rural Express Shuttles connecting your village to Mandis, Tehsil hubs, and Railway stations.
          </p>

          {/* Search Box */}
          <div className="mt-6 sm:mt-8 bg-white p-3 sm:p-4 rounded-3xl shadow-2xl text-slate-900 border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 items-center">
              
              {/* Pickup Input */}
              <div className="md:col-span-5 relative">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 ml-3 mb-1">
                  Pickup Village / Point
                </label>
                <div className="flex items-center bg-slate-50 rounded-2xl px-3 py-2.5 border border-slate-200 focus-within:border-brand-600 focus-within:bg-white transition-all">
                  <div className="w-3 h-3 rounded-full bg-brand-600 ring-4 ring-brand-100 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="e.g. Rampur Village Chowk"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400"
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
                  className="p-2.5 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-500 rounded-full transition-colors border border-slate-200"
                  title="Swap locations"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Drop Input */}
              <div className="md:col-span-5 relative">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 ml-3 mb-1">
                  Drop Destination / Mandi / Tehsil
                </label>
                <div className="flex items-center bg-slate-50 rounded-2xl px-3 py-2.5 border border-slate-200 focus-within:border-brand-600 focus-within:bg-white transition-all">
                  <div className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    placeholder="e.g. District Main Mandi & Hospital"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                    list="popular-locations-drop"
                  />
                  <datalist id="popular-locations-drop">
                    {POPULAR_LOCATIONS.map((loc, i) => (
                      <option key={i} value={loc} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Action Button */}
              <div className="md:col-span-1 flex md:items-end">
                <button
                  onClick={() => {}}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-brand-500/25 transition-all"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Location Pills */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs text-slate-600 scrollbar-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Popular:</span>
              {['Rampur', 'Fatehgarh', 'Mandi', 'Tehsil', 'Hospital', 'Railway'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (!pickup) setPickup(tag);
                    else setDrop(tag);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-brand-700 rounded-lg text-[11px] font-semibold transition-all shrink-0 border border-slate-200/60"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === 'search'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Available Shared Rides ({filteredRoutes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all relative ${
                activeTab === 'my-bookings'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>My Booked Rides</span>
              {userBookings.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
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
              Reset Filters
            </button>
          )}
        </div>

        {/* Tab 1: Search & Filter Rides */}
        {activeTab === 'search' && (
          <div className="mt-6 space-y-6">
            
            {/* Vehicle Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedVehicleType('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                  selectedVehicleType === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Vehicles
              </button>

              {[
                { id: 'Jeep / Cruiser', label: 'Jeeps & Bolero' },
                { id: 'Tata Magic / Mini-Van', label: 'Tata Magic & Vans' },
                { id: 'Auto / E-Rickshaw', label: 'Auto & E-Rickshaw' },
                { id: 'Rural Express Bus', label: 'Express Buses' },
                { id: 'Private Car / Shared Taxi', label: 'Shared Taxi / Car' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleType(v.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                    selectedVehicleType === v.id
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/25'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {v.label}
                </button>
              ))}

              {/* Under ₹50 Filter */}
              <button
                onClick={() => setPriceFilter(priceFilter === 50 ? null : 50)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                  priceFilter === 50
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                Under ₹50
              </button>
            </div>

            {/* Routes Grid */}
            {filteredRoutes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoutes.map((route) => (
                  <RideCard
                    key={route.id}
                    route={route}
                    onBook={onBookRide}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-blue-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No matching rides found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Try adjusting your pickup or destination, or clear vehicle category filters to see all available shared mobility routes.
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
                  Show All Available Rides
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Booked Rides */}
        {activeTab === 'my-bookings' && (
          <div className="mt-6 space-y-4">
            {userBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket ID</span>
                          <p className="font-mono text-sm font-bold text-brand-600">{b.id}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {b.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="py-3 space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                          <p className="font-semibold text-slate-800 truncate">From: {b.pickup_point}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <p className="font-semibold text-slate-800 truncate">To: {b.drop_point}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
                          <span>Seats: <strong className="text-slate-800">{b.seats_booked}</strong></span>
                          <span>Total Fare: <strong className="text-slate-900 font-bold">₹{b.total_fare}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {b.route?.driver_phone && (
                        <a
                          href={`tel:${b.route.driver_phone}`}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-200"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call Driver
                        </a>
                      )}
                      
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
                      >
                        Cancel Ride
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
                <p className="text-xs text-slate-500 mt-1">Book your seat in any rural shared vehicle to view your digital ticket here.</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="mt-4 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-md"
                >
                  Explore Rides
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
