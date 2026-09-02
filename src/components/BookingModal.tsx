import React, { useState } from 'react';
import { SharedRoute, UserProfile, Booking, Language } from '../lib/types';
import { translations } from '../lib/translations';
import { X, Check, Phone, User, MapPin, CreditCard, Banknote, ShieldCheck, Ticket, Download, ArrowRight, Sparkles, Share2, Volume2, Zap, Car, Package } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  route: SharedRoute | null;
  currentUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
  lang: Language;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  route,
  currentUser,
  isOpen,
  onClose,
  onConfirmBooking,
  lang,
}) => {
  if (!isOpen || !route) return null;
  const t = translations[lang];

  const [bookingType, setBookingType] = useState<'shared_seat' | 'full_auto' | 'parcel'>('shared_seat');
  const [seats, setSeats] = useState(1);
  const [passengerName, setPassengerName] = useState(currentUser?.full_name || '');
  const [passengerPhone, setPassengerPhone] = useState(currentUser?.phone || '');
  const [pickupPoint, setPickupPoint] = useState(route.origin);
  const [dropPoint, setDropPoint] = useState(route.destination);
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_ride' | 'upi_paid'>('cash_on_ride');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allStops = [route.origin, ...(route.intermediate_stops || []), route.destination];

  // Calculate fare dynamically based on mode
  const totalFare = bookingType === 'full_auto'
    ? (route.full_vehicle_price || route.price_per_seat * route.total_seats)
    : bookingType === 'parcel'
    ? (route.price_per_seat + 15)
    : (seats * route.price_per_seat);

  // Generate random 4-digit OTP
  const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newBooking: Booking = {
      id: `NR-${Math.floor(100000 + Math.random() * 900000)}`,
      otp: generatedOtp,
      route_id: route.id,
      traveller_id: currentUser?.id || `guest-${Date.now()}`,
      passenger_name: passengerName || 'Passenger',
      passenger_phone: passengerPhone || '+91 98000 00000',
      pickup_point: pickupPoint,
      drop_point: dropPoint,
      seats_booked: bookingType === 'full_auto' ? route.total_seats : seats,
      booking_type: bookingType,
      total_fare: totalFare,
      status: 'confirmed',
      payment_status: paymentMethod,
      created_at: new Date().toISOString(),
      route: route,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
      onConfirmBooking(newBooking);

      // Fire celebration confetti
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#38bdf8', '#fbbf24'],
      });
    }, 400);
  };

  const handleShareWhatsApp = (b: Booking) => {
    const text = encodeURIComponent(
      `🛺 *NextRide Shared Auto Ticket*\n\n` +
      `📌 *Booking ID:* ${b.id}\n` +
      `🔑 *Start Ride OTP:* ${b.otp}\n` +
      `📍 *From:* ${b.pickup_point}\n` +
      `🏁 *To:* ${b.drop_point}\n` +
      `🚗 *Auto:* ${route.vehicle_model} (${route.plate_number})\n` +
      `👤 *Driver:* ${route.driver_name} (${route.driver_phone})\n` +
      `💰 *Total Fare:* ₹${b.total_fare}\n\n` +
      `Live Track: https://nextride.vercel.app`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleDone = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-6 animate-fadeIn">
        
        {/* Confirmed State: Ola/Uber style Boarding Ticket with 4-digit OTP */}
        {confirmedBooking ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-extrabold border border-emerald-200 inline-block mb-1">
                {t.bookingConfirmed} ✓
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                {route.driver_name.split(' ')[0]} is on the way!
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.arrivingIn} {route.eta_mins || 3} {t.mins} • {route.vehicle_model}
              </p>
            </div>

            {/* Big 4-Digit OTP Box (Ola/Uber Style) */}
            <div className="bg-amber-50 border-2 border-dashed border-amber-400 p-4 rounded-2xl flex flex-col items-center justify-center">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-900">
                {t.startOtp}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {confirmedBooking.otp.split('').map((digit, idx) => (
                  <span
                    key={idx}
                    className="w-11 h-12 bg-white text-slate-900 font-black text-2xl rounded-xl shadow-md flex items-center justify-center border border-amber-300 font-mono"
                  >
                    {digit}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-amber-800 font-semibold mt-2">
                {t.shareOtpDriver}
              </p>
            </div>

            {/* Digital Ticket Card */}
            <div className="bg-gradient-to-br from-slate-900 to-brand-950 text-white rounded-2xl p-5 text-left relative overflow-hidden shadow-xl border border-brand-800">
              <div className="flex justify-between items-start border-b border-white/15 pb-3">
                <div>
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Booking ID</p>
                  <p className="font-mono text-base font-bold text-cyan-300">{confirmedBooking.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Mode</p>
                  <p className="text-xs font-bold text-emerald-400 capitalize">
                    {confirmedBooking.booking_type.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="py-3 space-y-2 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-400" />
                  <p className="text-xs font-semibold text-slate-200 truncate">From: <strong className="text-white">{confirmedBooking.pickup_point}</strong></p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <p className="text-xs font-semibold text-slate-200 truncate">To: <strong className="text-white">{confirmedBooking.drop_point}</strong></p>
                </div>
              </div>

              <div className="pt-3 flex justify-between items-center text-xs">
                <div>
                  <p className="text-slate-400">Auto Number</p>
                  <p className="font-mono font-extrabold text-amber-300">{route.plate_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400">Fare</p>
                  <p className="font-black text-amber-300 text-lg">₹{confirmedBooking.total_fare}</p>
                </div>
              </div>
            </div>

            {/* Actions: Call Driver & Share WhatsApp */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${route.driver_phone}`}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>{t.callDriver}</span>
              </a>

              <button
                onClick={() => handleShareWhatsApp(confirmedBooking)}
                className="py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-green-500/30 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all"
            >
              Done / Back to Home
            </button>
          </div>
        ) : (
          /* Form: Booking Sheet */
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-blue-800 p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                {route.is_electric ? (
                  <Zap className="w-5 h-5 text-emerald-300 fill-emerald-300" />
                ) : (
                  <Car className="w-5 h-5 text-amber-300" />
                )}
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-200">
                  {route.vehicle_type}
                </span>
              </div>
              <h3 className="text-xl font-black text-white">{route.origin} → {route.destination}</h3>
              <p className="text-xs text-blue-100 mt-1 font-medium">
                {route.vehicle_model} • {t.arrivingIn} {route.eta_mins || 3} {t.mins}
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              
              {/* Booking Mode Selector (Shared Seat vs Full Auto vs Parcel) */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  Select Ride Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingType('shared_seat')}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      bookingType === 'shared_seat'
                        ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-sm font-black'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    <div className="text-xs">⚡ Shared Seat</div>
                    <div className="text-[10px] text-brand-600 font-extrabold mt-0.5">₹{route.price_per_seat}/seat</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingType('full_auto')}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      bookingType === 'full_auto'
                        ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-sm font-black'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    <div className="text-xs">🛺 Full Auto</div>
                    <div className="text-[10px] text-emerald-600 font-extrabold mt-0.5">₹{route.full_vehicle_price || 60} total</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingType('parcel')}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      bookingType === 'parcel'
                        ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-sm font-black'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    <div className="text-xs">📦 Auto Parcel</div>
                    <div className="text-[10px] text-purple-600 font-extrabold mt-0.5">₹{route.price_per_seat + 15}</div>
                  </button>
                </div>
              </div>

              {/* Passenger Seat Count (If Shared) */}
              {bookingType === 'shared_seat' && (
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                    How many seats?
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((num) => {
                      const disabled = num > route.available_seats;
                      return (
                        <button
                          type="button"
                          key={num}
                          disabled={disabled}
                          onClick={() => setSeats(num)}
                          className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition-all border ${
                            seats === num
                              ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/25'
                              : disabled
                              ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-brand-500'
                          }`}
                        >
                          {num} {num === 1 ? 'Seat' : 'Seats'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pickup & Drop Stop Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Pickup Stop
                  </label>
                  <select
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    {allStops.map((stop, i) => (
                      <option key={i} value={stop}>{stop}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Drop Stop
                  </label>
                  <select
                    value={dropPoint}
                    onChange={(e) => setDropPoint(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    {allStops.map((stop, i) => (
                      <option key={i} value={stop}>{stop}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Passenger Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="e.g. Anita Sharma"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  Payment Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_ride')}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                      paymentMethod === 'cash_on_ride'
                        ? 'border-brand-600 bg-brand-50 text-brand-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Cash on Ride (to Driver)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi_paid')}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                      paymentMethod === 'upi_paid'
                        ? 'border-brand-600 bg-brand-50 text-brand-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-brand-600" />
                    <span>UPI / QR on Board</span>
                  </button>
                </div>
              </div>

              {/* Fare Total Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Total Fare</p>
                  <p className="text-[10px] text-emerald-600 font-extrabold">Zero surge • 4-Digit OTP protected</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">₹{totalFare}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm {bookingType === 'full_auto' ? 'Full Auto' : 'Ride'} for ₹{totalFare}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
