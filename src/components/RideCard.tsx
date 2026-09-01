import React from 'react';
import { SharedRoute, Language } from '../lib/types';
import { translations } from '../lib/translations';
import { Zap, Car, Clock, Users, Star, Phone, ShieldCheck, ChevronRight, Package, Navigation, Sparkles } from 'lucide-react';

interface RideCardProps {
  route: SharedRoute;
  onBook: (route: SharedRoute) => void;
  lang: Language;
}

export const RideCard: React.FC<RideCardProps> = ({ route, onBook, lang }) => {
  const t = translations[lang];
  const isElectric = route.is_electric || route.vehicle_type.includes('E-Rickshaw');
  const isCargo = route.vehicle_type.includes('Cargo') || route.vehicle_type.includes('Parcel');
  const isFullAuto = route.vehicle_type.includes('Full Auto');

  const isLowSeats = route.available_seats <= 2 && route.available_seats > 0;
  const isFull = route.available_seats <= 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 hover:border-brand-500/50 shadow-card-soft hover:shadow-brand-glow transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      {/* Top Card Body */}
      <div className="p-5 sm:p-6 pb-4">
        
        {/* Tier Badge & Live ETA */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 shadow-sm ${
                isElectric
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : isCargo
                  ? 'bg-purple-50 text-purple-800 border-purple-300'
                  : isFullAuto
                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              {isElectric ? <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" /> : <Car className="w-3.5 h-3.5" />}
              <span>{route.vehicle_type.split(' (')[0]}</span>
            </span>

            {isElectric && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">
                🌱 {t.electricRide}
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="text-right shrink-0">
            <div className="flex items-baseline justify-end gap-0.5">
              <span className="text-xs text-slate-500 font-bold">₹</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{route.price_per_seat}</span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block -mt-1">
              {t.perSeat}
            </span>
          </div>
        </div>

        {/* Departure Time & Vehicle Name */}
        <div className="flex items-center justify-between text-xs text-slate-600 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 font-extrabold text-brand-700 bg-brand-50/80 px-2.5 py-1 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            <span>{t.arrivingIn} {route.eta_mins || 3} {t.mins}</span>
          </div>
          <div className="text-slate-500 font-semibold truncate max-w-[180px]">
            {route.vehicle_model} • <span className="font-mono text-slate-800 font-bold">{route.plate_number}</span>
          </div>
        </div>

        {/* Route Visualizer Timeline */}
        <div className="space-y-2.5 relative pl-6 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-gradient-to-b before:from-brand-600 before:via-blue-300 before:to-emerald-500">
          {/* Pickup Origin */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-brand-600 border-2 border-white shadow-sm ring-2 ring-brand-200" />
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Pickup Point</p>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">{route.origin}</h4>
          </div>

          {/* Intermediate Stops */}
          {route.intermediate_stops && route.intermediate_stops.length > 0 && (
            <div className="py-1">
              <div className="flex flex-wrap gap-1.5">
                {route.intermediate_stops.map((stop, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
                  >
                    • {stop}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Drop Destination */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-sm ring-2 ring-emerald-200" />
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Drop Destination</p>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">{route.destination}</h4>
          </div>
        </div>

        {/* Full Auto Price Comparison */}
        {route.full_vehicle_price && (
          <div className="mt-3.5 p-2.5 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between text-xs text-slate-700">
            <span className="font-semibold text-slate-600">Reserve whole auto (Private):</span>
            <span className="font-extrabold text-brand-700 font-mono">₹{route.full_vehicle_price}</span>
          </div>
        )}
      </div>

      {/* Driver Footer & Booking Button */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Driver Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-slate-200 overflow-hidden shrink-0 border-2 border-white shadow-sm">
            {route.driver_avatar ? (
              <img src={route.driver_avatar} alt={route.driver_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs">
                {route.driver_name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">{route.driver_name}</span>
              <span title="Verified KYC Driver">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center text-amber-500 font-bold gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {route.driver_rating}
              </span>
              <span>•</span>
              <a
                href={`tel:${route.driver_phone}`}
                onClick={(e) => e.stopPropagation()}
                className="text-brand-600 hover:underline font-bold flex items-center gap-0.5"
              >
                <Phone className="w-3 h-3" /> {t.callDriver}
              </a>
            </div>
          </div>
        </div>

        {/* Seat Availability & Book Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${
              isFull
                ? 'bg-red-100 text-red-700'
                : isLowSeats
                ? 'bg-amber-100 text-amber-800 animate-pulse'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {isFull ? t.full : `${route.available_seats} ${t.seatsLeft}`}
          </span>

          <button
            onClick={() => onBook(route)}
            disabled={isFull}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isFull
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25'
            }`}
          >
            <span>{isFull ? t.full : t.bookNow}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
