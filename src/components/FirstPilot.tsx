import React from 'react';
import { MapPin, Navigation, ShieldCheck, Sparkles } from 'lucide-react';

export const FirstPilot: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#F8FAFC] border-y border-slate-100 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Highlighted Section Container */}
        <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-sm p-8 sm:p-12 md:p-16 overflow-hidden">
          {/* Subtle brand corner gradient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              {/* Highlight Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F0F5FF] border border-[#C7DCFE] text-[#1258D4] text-xs font-bold uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our first route</span>
              </div>

              {/* Large Route Title */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
                Bypass <span className="text-[#1258D4]">→</span> Bhojipura
              </h2>

              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 text-slate-700 font-semibold text-base mb-6">
                <MapPin className="w-4 h-4 text-[#1258D4]" />
                <span>Bareilly, Uttar Pradesh</span>
              </div>

              {/* Supporting Copy - Exact prompt copy */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                We're starting with one route, learning from real passengers and drivers, and building from there.
              </p>

              {/* Key Pilot Principles (no invented stats/fares/timings) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#1258D4] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Direct Route Focus</div>
                    <div className="text-xs text-slate-500 leading-snug">Focused corridor optimization between Bypass and Bhojipura.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#1258D4] flex items-center justify-center shrink-0 mt-0.5">
                    <Navigation className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Passenger & Driver Feedback</div>
                    <div className="text-xs text-slate-500 leading-snug">Iterating closely with daily commuters prior to city-wide expansion.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Minimalist Route Visualization Column */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-6 sm:p-8 relative">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Pilot Route Schematic
                  </span>
                  <span className="text-[11px] font-semibold text-[#1258D4] bg-white border border-[#C7DCFE] px-2 py-0.5 rounded-full">
                    Uttar Pradesh
                  </span>
                </div>

                {/* Minimalist Route Spine */}
                <div className="relative pl-6 py-2 space-y-8">
                  {/* Vertical connecting line */}
                  <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-slate-200">
                    <div className="w-full h-full bg-[#1258D4] origin-top opacity-80" />
                  </div>

                  {/* Origin Stop */}
                  <div className="relative flex items-center gap-4">
                    <div className="absolute -left-6 w-6 h-6 rounded-full bg-white border-2 border-[#1258D4] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#1258D4]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Origin</span>
                      <h4 className="text-base font-bold text-slate-900 leading-tight">Bypass</h4>
                      <p className="text-xs text-slate-500">Bareilly City Perimeter</p>
                    </div>
                  </div>

                  {/* Corridor Transit Track */}
                  <div className="relative flex items-center gap-4 py-1">
                    <div className="absolute -left-6 w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-xl p-3 w-full shadow-2xs">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Direct Transit Corridor</span>
                        <span className="text-[#1258D4]">Dedicated Flow</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Connecting suburban commuters & daily travelers.
                      </p>
                    </div>
                  </div>

                  {/* Destination Stop */}
                  <div className="relative flex items-center gap-4">
                    <div className="absolute -left-6 w-6 h-6 rounded-full bg-white border-2 border-[#1258D4] flex items-center justify-center shadow-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#1258D4]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Destination</span>
                      <h4 className="text-base font-bold text-slate-900 leading-tight">Bhojipura</h4>
                      <p className="text-xs text-slate-500">Bareilly District Hub</p>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 pt-4 border-t border-slate-200/80 text-center">
                  <span className="text-xs text-slate-500 font-medium">
                    Initial pilot corridor • Preparing for rollout
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
