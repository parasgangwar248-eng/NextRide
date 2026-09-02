import React, { useState } from 'react';
import { UserProfile, SharedRoute, Booking, Language } from '../lib/types';
import { translations } from '../lib/translations';
import { 
  ShieldCheck, 
  Users, 
  Car, 
  Ticket, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Clock, 
  Phone, 
  MapPin, 
  DollarSign, 
  Download, 
  Filter, 
  Radio, 
  Zap, 
  LogOut, 
  AlertTriangle,
  FileCheck,
  ChevronRight
} from 'lucide-react';

interface DriverKYC {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleModel: string;
  plateNumber: string;
  village: string;
  status: 'verified' | 'pending' | 'rejected';
  appliedAt: string;
  avatar: string;
  tripsCompleted: number;
  rating: number;
}

const INITIAL_DRIVERS_KYC: DriverKYC[] = [
  {
    id: 'drv-1',
    name: 'Kailash Meena',
    phone: '+91 99881 77263',
    vehicleType: 'E-Rickshaw Shared (Toto)',
    vehicleModel: 'Mahindra Treo Electric',
    plateNumber: 'UP-25-ER-4412',
    village: 'Rampur Chowk',
    status: 'verified',
    appliedAt: '2026-08-28',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    tripsCompleted: 420,
    rating: 4.9,
  },
  {
    id: 'drv-2',
    name: 'Ramesh Patel',
    phone: '+91 98765 43210',
    vehicleType: 'Shared CNG Auto (6-Seater)',
    vehicleModel: 'Bajaj Maxima CNG 6-Seater',
    plateNumber: 'UP-25-AT-8821',
    village: 'Fatehgarh Stand',
    status: 'verified',
    appliedAt: '2026-08-29',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    tripsCompleted: 310,
    rating: 4.8,
  },
  {
    id: 'drv-3',
    name: 'Suresh Yadav',
    phone: '+91 94120 55431',
    vehicleType: 'E-Rickshaw Shared (Toto)',
    vehicleModel: 'Yatri Super E-Toto',
    plateNumber: 'UP-25-ER-9011',
    village: 'Krishi Mandi Hub',
    status: 'pending',
    appliedAt: '2026-09-02',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    tripsCompleted: 12,
    rating: 5.0,
  },
  {
    id: 'drv-4',
    name: 'Mohd. Imran',
    phone: '+91 98371 99281',
    vehicleType: 'Shared CNG Auto (6-Seater)',
    vehicleModel: 'Piaggio Ape City CNG',
    plateNumber: 'UP-25-AT-1029',
    village: 'Railway Junction Gate 2',
    status: 'pending',
    appliedAt: '2026-09-02',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    tripsCompleted: 0,
    rating: 5.0,
  }
];

interface AdminPanelProps {
  currentUser: UserProfile | null;
  routes: SharedRoute[];
  bookings: Booking[];
  lang: Language;
  onLogout: () => void;
  onSwitchToTraveller: () => void;
  onSwitchToDriver: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  routes,
  bookings,
  lang,
  onLogout,
  onSwitchToTraveller,
  onSwitchToDriver,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'verification' | 'bookings' | 'routes'>('analytics');
  const [driverList, setDriverList] = useState<DriverKYC[]>(INITIAL_DRIVERS_KYC);
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  // Approve driver
  const handleVerifyDriver = (id: string) => {
    setDriverList(prev => prev.map(d => d.id === id ? { ...d, status: 'verified' } : d));
  };

