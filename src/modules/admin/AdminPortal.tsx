import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMobility } from '../../context/MobilityContext';
import { Card } from '../../design-system/components/Card';
import { StatusPill } from '../../design-system/components/StatusPill';
import { Button } from '../../design-system/components/Button';
import {
  Activity,
  Bus,
  Clock,
  Database,
  Users,
  RefreshCw
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { language, t } = useLanguage();
  const { routes, trips, bookings, isSupabaseLive, refreshData } = useMobility();
  const [isSyncing, setIsSyncing] = useState(false);

  // Calculations
  const totalRiders = bookings.reduce((sum, b) => sum + b.seat_count, 0);
  const totalRevenue = bookings.reduce((sum, b) => sum + b.total_fare, 0);
  const onTimeCount = trips.filter(t => t.delay_minutes === 0).length;
  const onTimePercentage = trips.length > 0 ? ((onTimeCount / trips.length) * 100).toFixed(1) : '100';

  const handleSync = async () => {
    setIsSyncing(true);
    await refreshData();
    setTimeout(() => setIsSyncing(false), 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Admin Executive Header */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1258D4]">
              {t.admin.portalTitle}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              Network Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.admin.portalSub}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
              onClick={handleSync}
            >
              {t.admin.syncData}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Vehicles */}
          <Card className="p-5 border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.admin.activeVehicles}
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#F0F5FF] text-[#1258D4] flex items-center justify-center">
                <Bus className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{trips.length}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> 100% Fleet Operational
            </div>
          </Card>

          {/* On-Time Rate */}
          <Card className="p-5 border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.admin.onTimeRate}
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{onTimePercentage}%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              NextRide Punctuality Target: &gt;98%
            </div>
          </Card>

          {/* Riders Served */}
          <Card className="p-5 border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.admin.todayPassengers}
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#F0F5FF] text-[#1258D4] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{totalRiders}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              {bookings.length} confirmed bookings
            </div>
          </Card>

          {/* Revenue */}
          <Card className="p-5 border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.admin.todayRevenue}
              </span>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <span className="font-bold text-base">₹</span>
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">₹{totalRevenue}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              Direct community ticket collections
            </div>
          </Card>
        </div>

        {/* Live Trip Dispatch Board */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t.admin.dispatchBoard}
              </h2>
              <p className="text-xs text-slate-500">
                Real-time tracking of shared transit vehicles and occupancy
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Vehicle & Driver</th>
                  <th className="py-3 px-4">Departure</th>
                  <th className="py-3 px-4">Occupancy</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trips.map(trip => {
                  const percent = Math.round((trip.booked_seats / trip.total_seats) * 100);
                  return (
                    <tr key={trip.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {trip.route?.route_code}
                        </div>
                        <div className="text-xs text-slate-500">
                          {language === 'hi' ? trip.route?.name_hi : trip.route?.name_en}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 font-mono text-xs">
                          {trip.vehicle_number}
                        </div>
                        <div className="text-xs text-slate-500">{trip.driver_name}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                        {new Date(trip.departure_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="py-3.5 px-4 w-44">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-900">
                            {trip.booked_seats}/{trip.total_seats}
                          </span>
                          <span className="text-slate-500 font-mono">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percent >= 85 ? 'bg-amber-500' : 'bg-[#1258D4]'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusPill status={trip.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Managed Routes & Supabase Backend Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Managed Routes */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {t.admin.routesOverview}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Configured rural & semi-urban commuter lines
            </p>

            <div className="space-y-3">
              {routes.map(r => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-sm"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-white border border-slate-300 font-mono text-xs font-bold rounded">
                        {r.route_code}
                      </span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {language === 'hi' ? r.name_hi : r.name_en}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {r.distance_km} {t.common.km} • ~{r.duration_mins} {t.common.mins} • {r.stops.length} {t.admin.stopsCount}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-[#1258D4]">₹{r.base_fare}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Supabase PostgreSQL Backend Hub */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-slate-900">
                {t.admin.supabaseBackend}
              </h2>
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                  isSupabaseLive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#F0F5FF] text-[#1258D4] border border-[#C7DCFE]'
                }`}
              >
                {isSupabaseLive ? 'Live Sync Active' : 'Ready to Connect'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Database schema, Realtime subscriptions, and Row Level Security
            </p>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#1258D4]" />
                  PostgreSQL Tables Configured:
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 font-mono text-2xs">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    • public.routes
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    • public.trips
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    • public.bookings
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    • public.live_tracking
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-300 p-3 rounded-xl font-mono text-2xs overflow-x-auto">
                <span className="text-slate-500"># Schema ready in:</span><br />
                <span className="text-emerald-400">/supabase/schema.sql</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
