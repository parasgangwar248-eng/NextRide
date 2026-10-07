import React from 'react';
import { ArrowRight, ChevronDown, MapPin, Navigation } from 'lucide-react';

interface HeroSectionProps {
  onJoinClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onJoinClick, onExploreClick }) => {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
      {/* Subtle radial ambient background glow matching brand blue */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-blue-500/6 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F5FF] border border-[#C7DCFE] text-[#1258D4] text-xs font-semibold tracking-wide uppercase shadow-xs mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1258D4] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1258D4]" />
            </span>
            <span>Coming Soon • Bareilly</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
            Your next ride,<br />
            <span className="text-[#1258D4]">on time, every time.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-10">
            NextRide is building a reliable shared mobility network that makes everyday travel
            more predictable, accessible and convenient.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-16">
            <button
              onClick={onJoinClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1258D4] hover:bg-[#0D4BB8] active:bg-[#0A3C94] text-white font-semibold text-base transition-all shadow-md shadow-blue-600/15 hover:shadow-lg hover:shadow-blue-600/25 cursor-pointer"
            >
              <span>Join the Waiting List</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-200 transition-all hover:border-slate-300 cursor-pointer"
            >
              <span>Explore NextRide</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Subtle Visual Representation of Route: Bypass → Bhojipura */}
          <div className="w-full max-w-2xl">
            <div className="relative rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Navigation className="w-3.5 h-3.5 text-[#1258D4]" />
                  Pilot Route Corridor
                </span>
                <span className="text-[#1258D4] font-medium normal-case tracking-normal text-xs bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  Scheduled Mobility
                </span>
              </div>

              {/* Graphic Route Representation inspired by the NextRide Logo */}
              <div className="relative py-4">
                {/* SVG Route Line connecting the two nodes */}
                <div className="relative flex items-center justify-between">
                  {/* Left Anchor Node: Bypass */}
                  <div className="flex flex-col items-center text-center z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#1258D4] shadow-md shadow-blue-500/10 flex items-center justify-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-[#1258D4] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900">Bypass</span>
                    <span className="text-[11px] text-slate-500">Bareilly</span>
                  </div>

                  {/* Connecting Animated Route Graphic */}
                  <div className="flex-1 px-4 relative flex items-center justify-center">
                    <svg className="w-full h-12 overflow-visible" viewBox="0 0 240 40" fill="none">
                      {/* Background route track */}
                      <path
                        d="M 10 20 C 60 20, 60 10, 120 10 C 180 10, 180 20, 230 20"
                        stroke="#E2E8F0"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      {/* Logo-inspired parallel speed track accents */}
                      <path
                        d="M 90 28 L 115 16"
                        stroke="#C7DCFE"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 125 24 L 150 12"
                        stroke="#C7DCFE"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {/* Active glowing electric blue route flow */}
                      <path
                        d="M 10 20 C 60 20, 60 10, 120 10 C 180 10, 180 20, 230 20"
                        stroke="#1258D4"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="animate-route-flow"
                      />
                    </svg>

                    {/* Subtle directional pulse icon in middle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-white border border-blue-200 shadow-xs text-[11px] font-semibold text-[#1258D4] flex items-center gap-1">
                      <span>Bypass</span>
                      <ArrowRight className="w-3 h-3 text-[#1258D4]" />
                      <span>Bhojipura</span>
                    </div>
                  </div>

                  {/* Right Anchor Node: Bhojipura */}
                  <div className="flex flex-col items-center text-center z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#1258D4] shadow-md shadow-blue-500/10 flex items-center justify-center mb-2">
                      <MapPin className="w-5 h-5 text-[#1258D4]" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">Bhojipura</span>
                    <span className="text-[11px] text-slate-500">Bareilly</span>
                  </div>
                </div>
              </div>

              {/* Corridor Context Banner */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1258D4]" />
                  <span className="font-semibold text-slate-800">
                    Launching first in Bareilly, Uttar Pradesh
                  </span>
                </div>
                <div className="text-slate-400 italic">
                  Pre-launch phase • Operations in active preparation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