  // Reject / Suspend driver
  const handleRejectDriver = (id: string) => {
    setDriverList(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
  };

  // Analytics Computations
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_fare || 0), 0) + 14850;
  const totalBookingsCount = bookings.length + 840;
  const verifiedDriversCount = driverList.filter(d => d.status === 'verified').length;
  const pendingDriversCount = driverList.filter(d => d.status === 'pending').length;
  const activeRoutesCount = routes.length;

  const filteredDrivers = driverList.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.village.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = verificationFilter === 'all' || d.status === verificationFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* Top Admin Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight">NextRide HQ Admin Panel</h1>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Logged in as: <span className="text-slate-200 font-bold">Teamnextride</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Switch Buttons */}
            <button
              onClick={onSwitchToTraveller}
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Passenger Mode
            </button>
            <button
              onClick={onSwitchToDriver}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Driver Console
            </button>
            <button
              onClick={onLogout}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-500/30 transition-all text-xs font-bold flex items-center gap-1"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xs:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview & Analytics (डैशबोर्ड)</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 relative ${
              activeTab === 'verification'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Driver KYC & Verification (सत्यापन)</span>
            {pendingDriversCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {pendingDriversCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'bookings'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Live Bookings Ledger (सवारी बुकिंग)</span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'routes'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Active Routes & Fleet ({activeRoutesCount})</span>
          </button>
        </div>

        {/* TAB 1: EXECUTIVE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold">Total Platform GMV</span>
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-3xl font-black text-white">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-[11px] text-emerald-400 font-bold mt-1">↑ 28% from last week</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold">Total Rides Booked</span>
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                    <Ticket className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-3xl font-black text-white">{totalBookingsCount}</div>
                <p className="text-[11px] text-blue-400 font-bold mt-1">Shared seats & full autos</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold">Partner Drivers</span>
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Car className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-3xl font-black text-white">{verifiedDriversCount} Verified</div>
                <p className="text-[11px] text-amber-400 font-bold mt-1">{pendingDriversCount} applications pending</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold">Active Village Hubs</span>
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-3xl font-black text-white">14 Hubs</div>
                <p className="text-[11px] text-purple-400 font-bold mt-1">Chowks, Mandis, Stations</p>
              </div>

            </div>

            {/* Hub Traffic & Route Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <h3 className="text-base font-black text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Top Rural Transit Corridors</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { route: 'Rampur Chowk ↔ Krishi Mandi', count: '412 rides', share: '45%' },
                    { route: 'Fatehgarh Stand ↔ Railway Station', count: '280 rides', share: '32%' },
                    { route: 'Tehsil Office ↔ District Hospital', count: '148 rides', share: '18%' },
                  ].map((r, i) => (
                    <div key={i} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-white">{r.route}</p>
                        <p className="text-[11px] text-slate-400">{r.count}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-brand-500/20 text-brand-300 text-xs font-black rounded-xl">
                        {r.share}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <h3 className="text-base font-black text-white mb-4 flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-400" />
                  <span>Vehicle Fleet Breakdown</span>
                </h3>
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-white">E-Rickshaws (Electric Toto)</span>
                    </div>
                    <span className="text-xs font-black text-emerald-400">62% of Fleet (Eco-Friendly)</span>
                  </div>

                  <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-xs font-bold text-white">Shared CNG Autos (6-Seater)</span>
                    </div>
                    <span className="text-xs font-black text-blue-400">28% of Fleet</span>
                  </div>

                  <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-xs font-bold text-white">Cargo & Agri Produce Autos</span>
                    </div>
                    <span className="text-xs font-black text-amber-400">10% of Fleet</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DRIVER KYC & VERIFICATION */}
        {activeTab === 'verification' && (
          <div className="space-y-4">
            
            {/* Search and Filters */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search driver, phone, plate..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setVerificationFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    verificationFilter === 'all' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  All ({driverList.length})
                </button>
                <button
                  onClick={() => setVerificationFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    verificationFilter === 'pending' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Pending ({pendingDriversCount})
                </button>
                <button
                  onClick={() => setVerificationFilter('verified')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    verificationFilter === 'verified' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Verified ({verifiedDriversCount})
                </button>
              </div>
            </div>

            {/* Driver KYC Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="bg-slate-900 border border-slate-800 p-5 rounded-3xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={driver.avatar}
                        alt={driver.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-white">{driver.name}</h4>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              driver.status === 'verified'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : driver.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {driver.status === 'verified' ? '✓ Verified' : driver.status === 'pending' ? 'Pending KYC' : 'Rejected'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{driver.phone}</p>
                        <p className="text-[11px] text-amber-400/90 font-semibold">{driver.village}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vehicle Type:</span>
                      <span className="font-bold text-slate-200">{driver.vehicleType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Model & Plate:</span>
                      <span className="font-mono font-bold text-amber-300">{driver.vehicleModel} ({driver.plateNumber})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trips / Rating:</span>
                      <span className="font-bold text-slate-200">{driver.tripsCompleted} trips • ★ {driver.rating}</span>
                    </div>
                  </div>

                  {/* Verification Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    {driver.status !== 'verified' && (
                      <button
                        onClick={() => handleVerifyDriver(driver.id)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>सत्यापित करें (Approve)</span>
                      </button>
                    )}
                    {driver.status !== 'rejected' && (
                      <button
                        onClick={() => handleRejectDriver(driver.id)}
                        className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: BOOKINGS LEDGER */}
        {activeTab === 'bookings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden">
            <h3 className="text-base font-black text-white mb-4">Passenger Rides & Boarding OTPs</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Boarding OTP</th>
                    <th className="p-3">Passenger</th>
                    <th className="p-3">Route (From → To)</th>
                    <th className="p-3">Fare</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-brand-400">{b.id}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-300 font-mono font-black rounded-lg border border-amber-500/30">
                          {b.otp || '4891'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-white">{b.passenger_name} ({b.passenger_phone})</td>
                      <td className="p-3">{b.pickup_point} → {b.drop_point}</td>
                      <td className="p-3 font-black text-emerald-400">₹{b.total_fare}</td>
                      <td className="p-3 capitalize">{b.payment_status}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ACTIVE ROUTES */}
        {activeTab === 'routes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((route) => (
              <div key={route.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400">{route.vehicle_type}</span>
                  <span className="text-xs font-black text-emerald-400">₹{route.price_per_seat}/seat</span>
                </div>
                <h4 className="text-sm font-black text-white">{route.origin} → {route.destination}</h4>
                <p className="text-xs text-slate-400">Driver: <span className="text-slate-200 font-bold">{route.driver_name}</span> ({route.driver_phone})</p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Available Seats: {route.available_seats}/{route.total_seats}</span>
                  <span className="font-mono text-amber-300">{route.plate_number}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

    </div>
  );
};
