import React from 'react';
import { SharedRoute } from '../lib/types';
import { Car, Clock, MapPin, Users, Star, Phone, ShieldCheck, ChevronRight, Package, Wind, Sparkles } from 'lucide-react';

interface RideCardProps {
  route: SharedRoute;
  onBook: (route: SharedRoute) => void;
  onSelectStops?: (stop: string) => void;
}

export const RideCard: React.FC<RideCardProps> = ({ route, onBook }) => {
  const getVehicleBadgeColor = (type: string) => {
    switch (type) {
      case 'Jeep / Cruiser':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Tata Magic / Mini-Van':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Auto / E-Rickshaw':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Rural Express Bus':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const isLowSeats = route.available_seats <= 2 && route.available_seats > 0;
  const isFull = route.available_seats <= 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 hover:border-brand-500/50 shadow-card-soft hover:shadow-brand-glow transition-all duration-300 overflow-hidden group flex flex-col justify-between">
      {/* Top Card Header */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getVehicleBadgeColor(route.vehicle_type)} flex items-center gap-1.5`}>
              <Car className="w-3.5 h-3.5" />
              {route.vehicle_type}
            </span>

            {route.is_ac && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1">
                <Wind className="w-3 h-3" /> AC
              </span>
            )}

            {route.has_carrier && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                <Package className="w-3 h-3" /> Rooftop Carrier
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="text-right shrink-0">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xs text-slate-500 font-bold">₹</span>
              <span className="text-2xl font-black text-slate-900">{route.price_per_seat}</span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block -mt-1">
              per seat
            </span>
          </div>
        </div>

        {/* Departure Time & Vehicle Model */}
        <div className="flex items-center justify-between text-xs text-slate-600 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 font-bold text-brand-700">
            <Clock className="w-4 h-4 text-brand-600" />
            <span>Departs: {route.departure_time}</span>
          </div>
          <div className="text-slate-500 font-medium truncate max-w-[180px]">
            {route.vehicle_model} • <span className="font-mono text-slate-700 font-semibold">{route.plate_number}</span>
          </div>
        </div>

        {/* Route Visualizer Timeline */}
        <div className="space-y-2.5 relative pl-6 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-gradient-to-b before:from-brand-600 before:via-blue-300 before:to-emerald-500">
          {/* Origin */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-brand-600 border-2 border-white shadow-sm ring-2 ring-brand-200" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pickup</p>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">{route.origin}</h4>
          </div>

          {/* Intermediate Stops */}
          {route.intermediate_stops && route.intermediate_stops.length > 0 && (
            <div className="py-1">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mb-1">
                <span>Via Stops:</span>
              </div>
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

          {/* Destination */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-sm ring-2 ring-emerald-200" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Drop Destination</p>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">{route.destination}</h4>
          </div>
        </div>

        {/* Luggage / Special note */}
        {route.luggage_space && (
          <div className="mt-3.5 p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600 flex items-center gap-1.5 border border-slate-100">
            <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{route.luggage_space}</span>
          </div>
        )}
      </div>

      {/* Driver info + Booking Button */}
      <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Driver profile summary */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
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
              <span title="Verified Driver">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="flex items-center text-amber-500 font-bold gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {route.driver_rating}
              </span>
              <span>•</span>
              <a
                href={`tel:${route.driver_phone}`}
                onClick={(e) => e.stopPropagation()}
                className="text-brand-600 hover:underline font-semibold flex items-center gap-1"
              >
                <Phone className="w-3 h-3" /> Call
              </a>
            </div>
          </div>
        </div>

        {/* Seat Availability & Book Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50">
          <div className="text-left sm:text-right">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                isFull
                  ? 'bg-red-100 text-red-700'
                  : isLowSeats
                  ? 'bg-amber-100 text-amber-800 animate-pulse'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              <Users className="w-3 h-3" />
              {isFull ? 'Full (0 Seats)' : `${route.available_seats} seats left`}
            </span>
          </div>

          <button
            onClick={() => onBook(route)}
            disabled={isFull}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isFull
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25'
            }`}
          >
            <span>{isFull ? 'Full' : 'Book Seat'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
