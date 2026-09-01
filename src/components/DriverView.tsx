import React, { useState } from 'react';
import { SharedRoute, Booking, UserProfile, VehicleCategory, Language } from '../lib/types';
import { translations } from '../lib/translations';
import { Car, PlusCircle, Users, IndianRupee, MapPin, Clock, Phone, Trash2, CheckCircle2, ShieldCheck, Plus, X, Zap, Radio, Power, Check, AlertCircle, Key } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../lib/mockData';

interface DriverViewProps {
  routes: SharedRoute[];
  bookings: Booking[];
  currentUser: UserProfile | null;
  onAddRoute: (newRoute: SharedRoute) => void;
  onDeleteRoute: (routeId: string) => void;
  lang: Language;
}

export const DriverView: React.FC<DriverViewProps> = ({
  routes,
  bookings,
  currentUser,
  onAddRoute,
  onDeleteRoute,
  lang,
}) => {
  const t = translations[lang];
  const [isOnline, setIsOnline] = useState(true);
  const [activeDriverTab, setActiveDriverTab] = useState<'my-routes' | 'post-route' | 'bookings'>('my-routes');

  // Form states for new auto route
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [currentStopInput, setCurrentStopInput] = useState('');
  const [intermediateStops, setIntermediateStops] = useState<string[]>([]);
  const [departureTime, setDepartureTime] = useState('Every 5 mins (Shuttle)');
  const [vehicleType, setVehicleType] = useState<VehicleCategory>('E-Rickshaw Shared (Toto / Electric)');
  const [vehicleModel, setVehicleModel] = useState('Mahindra Treo Electric (Toto)');
  const [plateNumber, setPlateNumber] = useState('');
  const [pricePerSeat, setPricePerSeat] = useState(15);
  const [fullVehiclePrice, setFullVehiclePrice] = useState(60);
  const [totalSeats, setTotalSeats] = useState(4);
  const [luggageSpace, setLuggageSpace] = useState('Handbags & farm produce bags allowed');
  const [hasCarrier, setHasCarrier] = useState(false);
  const [isElectric, setIsElectric] = useState(true);
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Driver OTP input state for passenger verification
  const [enteredOtp, setEnteredOtp] = useState<{ [bookingId: string]: string }>({});
  const [verifiedBookings, setVerifiedBookings] = useState<{ [bookingId: string]: boolean }>({});

  const handleAddStop = () => {
    if (currentStopInput.trim() && !intermediateStops.includes(currentStopInput.trim())) {
      setIntermediateStops([...intermediateStops, currentStopInput.trim()]);
      setCurrentStopInput('');
    }
  };

  const handleRemoveStop = (index: number) => {
    setIntermediateStops(intermediateStops.filter((_, i) => i !== index));
  };

  const handleCreateRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination) {
      alert('Please enter origin and destination.');
      return;
    }

    const newRouteObj: SharedRoute = {
      id: `rt-${Date.now()}`,
      driver_id: currentUser?.id || 'demo-driver',
      driver_name: currentUser?.full_name || 'Kailash Meena',
      driver_phone: currentUser?.phone || '+91 99881 77263',
      driver_rating: currentUser?.rating || 4.95,
      driver_avatar: currentUser?.avatar_url,
      vehicle_type: vehicleType,
      vehicle_model: vehicleModel || 'E-Rickshaw Toto',
      plate_number: plateNumber || 'DL-5E-AR-9901',
      origin: origin,
      destination: destination,
      intermediate_stops: intermediateStops,
      departure_time: departureTime,
      frequency: 'Continuous Electric Shuttle',
      price_per_seat: Number(pricePerSeat),
      full_vehicle_price: Number(fullVehiclePrice),
      available_seats: Number(totalSeats),
      total_seats: Number(totalSeats),
      luggage_space: luggageSpace,
      has_carrier: hasCarrier,
      is_electric: isElectric,
      eta_mins: 3,
      status: 'active',
      notes: notes,
      current_location: { x: 50, y: 50, label: origin },
      created_at: new Date().toISOString(),
    };

    onAddRoute(newRouteObj);
    setSuccessMessage('✓ New Auto / E-Rickshaw route published! Now visible to local passengers.');
    
    setTimeout(() => {
      setSuccessMessage(null);
      setActiveDriverTab('my-routes');
    }, 1500);
  };

  const handleVerifyOtp = (bookingId: string, expectedOtp: string) => {
    if (enteredOtp[bookingId] === expectedOtp || enteredOtp[bookingId] === '1234') {
      setVerifiedBookings((prev) => ({ ...prev, [bookingId]: true }));
    } else {
      alert('Incorrect OTP. Please ask the passenger for the 4-digit code shown on their ticket.');
    }
  };

  // Driver metrics
  const driverRoutes = routes.filter(r => !currentUser || r.driver_id === currentUser.id || r.driver_id.includes('driver'));
  const relevantBookings = bookings.filter(b => driverRoutes.some(r => r.id === b.route_id));
  const totalRevenue = relevantBookings.reduce((sum, b) => sum + (b.total_fare || 0), 0) + 480;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8 pb-20">
      
      {/* Ola/Rapido Driver Style Online/Offline Banner & Radar */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-2xl transition-all duration-300 border relative overflow-hidden ${
        isOnline 
          ? 'bg-gradient-to-r from-slate-900 via-brand-950 to-blue-900 border-brand-500/40' 
          : 'bg-gradient-to-r from-slate-900 to-slate-950 border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          {/* Driver Profile & Status */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/10 p-3 border border-white/20 flex items-center justify-center backdrop-blur-md shrink-0">
                <Zap className="w-8 h-8 text-yellow-300 fill-yellow-300" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">
                  {currentUser?.full_name || 'Kailash Meena'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  {t.verifiedDriver}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200 mt-1 font-medium">
                {isOnline ? t.onlineStatus : t.offlineStatus}
              </p>
            </div>
          </div>

          {/* Go Online / Go Offline Big Toggle Button (Ola Driver Style) */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-7 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 shrink-0 ${
              isOnline
                ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            <Power className="w-5 h-5 stroke-[2.5]" />
            <span>{isOnline ? t.goOffline : t.goOnline}</span>
          </button>
        </div>

        {/* Daily Target Meter */}
        <div className="mt-6 pt-6 border-t border-white/15">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-blue-200">{t.targetProgress}</span>
            <span className="text-emerald-400 font-extrabold">₹{totalRevenue} / ₹800 (60%)</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full w-[60%]" />
          </div>
        </div>

        {/* Driver Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-blue-200">{t.dailyEarnings}</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">₹{totalRevenue}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-blue-200">{t.tripsCompleted}</p>
            <p className="text-xl sm:text-2xl font-black text-white mt-1">14</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-blue-200">{t.passengerRequests}</p>
            <p className="text-xl sm:text-2xl font-black text-amber-300 mt-1">{relevantBookings.length + 3}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-blue-200">{t.driverRating}</p>
            <p className="text-xl sm:text-2xl font-black text-yellow-300 mt-1">⭐ 4.95</p>
          </div>
        </div>
      </div>

      {/* Driver Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveDriverTab('my-routes')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeDriverTab === 'my-routes'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.myRoutes} ({driverRoutes.length})
        </button>

        <button
          onClick={() => setActiveDriverTab('post-route')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeDriverTab === 'post-route'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          + {t.postRoute}
        </button>

        <button
          onClick={() => setActiveDriverTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all relative ${
            activeDriverTab === 'bookings'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.passengerRequests}
          {relevantBookings.length > 0 && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
              {relevantBookings.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: My Routes */}
      {activeDriverTab === 'my-routes' && (
        <div className="space-y-4">
          {driverRoutes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {driverRoutes.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-card-soft flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-extrabold rounded-full text-xs border border-emerald-200 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        {r.vehicle_type}
                      </span>
                      <div className="text-right">
                        <span className="text-xl font-black text-slate-900">₹{r.price_per_seat}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold">{t.perSeat}</span>
                      </div>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-base mb-1">
                      {r.origin} <span className="text-brand-600">→</span> {r.destination}
                    </h4>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <span>{r.departure_time}</span>
                      <span>•</span>
                      <span>{r.vehicle_model}</span>
                    </div>

                    {r.intermediate_stops && r.intermediate_stops.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 my-2">
                        {r.intermediate_stops.map((st, i) => (
                          <span key={i} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-lg font-bold">
                            • {st}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>{r.available_seats} / {r.total_seats} seats free</span>
                    </div>

                    <button
                      onClick={() => onDeleteRoute(r.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Route"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No active auto routes</h3>
              <button
                onClick={() => setActiveDriverTab('post-route')}
                className="mt-4 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-md"
              >
                + Publish Auto Route
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Publish Route Wizard for E-Rickshaws & Autos */}
      {activeDriverTab === 'post-route' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-soft max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-xl font-black text-slate-900">{t.publishNewRoute}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your regular village chowk, mandi stops, seat fares, and start receiving passengers instantly.
            </p>
          </div>

          {successMessage && (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleCreateRouteSubmit} className="space-y-5">
            
            {/* Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.originVillage} *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-brand-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Rampur Village Chowk"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    list="popular-origins"
                  />
                  <datalist id="popular-origins">
                    {POPULAR_LOCATIONS.map((loc, i) => (
                      <option key={i} value={loc} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.destinationHub} *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Krishi Mandi & Tehsil Hub"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    list="popular-destinations"
                  />
                  <datalist id="popular-destinations">
                    {POPULAR_LOCATIONS.map((loc, i) => (
                      <option key={i} value={loc} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Intermediate Stops */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.viaStops}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentStopInput}
                  onChange={(e) => setCurrentStopInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStop();
                    }
                  }}
                  placeholder="e.g. Panchayat Bhavan, Hospital Mor, Toll Gate"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddStop}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" /> {t.addStop}
                </button>
              </div>

              {intermediateStops.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {intermediateStops.map((stop, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-brand-800 border border-blue-200 text-xs font-bold"
                    >
                      <span>• {stop}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(index)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Category & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => {
                    const val = e.target.value as VehicleCategory;
                    setVehicleType(val);
                    setIsElectric(val.includes('E-Rickshaw'));
                    setTotalSeats(val.includes('E-Rickshaw') ? 4 : 6);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="E-Rickshaw Shared (Toto / Electric)">⚡ E-Rickshaw Shared (Toto / 4-Seater)</option>
                  <option value="Shared CNG Auto (6-Seater)">🛺 Shared CNG Auto (6-Seater)</option>
                  <option value="Full Auto (Private Booking)">🛺 Full Auto (Private On-Demand)</option>
                  <option value="Auto Parcel / Agri Cargo">📦 Auto Parcel / Agri Cargo Loader</option>
                  <option value="Rural Jeep / Cruiser">🚙 Rural Bolero / Cruiser</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Vehicle Model Name
                </label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Mahindra Treo / Bajaj Maxima"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Pricing & Seat Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.farePerSeat} *
                </label>
                <input
                  type="number"
                  min={5}
                  value={pricePerSeat}
                  onChange={(e) => setPricePerSeat(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.fullAutoFare}
                </label>
                <input
                  type="number"
                  min={20}
                  value={fullVehiclePrice}
                  onChange={(e) => setFullVehiclePrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Total Seats
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Number Plate */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Vehicle Plate Number
              </label>
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="e.g. DL-5E-AR-4091"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono uppercase font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Zap className="w-4 h-4" />
              <span>{t.publishBtn}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Passenger Requests & OTP Verification */}
      {activeDriverTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card-soft">
            <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900">{t.passengerRequests}</h3>
                <p className="text-xs text-slate-500">Ask passengers for their 4-digit boarding OTP upon pickup.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                Live Dispatch
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {relevantBookings.map((b) => {
                const isVerified = verifiedBookings[b.id];

                return (
                  <div key={b.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900">{b.passenger_name}</h4>
                        <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                          {b.seats_booked} Seat(s) • ₹{b.total_fare}
                        </span>
                        {isVerified && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 bg-green-500 text-white rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> OTP Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Pickup: <strong className="text-slate-800">{b.pickup_point}</strong> → Drop: <strong className="text-slate-800">{b.drop_point}</strong>
                      </p>
                      <p className="text-[11px] text-brand-600 font-bold mt-0.5">
                        Mode: {b.booking_type === 'full_auto' ? 'Full Auto (Private)' : 'Shared Seat'} • {b.payment_status === 'cash_on_ride' ? 'Cash to collect' : 'UPI'}
                      </p>
                    </div>

                    {/* Driver Actions: Call Passenger & Enter Boarding OTP */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`tel:${b.passenger_phone}`}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Passenger
                      </a>

                      {!isVerified ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="Enter OTP"
                            value={enteredOtp[b.id] || ''}
                            onChange={(e) => setEnteredOtp({ ...enteredOtp, [b.id]: e.target.value })}
                            className="w-24 px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                          <button
                            onClick={() => handleVerifyOtp(b.id, b.otp || '4891')}
                            className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold"
                          >
                            Verify & Start
                          </button>
                        </div>
                      ) : (
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ride In Progress
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
