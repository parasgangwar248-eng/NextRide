import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMobility } from '../../context/MobilityContext';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { StatusPill } from '../../design-system/components/StatusPill';
import {
  Navigation,
  CheckCircle2,
  Play,
  Clock
} from 'lucide-react';

export const DriverPortal: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    trips,
    bookings,
    startTrip,
    departStop,
    reportDelay,
    arriveStop,
    completeTrip,
    verifyOtp,
  } = useMobility();

  // Pick first trip as active driver trip (UP-25-NR-1082)
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || 'trip-101');
  const [otpInput, setOtpInput] = useState<string>('');
  const [verificationFeedback, setVerificationFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const activeTrip = trips.find(t => t.id === selectedTripId) || trips[0];
  const activeRoute = activeTrip?.route;

  // Bookings on this trip
  const tripBookings = bookings.filter(b => b.trip_id === activeTrip?.id);
  const boardedCount = tripBookings.filter(b => b.status === 'boarded').length;
  const pendingCount = tripBookings.filter(b => b.status !== 'boarded').length;

  const currentStopName =
    activeRoute && activeRoute.stops[activeTrip?.current_stop_index || 0]
      ? language === 'hi'
        ? activeRoute.stops[activeTrip?.current_stop_index || 0].name_hi
        : activeRoute.stops[activeTrip?.current_stop_index || 0].name_en
      : 'Depot';

  const nextStopIndex = (activeTrip?.current_stop_index || 0) + 1;
  const nextStopName =
    activeRoute && activeRoute.stops[nextStopIndex]
      ? language === 'hi'
        ? activeRoute.stops[nextStopIndex].name_hi
        : activeRoute.stops[nextStopIndex].name_en
      : null;

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpInput.trim() || !activeTrip) return;

    const res = verifyOtp(activeTrip.id, otpInput.trim());
    if (res.success) {
      setVerificationFeedback({ type: 'success', message: res.message });
      setOtpInput('');
    } else {
      setVerificationFeedback({ type: 'error', message: res.message });
    }

    setTimeout(() => {
      setVerificationFeedback({ type: null, message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* High-Contrast Driver Operations Header */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-6 shadow-md border-b-4 border-[#1258D4]">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#256BF5]">
              {t.driver.portalTitle}
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {activeTrip.vehicle_number}
              </h1>
              <StatusPill status={activeTrip.status} size="md" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {activeTrip.driver_name} • {t.driver.operationalSpeed}: 42 {t.common.km}/h
            </p>
          </div>

          {/* Quick Vehicle Selector for Multi-Vehicle Demo */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Switch Vehicle:</span>
            <select
              aria-label="Switch Vehicle"
              value={selectedTripId}
              onChange={e => setSelectedTripId(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 text-xs sm:text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#1258D4] focus:outline-none"
            >
              {trips.map(tr => (
                <option key={tr.id} value={tr.id}>
                  {tr.vehicle_number} ({tr.route?.route_code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* Large Operational Control Center */}
        <Card className="p-6 border-2 border-slate-200">
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-2">
            {t.driver.route}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-4">
            {language === 'hi' ? activeRoute?.name_hi : activeRoute?.name_en}
          </h2>

          {/* Route Station Progression Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-100 p-4 rounded-2xl border border-slate-200 mb-6">
            <div className="border-l-4 border-[#1258D4] pl-3 py-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t.driver.currentStop}
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900 block mt-0.5">
                {currentStopName}
              </span>
            </div>

            <div className="border-l-4 border-emerald-500 pl-3 py-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t.driver.nextStop}
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900 block mt-0.5">
                {nextStopName || 'Terminal / Depot'}
              </span>
            </div>
          </div>

          {/* Large Touch Operational Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeTrip.status === 'scheduled' && (
              <button
                type="button"
                onClick={() => startTrip(activeTrip.id)}
                className="w-full py-5 px-6 rounded-2xl font-black text-lg text-white bg-[#1258D4] hover:bg-[#0D4BB8] active:scale-[0.98] shadow-md transition-all flex items-center justify-center gap-3 border-2 border-white/20"
              >
                <Play className="w-6 h-6" />
                <span>{t.driver.startTrip}</span>
              </button>
            )}

            {activeTrip.status === 'boarding' && (
              <button
                type="button"
                onClick={() => departStop(activeTrip.id)}
                className="w-full py-5 px-6 rounded-2xl font-black text-lg text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-md transition-all flex items-center justify-center gap-3 border-2 border-white/20"
              >
                <Navigation className="w-6 h-6" />
                <span>{t.driver.departStop}</span>
              </button>
            )}

            {activeTrip.status === 'in_transit' && nextStopName && (
              <button
                type="button"
                onClick={() => arriveStop(activeTrip.id)}
                className="w-full py-5 px-6 rounded-2xl font-black text-lg text-white bg-[#1258D4] hover:bg-[#0D4BB8] active:scale-[0.98] shadow-md transition-all flex items-center justify-center gap-3 border-2 border-white/20"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>
                  {t.driver.arriveStop} ({nextStopName})
                </span>
              </button>
            )}

            {activeTrip.status === 'in_transit' && !nextStopName && (
              <button
                type="button"
                onClick={() => completeTrip(activeTrip.id)}
                className="w-full py-5 px-6 rounded-2xl font-black text-lg text-white bg-slate-800 hover:bg-slate-900 active:scale-[0.98] shadow-md transition-all flex items-center justify-center gap-3 border-2 border-white/20"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>{t.driver.completeTrip}</span>
              </button>
            )}

            {activeTrip.status === 'completed' && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold rounded-2xl text-center">
                {t.driver.tripCompleted}
              </div>
            )}

            {/* Delay Reporting Button */}
            <button
              type="button"
              onClick={() => reportDelay(activeTrip.id, 5)}
              className="py-5 px-6 rounded-2xl font-black text-base text-amber-900 bg-amber-100 hover:bg-amber-200 active:scale-[0.98] border border-amber-300 transition-all flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5 text-amber-700" />
              <span>{t.driver.markDelay}</span>
            </button>
          </div>
        </Card>

        {/* Passenger Manifest & Fast Boarding OTP Keypad */}
        <Card className="p-6 border-2 border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {t.driver.passengerManifest}
              </h3>
              <p className="text-xs text-slate-500">
                {activeTrip.booked_seats} of {activeTrip.total_seats} seats booked
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                {boardedCount} {t.driver.boarded}
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg">
                {pendingCount} {t.driver.pendingBoarding}
              </span>
            </div>
          </div>

          {/* OTP Verification Input Form */}
          <div className="bg-[#F0F5FF] border-2 border-[#C7DCFE] p-5 rounded-2xl mb-6">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1258D4] mb-2">
              {t.driver.verifyOtp}
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              {t.driver.verifyOtpPrompt}
            </p>

            <form onSubmit={handleVerifyOtp} className="flex gap-3">
              <input
                type="text"
                pattern="[0-9]*"
                maxLength={4}
                value={otpInput}
                onChange={e => setOtpInput(e.target.value)}
                placeholder="4-Digit OTP (e.g. 4821)"
                className="flex-1 bg-white border-2 border-[#1258D4] rounded-xl px-4 py-3 text-lg font-mono font-black text-slate-900 tracking-widest focus:ring-2 focus:ring-[#1258D4] focus:outline-none placeholder:text-slate-400 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm"
              />
              <Button type="submit" variant="primary" size="lg" className="px-6 font-bold">
                {t.driver.boardPassenger}
              </Button>
            </form>

            {verificationFeedback.type && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs font-bold ${
                  verificationFeedback.type === 'success'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-red-100 text-red-900 border border-red-300'
                }`}
              >
                {verificationFeedback.message}
              </div>
            )}
          </div>

          {/* Passenger Roster List */}
          <div className="space-y-3">
            {tripBookings.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No passenger bookings for this trip yet.
              </p>
            ) : (
              tripBookings.map(bk => (
                <div
                  key={bk.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {bk.passenger_name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        ({bk.seat_count} {t.common.seats})
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Boarding: <span className="font-semibold text-slate-700">{bk.boarding_stop}</span> • OTP: <span className="font-mono font-bold text-[#1258D4]">{bk.otp_code}</span>
                    </div>
                  </div>

                  {bk.status === 'boarded' ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t.driver.boarded}
                    </span>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setOtpInput(bk.otp_code);
                      }}
                    >
                      Fill OTP
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
