import React, { useState } from 'react';
import { SharedRoute, Booking, UserProfile, VehicleCategory } from '../lib/types';
import { Car, PlusCircle, Users, IndianRupee, MapPin, Clock, Phone, Trash2, CheckCircle2, ShieldCheck, AlertCircle, Plus, X, Package, Sparkles } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../lib/mockData';

interface DriverViewProps {
  routes: SharedRoute[];
  bookings: Booking[];
  currentUser: UserProfile | null;
  onAddRoute: (newRoute: SharedRoute) => void;
  onDeleteRoute: (routeId: string) => void;
  onOpenAuth: () => void;
}

export const DriverView: React.FC<DriverViewProps> = ({
  routes,
  bookings,
  currentUser,
  onAddRoute,
  onDeleteRoute,
  onOpenAuth,
}) => {
  const [activeDriverTab, setActiveDriverTab] = useState<'my-routes' | 'post-route' | 'bookings'>('my-routes');

  // Form states for new route creation
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [currentStopInput, setCurrentStopInput] = useState('');
  const [intermediateStops, setIntermediateStops] = useState<string[]>([]);
  const [departureTime, setDepartureTime] = useState('07:30 AM');
  const [vehicleType, setVehicleType] = useState<VehicleCategory>('Jeep / Cruiser');
  const [vehicleModel, setVehicleModel] = useState('Mahindra Bolero 9-Seater');
  const [plateNumber, setPlateNumber] = useState('');
  const [pricePerSeat, setPricePerSeat] = useState(40);
  const [totalSeats, setTotalSeats] = useState(6);
  const [luggageSpace, setLuggageSpace] = useState('Rooftop carrier + farm produce bags allowed');
  const [hasCarrier, setHasCarrier] = useState(true);
  const [isAc, setIsAc] = useState(false);
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      alert('Please provide pickup origin and destination.');
      return;
    }

    const newRouteObj: SharedRoute = {
      id: `rt-${Date.now()}`,
      driver_id: currentUser?.id || 'demo-driver',
      driver_name: currentUser?.full_name || 'Ramesh Patel',
      driver_phone: currentUser?.phone || '+91 98765 43210',
      driver_rating: currentUser?.rating || 4.9,
      driver_avatar: currentUser?.avatar_url,
      vehicle_type: vehicleType,
      vehicle_model: vehicleModel || 'Mahindra Bolero',
      plate_number: plateNumber || 'MP-04-AB-1234',
      origin: origin,
      destination: destination,
      intermediate_stops: intermediateStops,
      departure_time: departureTime,
      frequency: 'Daily Scheduled',
      price_per_seat: Number(pricePerSeat),
      available_seats: Number(totalSeats),
      total_seats: Number(totalSeats),
      luggage_space: luggageSpace,
      has_carrier: hasCarrier,
      is_ac: isAc,
      status: 'active',
      notes: notes,
      created_at: new Date().toISOString()
    };

    onAddRoute(newRouteObj);
    setSuccessMessage('✓ New rural route published successfully! Travellers can now book seats.');
    
    setTimeout(() => {
      setSuccessMessage(null);
      setActiveDriverTab('my-routes');
    }, 1500);
  };

  // Driver metrics
  const driverRoutes = routes.filter(r => !currentUser || r.driver_id === currentUser.id || r.driver_id === 'driver-1');
  const relevantBookings = bookings.filter(b => driverRoutes.some(r => r.id === b.route_id));
  const totalRevenue = relevantBookings.reduce((sum, b) => sum + (b.total_fare || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8 pb-16">
      
      {/* Driver Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-brand-700/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 p-3 border border-white/20 flex items-center justify-center backdrop-blur-md shrink-0">
              <Car className="w-8 h-8 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">Driver & Vehicle Dashboard</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Verified Partner
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200 mt-1">
                Publish your vehicle route, offer shared seats to local villagers, and earn daily fares on time.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveDriverTab('post-route')}
            className="px-5 py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a New Route</span>
          </button>
        </div>

        {/* Driver Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <p className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Active Routes</p>
            <p className="text-xl sm:text-2xl font-black text-white mt-1">{driverRoutes.length}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <p className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Passenger Bookings</p>
            <p className="text-xl sm:text-2xl font-black text-white mt-1">{relevantBookings.length}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <p className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Total Revenue</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">₹{totalRevenue || 480}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <p className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Driver Rating</p>
            <p className="text-xl sm:text-2xl font-black text-amber-300 mt-1">⭐ 4.9</p>
          </div>
        </div>
      </div>

      {/* Driver Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveDriverTab('my-routes')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            activeDriverTab === 'my-routes'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Published Routes ({driverRoutes.length})
        </button>

        <button
          onClick={() => setActiveDriverTab('post-route')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            activeDriverTab === 'post-route'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          + Post Route
        </button>

        <button
          onClick={() => setActiveDriverTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all relative ${
            activeDriverTab === 'bookings'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Passenger Requests
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
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="px-3 py-1 bg-brand-50 text-brand-700 font-bold rounded-full text-xs border border-brand-200">
                        {r.vehicle_type}
                      </span>
                      <div className="text-right">
                        <span className="text-xl font-black text-slate-900">₹{r.price_per_seat}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold">per passenger</span>
                      </div>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-base mb-1">
                      {r.origin} <span className="text-brand-600">→</span> {r.destination}
                    </h4>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <span>Departs: <strong>{r.departure_time}</strong></span>
                      <span>•</span>
                      <span>{r.vehicle_model} ({r.plate_number})</span>
                    </div>

                    {r.intermediate_stops && r.intermediate_stops.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 my-2">
                        {r.intermediate_stops.map((st, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-md font-semibold">
                            • {st}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Users className="w-4 h-4 text-brand-600" />
                      <span>{r.available_seats} / {r.total_seats} seats remaining</span>
                    </div>

                    <button
                      onClick={() => onDeleteRoute(r.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete / Cancel Route"
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
              <h3 className="text-base font-bold text-slate-900">No active routes posted yet</h3>
              <p className="text-xs text-slate-500 mt-1">Start sharing your daily village runs to connect travellers and earn fares.</p>
              <button
                onClick={() => setActiveDriverTab('post-route')}
                className="mt-4 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-md"
              >
                + Post Your First Route
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Post a New Route Wizard */}
      {activeDriverTab === 'post-route' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-soft max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-xl font-black text-slate-900">Publish a Shared Mobility Route</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify your starting village, drop hub, intermediate pickup points, and seat fares.
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
                  Origin Village / Chowk *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-brand-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Rampur Village Chowk"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                  Destination Town / Mandi / Tehsil *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. District Main Mandi & Hospital"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
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

            {/* Intermediate Stops Tag Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Intermediate Village Stops / Roadside Pickups
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
                  placeholder="e.g. Kisan Krishi Mandi, Toll Gate, Tehsil Mor"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddStop}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Stop
                </button>
              </div>

              {intermediateStops.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {intermediateStops.map((stop, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-brand-800 border border-blue-200 text-xs font-semibold"
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
                  Vehicle Category
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleCategory)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Jeep / Cruiser">Jeep / Cruiser (Bolero, Trax)</option>
                  <option value="Tata Magic / Mini-Van">Tata Magic / Van</option>
                  <option value="Auto / E-Rickshaw">Auto / E-Rickshaw</option>
                  <option value="Rural Express Bus">Rural Express Bus</option>
                  <option value="Private Car / Shared Taxi">Private Car / Shared Taxi</option>
                  <option value="Bike / Scooter">Bike / Scooter Pool</option>
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
                  placeholder="e.g. Mahindra Bolero Power Plus"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Timing, Seats & Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Departure Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    placeholder="07:30 AM"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Total Available Seats
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Fare Per Seat (₹)
                </label>
                <input
                  type="number"
                  min={5}
                  value={pricePerSeat}
                  onChange={(e) => setPricePerSeat(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Vehicle Number Plate & Luggage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Vehicle Plate Number
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="e.g. MP-04-AB-4921"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Luggage / Cargo Allowance
                </label>
                <input
                  type="text"
                  value={luggageSpace}
                  onChange={(e) => setLuggageSpace(e.target.value)}
                  placeholder="e.g. Farm sacks allowed on roof"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Checkbox Amenities */}
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCarrier}
                  onChange={(e) => setHasCarrier(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded"
                />
                <span>Has Rooftop Luggage Carrier</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAc}
                  onChange={(e) => setIsAc(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded"
                />
                <span>Air Conditioned (AC)</span>
              </label>
            </div>

            {/* Publish Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Route to NextRide Network</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Passenger Bookings */}
      {activeDriverTab === 'bookings' && (
        <div className="space-y-4">
          {relevantBookings.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
                <h3 className="font-extrabold text-base text-slate-900">Passenger Seat Bookings</h3>
                <p className="text-xs text-slate-500">Contact passengers to confirm their pickup time and landmark.</p>
              </div>

              <div className="divide-y divide-slate-100">
                {relevantBookings.map((b) => (
                  <div key={b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{b.passenger_name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                          {b.seats_booked} Seat(s)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Pickup: <strong className="text-slate-800">{b.pickup_point}</strong> → Drop: <strong className="text-slate-800">{b.drop_point}</strong>
                      </p>
                      <p className="text-[11px] text-brand-600 font-semibold mt-0.5">
                        Fare to Collect: ₹{b.total_fare} ({b.payment_status === 'cash_on_ride' ? 'Cash on Board' : 'UPI'})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${b.passenger_phone}`}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Passenger
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No passenger bookings yet</h3>
              <p className="text-xs text-slate-500 mt-1">When travellers book seats on your routes, their phone numbers and pickup points will appear here.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
