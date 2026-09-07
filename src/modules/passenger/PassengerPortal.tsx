import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMobility } from '../../context/MobilityContext';
import type { Trip, TransitRoute } from '../../context/MobilityContext';
import { BrandLogo } from '../../design-system/components/BrandLogo';
import { Button } from '../../design-system/components/Button';
import { Card } from '../../design-system/components/Card';
import { StatusPill } from '../../design-system/components/StatusPill';
import { Modal } from '../../design-system/components/Modal';
import {
  Clock,
  MapPin,
  ShieldCheck,
  Bus,
  Ticket,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const PassengerPortal: React.FC = () => {
  const { language, t } = useLanguage();
  const { routes, trips, activeTicket, bookSeat } = useMobility();

  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [bookingTrip, setBookingTrip] = useState<Trip | null>(null);
  const [passengerName, setPassengerName] = useState<string>('');
  const [passengerPhone, setPassengerPhone] = useState<string>('');
  const [seatCount, setSeatCount] = useState<number>(1);
  const [selectedBoardingStop, setSelectedBoardingStop] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccessNotice, setBookingSuccessNotice] = useState<boolean>(false);

  // Extract unique origins for route filter
  const originOptions = Array.from(
    new Set(routes.map(r => (language === 'hi' ? r.origin_hi : r.origin_en)))
  );

  // Filter trips
  const filteredTrips = trips.filter(trip => {
    if (selectedOrigin === 'all') return true;
    const origin = language === 'hi' ? trip.route?.origin_hi : trip.route?.origin_en;
    return origin === selectedOrigin;
  });

  const handleOpenBooking = (trip: Trip) => {
    setBookingTrip(trip);
    if (trip.route && trip.route.stops.length > 0) {
      setSelectedBoardingStop(
        language === 'hi' ? trip.route.stops[0].name_hi : trip.route.stops[0].name_en
      );
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTrip) return;

    if (!passengerName.trim() || !passengerPhone.trim()) {
      alert(language === 'hi' ? 'कृपया अपना नाम एवं फोन नंबर दर्ज करें' : 'Please enter your name and phone number');
      return;
    }

    setIsSubmitting(true);
    const dropoff = tripRoute(bookingTrip)
      ? language === 'hi'
        ? tripRoute(bookingTrip)!.destination_hi
        : tripRoute(bookingTrip)!.destination_en
      : 'Destination';

    const result = await bookSeat({
      tripId: bookingTrip.id,
      passengerName,
      passengerPhone,
      seatCount,
      boardingStop: selectedBoardingStop,
      dropoffStop: dropoff,
    });

    setIsSubmitting(false);

    if (result.success) {
      setBookingTrip(null);
      setBookingSuccessNotice(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert(result.error || 'Failed to book');
    }
  };

  const tripRoute = (trip: Trip): TransitRoute | undefined => {
    return routes.find(r => r.id === trip.route_id);
  };

  const calculateMinutesUntil = (departureTime: string) => {
    const diff = Math.round((new Date(departureTime).getTime() - Date.now()) / 60000);
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Brand Hero & Positioning Statement */}
      <section className="bg-white border-b border-[#E2E8F0] pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Brand Hierarchy: Logo with Official Tagline */}
          <BrandLogo
            size="hero"
            showTagline={true}
            taglineText={language === 'hi' ? t.brand.tagline : t.brand.tagline}
            variant="vertical"
            className="mb-6"
          />

          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mt-2 leading-relaxed">
            {t.brand.description}
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 bg-[#F0F5FF] text-[#1258D4] border border-[#C7DCFE] rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#1258D4]" />
            <span>{t.brand.reliabilityBadge}</span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {/* Booking Confirmation Toast */}
        {bookingSuccessNotice && (
          <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="font-bold text-sm">{t.passenger.bookingSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setBookingSuccessNotice(false)}
              className="text-emerald-700 hover:text-emerald-900 font-bold text-xs px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Active Boarding Ticket Banner (If User Has Booked) */}
        {activeTicket && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-white border-2 border-[#1258D4] rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0F5FF] rounded-bl-full pointer-events-none -z-0 opacity-70" />

              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1258D4] text-white rounded-2xl flex items-center justify-center font-bold">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1258D4]">
                      {t.passenger.activeTicket}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">
                      {activeTicket.passenger_name}
                    </h2>
                  </div>
                </div>

                <StatusPill status={activeTicket.status === 'boarded' ? 'boarded' : 'confirmed'} size="lg" />
              </div>

              {/* OTP Code Display Box */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="bg-[#F0F5FF] border border-[#C7DCFE] p-4 rounded-2xl text-center">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                    {t.passenger.boardingOtp}
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#1258D4] tracking-widest my-1 font-mono">
                    {activeTicket.otp_code}
                  </div>
                  <span className="text-xs text-slate-500 block">
                    {t.passenger.otpNote}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.passenger.selectStop}:</span>
                    <span className="font-semibold text-slate-900">{activeTicket.boarding_stop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.passenger.numberOfSeats}:</span>
                    <span className="font-semibold text-slate-900">{activeTicket.seat_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.passenger.fare}:</span>
                    <span className="font-bold text-[#1258D4]">₹{activeTicket.total_fare}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{t.passenger.ticketSub}</span>
                <span className="font-mono">ID: {activeTicket.id}</span>
              </div>
            </div>
          </div>
        )}

        {/* Route Search & Filter */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t.passenger.findRide}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {t.passenger.findRideSub}
              </p>
            </div>

            {/* Quick Origin Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">{t.passenger.from}:</span>
              <select
                aria-label={t.passenger.from}
                value={selectedOrigin}
                onChange={e => setSelectedOrigin(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#1258D4] focus:outline-none"
              >
                <option value="all">{t.admin.filterAll}</option>
                {originOptions.map(orig => (
                  <option key={orig} value={orig}>
                    {orig}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Departures Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              {t.passenger.allRoutes} ({filteredTrips.length})
            </h3>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Departures
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredTrips.map(trip => {
              const route = tripRoute(trip);
              if (!route) return null;

              const routeName = language === 'hi' ? route.name_hi : route.name_en;
              const origin = language === 'hi' ? route.origin_hi : route.origin_en;
              const dest = language === 'hi' ? route.destination_hi : route.destination_en;
              const minsAway = calculateMinutesUntil(trip.departure_time);
              const availableSeats = trip.total_seats - trip.booked_seats;
              const isFull = availableSeats <= 0;

              return (
                <Card
                  key={trip.id}
                  variant="interactive"
                  onClick={() => !isFull && handleOpenBooking(trip)}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Route Info & Departures */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-md">
                          {route.route_code}
                        </span>
                        <StatusPill status={trip.status} size="sm" />
                        {trip.delay_minutes > 0 && (
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            +{trip.delay_minutes} {t.common.mins}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {routeName}
                      </h4>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-600">
                        <span className="flex items-center gap-1 text-[#1258D4] font-semibold">
                          <Clock className="w-4 h-4" />
                          {t.passenger.departsIn} {minsAway} {t.common.mins}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Bus className="w-4 h-4" />
                          {trip.vehicle_number}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          {route.distance_km} {t.common.km} • ~{route.duration_mins} {t.common.mins}
                        </span>
                      </div>

                      {/* Stops list preview */}
                      <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-500 overflow-x-auto">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{origin}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span>{dest}</span>
                        <span className="text-slate-400">({route.stops.length} {t.admin.stopsCount})</span>
                      </div>
                    </div>

                    {/* Fare & Booking Button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-3">
                      <div className="text-left sm:text-right">
                        <div className="text-xl sm:text-2xl font-black text-slate-900">
                          ₹{route.base_fare}
                        </div>
                        <div className="text-xs font-medium text-slate-500">
                          {availableSeats > 0 ? (
                            <span className="text-emerald-700 font-semibold">
                              {availableSeats} {t.passenger.seatsLeft}
                            </span>
                          ) : (
                            <span className="text-red-600 font-bold">Housefull</span>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="md"
                        disabled={isFull}
                        onClick={e => {
                          e.stopPropagation();
                          handleOpenBooking(trip);
                        }}
                      >
                        {t.passenger.bookSeat}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {bookingTrip && (
        <Modal
          isOpen={Boolean(bookingTrip)}
          onClose={() => setBookingTrip(null)}
          title={t.passenger.bookingModalTitle}
          subtitle={t.passenger.bookingModalSub}
        >
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            {/* Trip Summary Card */}
            <div className="bg-[#F0F5FF] border border-[#C7DCFE] p-4 rounded-2xl">
              <div className="text-xs font-bold text-[#1258D4] uppercase tracking-wider mb-1">
                {tripRoute(bookingTrip)?.route_code}
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {language === 'hi'
                  ? tripRoute(bookingTrip)?.name_hi
                  : tripRoute(bookingTrip)?.name_en}
              </div>
              <div className="flex justify-between items-center text-xs text-slate-600 mt-2">
                <span>Vehicle: {bookingTrip.vehicle_number}</span>
                <span className="font-semibold text-[#1258D4]">
                  ₹{tripRoute(bookingTrip)?.base_fare} per seat
                </span>
              </div>
            </div>

            {/* Form Inputs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                {t.passenger.fullName}
              </label>
              <input
                type="text"
                required
                value={passengerName}
                onChange={e => setPassengerName(e.target.value)}
                placeholder="e.g. Rameshwar Dayal"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:ring-2 focus:ring-[#1258D4] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                {t.passenger.phoneNumber}
              </label>
              <input
                type="tel"
                required
                value={passengerPhone}
                onChange={e => setPassengerPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:ring-2 focus:ring-[#1258D4] focus:outline-none"
              />
            </div>

            {/* Boarding Stop Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                {t.passenger.selectStop}
              </label>
              <select
                value={selectedBoardingStop}
                onChange={e => setSelectedBoardingStop(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:ring-2 focus:ring-[#1258D4] focus:outline-none"
              >
                {tripRoute(bookingTrip)?.stops.map(stop => {
                  const stopName = language === 'hi' ? stop.name_hi : stop.name_en;
                  return (
                    <option key={stopName} value={stopName}>
                      {stopName} ({stop.km} km)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Seat Counter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                {t.passenger.numberOfSeats}
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSeatCount(num)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                      seatCount === num
                        ? 'bg-[#1258D4] text-white border-[#1258D4]'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Fare Breakdown */}
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600">
                {t.passenger.totalAmount}:
              </span>
              <span className="text-2xl font-black text-[#1258D4]">
                ₹{(tripRoute(bookingTrip)?.base_fare || 25) * seatCount}
              </span>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth={true}
                isLoading={isSubmitting}
              >
                {t.passenger.confirmAndBook}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
