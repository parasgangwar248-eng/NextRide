import React, { useState } from 'react';
import { SharedRoute, UserProfile, Booking } from '../lib/types';
import { X, Check, Phone, User, MapPin, Calendar, CreditCard, Banknote, ShieldCheck, Ticket, Download, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  route: SharedRoute | null;
  currentUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  route,
  currentUser,
  isOpen,
  onClose,
  onConfirmBooking,
}) => {
  if (!isOpen || !route) return null;

  const [seats, setSeats] = useState(1);
  const [passengerName, setPassengerName] = useState(currentUser?.full_name || '');
  const [passengerPhone, setPassengerPhone] = useState(currentUser?.phone || '');
  const [pickupPoint, setPickupPoint] = useState(route.origin);
  const [dropPoint, setDropPoint] = useState(route.destination);
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_ride' | 'upi_paid'>('cash_on_ride');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allStops = [route.origin, ...(route.intermediate_stops || []), route.destination];

  const totalFare = seats * route.price_per_seat;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newBooking: Booking = {
      id: `NR-${Math.floor(100000 + Math.random() * 900000)}`,
      route_id: route.id,
      traveller_id: currentUser?.id || `guest-${Date.now()}`,
      passenger_name: passengerName || 'Passenger',
      passenger_phone: passengerPhone || '+91 98000 00000',
      pickup_point: pickupPoint,
      drop_point: dropPoint,
      seats_booked: seats,
      total_fare: totalFare,
      status: 'confirmed',
      payment_status: paymentMethod,
      created_at: new Date().toISOString(),
      route: route
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
      onConfirmBooking(newBooking);
      
      // Fire celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#38bdf8', '#fbbf24']
      });
    }, 600);
  };

  const handleDone = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-6 animate-fadeIn">
        
        {/* If Confirmed - Show Digital Boarding Ticket */}
        {confirmedBooking ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 inline-block mb-2">
                Ride Confirmed ✓
              </span>
              <h3 className="text-2xl font-black text-slate-900">Booking Successful!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your shared ride seat has been reserved with driver {route.driver_name}.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-gradient-to-br from-slate-900 to-brand-950 text-white rounded-2xl p-5 text-left relative overflow-hidden shadow-xl border border-brand-800">
              <div className="flex justify-between items-start border-b border-white/15 pb-3">
                <div>
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Booking Reference</p>
                  <p className="font-mono text-base font-bold text-amber-400">{confirmedBooking.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Departure</p>
                  <p className="text-sm font-bold text-white">{route.departure_time}</p>
                </div>
              </div>

              <div className="py-3 space-y-2 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-400" />
                  <p className="text-xs font-semibold text-slate-200">From: <strong className="text-white">{confirmedBooking.pickup_point}</strong></p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <p className="text-xs font-semibold text-slate-200">To: <strong className="text-white">{confirmedBooking.drop_point}</strong></p>
                </div>
              </div>

              <div className="pt-3 flex justify-between items-center text-xs">
                <div>
                  <p className="text-slate-400">Vehicle</p>
                  <p className="font-bold text-white">{route.vehicle_model} ({route.plate_number})</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400">Seats & Total</p>
                  <p className="font-extrabold text-amber-300 text-sm">{confirmedBooking.seats_booked} Seat(s) • ₹{confirmedBooking.total_fare}</p>
                </div>
              </div>
            </div>

            {/* Driver Contact & Action */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">{route.driver_name} (Driver)</p>
                <p className="text-[11px] text-slate-500 font-mono">{route.driver_phone}</p>
              </div>
              <a
                href={`tel:${route.driver_phone}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Phone className="w-3.5 h-3.5" /> Call Driver
              </a>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all"
            >
              Done / Back to Rides
            </button>
          </div>
        ) : (
          /* Booking Form */
          <>
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-blue-800 p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <Ticket className="w-5 h-5 text-blue-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Reserve Shared Seats</span>
              </div>
              <h3 className="text-xl font-black text-white">{route.origin} → {route.destination}</h3>
              <p className="text-xs text-blue-100 mt-1">
                {route.vehicle_type} ({route.vehicle_model}) • Departs {route.departure_time}
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              {/* Seat Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Number of Passengers / Seats
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const disabled = num > route.available_seats;
                    return (
                      <button
                        type="button"
                        key={num}
                        disabled={disabled}
                        onClick={() => setSeats(num)}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                          seats === num
                            ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/25'
                            : disabled
                            ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-brand-500'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pickup & Drop Stop Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Pickup Stop
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Drop Point
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
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Passenger Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone Number (Driver will contact you)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_ride')}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                      paymentMethod === 'cash_on_ride'
                        ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Cash on Ride (Hand to Driver)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi_paid')}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                      paymentMethod === 'upi_paid'
                        ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-brand-600" />
                    <span>UPI / QR on Board</span>
                  </button>
                </div>
              </div>

              {/* Fare Summary Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Fare ({seats} seat{seats > 1 ? 's' : ''} × ₹{route.price_per_seat})</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">No hidden fees • Guaranteed seat</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">₹{totalFare}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Booking for ₹{totalFare}</span>
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
