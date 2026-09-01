import React, { useState, useEffect } from 'react';
import { SharedRoute, Language } from '../lib/types';
import { translations } from '../lib/translations';
import { Navigation, Zap, Car, MapPin, Compass, ShieldCheck, ChevronRight, RefreshCw, Radio } from 'lucide-react';

interface LiveRouteMapProps {
  routes: SharedRoute[];
  selectedRoute: SharedRoute | null;
  onSelectRoute: (route: SharedRoute) => void;
  onBookRoute: (route: SharedRoute) => void;
  lang: Language;
}

export const LiveRouteMap: React.FC<LiveRouteMapProps> = ({
  routes,
  selectedRoute,
  onSelectRoute,
  onBookRoute,
  lang,
}) => {
  const t = translations[lang];
  const [vehicles, setVehicles] = useState(routes);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(selectedRoute?.id || null);

  useEffect(() => {
    if (selectedRoute) {
      setActiveMarkerId(selectedRoute.id);
    }
  }, [selectedRoute]);

  // Subtle real-time movement simulation for autos on the map
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          const curX = v.current_location?.x || 50;
          const curY = v.current_location?.y || 50;
          const deltaX = (Math.random() - 0.5) * 1.5;
          const deltaY = (Math.random() - 0.5) * 1.5;
          return {
            ...v,
            current_location: {
              x: Math.min(90, Math.max(10, curX + deltaX)),
              y: Math.min(85, Math.max(15, curY + deltaY)),
              label: v.current_location?.label || 'In transit',
            },
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const activeVehicle = vehicles.find((v) => v.id === activeMarkerId) || vehicles[0];

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-white relative">
      
      {/* Top Map HUD bar */}
      <div className="p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 z-20 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <span>{t.liveMap}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-bold">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Live GPS Radar
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">{t.liveRadarSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-brand-600/30 text-brand-300 border border-brand-500/40 px-3 py-1 rounded-xl font-bold">
            {vehicles.length} {t.activeDriversNear}
          </span>
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div className="relative w-full h-80 sm:h-96 bg-[#0c1427] overflow-hidden select-none">
        
        {/* Background Road & Route Network Grid (SVG) */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Main Connecting Rural Highway & Chowk Arteries */}
          <path d="M 50 80 Q 200 150 400 180 T 800 220" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="6 6" className="animate-pulse" />
          <path d="M 120 300 C 250 200 450 250 700 80" fill="none" stroke="#0ea5e9" strokeWidth="3" opacity="0.6" />
          <path d="M 300 20 L 300 350" fill="none" stroke="#334155" strokeWidth="2" />
          <path d="M 600 20 L 600 350" fill="none" stroke="#334155" strokeWidth="2" />
        </svg>

        {/* Major Hub Landmark Badges */}
        <div className="absolute top-8 left-8 bg-slate-900/90 border border-brand-500/40 rounded-xl px-2.5 py-1 text-[10px] font-bold text-cyan-300 shadow-lg pointer-events-none flex items-center gap-1">
          <MapPin className="w-3 h-3 text-cyan-400" /> Rampur Chowk
        </div>
        <div className="absolute bottom-10 right-10 bg-slate-900/90 border border-emerald-500/40 rounded-xl px-2.5 py-1 text-[10px] font-bold text-emerald-300 shadow-lg pointer-events-none flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-400" /> Krishi Mandi Hub
        </div>
        <div className="absolute top-12 right-20 bg-slate-900/90 border border-amber-500/40 rounded-xl px-2.5 py-1 text-[10px] font-bold text-amber-300 shadow-lg pointer-events-none flex items-center gap-1">
          <MapPin className="w-3 h-3 text-amber-400" /> Railway Jn.
        </div>

        {/* Moving Auto & E-Rickshaw Markers */}
        {vehicles.map((v) => {
          const isSelected = v.id === activeMarkerId;
          const isElectric = v.is_electric;

          return (
            <div
              key={v.id}
              onClick={() => {
                setActiveMarkerId(v.id);
                onSelectRoute(v);
              }}
              style={{
                left: `${v.current_location?.x || 50}%`,
                top: `${v.current_location?.y || 50}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute cursor-pointer transition-all duration-1000 ease-out group z-10"
            >
              {/* Radar pulse around active marker */}
              <div
                className={`absolute inset-0 rounded-full animate-ping pointer-events-none ${
                  isSelected ? 'bg-brand-400 opacity-60 scale-150' : 'bg-emerald-400 opacity-20'
                }`}
              />

              {/* Marker Icon */}
              <div
                className={`relative flex items-center justify-center rounded-2xl p-2 shadow-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-brand-600 text-white border-white scale-125 shadow-brand-500/50 ring-4 ring-brand-400/40'
                    : isElectric
                    ? 'bg-emerald-600 text-white border-emerald-300 hover:scale-110'
                    : 'bg-amber-600 text-white border-amber-300 hover:scale-110'
                }`}
              >
                {isElectric ? <Zap className="w-4 h-4" /> : <Car className="w-4 h-4" />}
              </div>

              {/* Driver & ETA Popup Tag */}
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap px-2 py-0.5 rounded-lg text-[10px] font-extrabold shadow-md transition-opacity pointer-events-none ${
                  isSelected
                    ? 'bg-white text-slate-900 opacity-100'
                    : 'bg-slate-900/90 text-slate-200 opacity-0 group-hover:opacity-100 border border-slate-700'
                }`}
              >
                <span>{v.driver_name.split(' ')[0]} • ₹{v.price_per_seat}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Selected Auto Details Card */}
      {activeVehicle && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 p-2.5 flex items-center justify-center border border-white/20 shrink-0">
              {activeVehicle.is_electric ? (
                <Zap className="w-6 h-6 text-emerald-400" />
              ) : (
                <Car className="w-6 h-6 text-amber-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm sm:text-base text-white">{activeVehicle.vehicle_model}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  {activeVehicle.available_seats} {t.seatsLeft}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5 font-medium">
                {activeVehicle.origin} <span className="text-cyan-400">→</span> {activeVehicle.destination}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                <span>Driver: <strong className="text-slate-200">{activeVehicle.driver_name}</strong> (⭐ {activeVehicle.driver_rating})</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{t.arrivingIn} {activeVehicle.eta_mins || 3} {t.mins}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 font-semibold block">{t.perSeat}</span>
              <span className="text-2xl font-black text-amber-400">₹{activeVehicle.price_per_seat}</span>
            </div>

            <button
              onClick={() => onBookRoute(activeVehicle)}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-lg shadow-brand-500/30 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
            >
              <span>{t.bookSeat}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
