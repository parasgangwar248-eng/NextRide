import React from 'react';
import { ShieldCheck, Users, Sparkles, Network } from 'lucide-react';

export const WhyNextRide: React.FC = () => {
  const features = [
    {
      title: 'Reliable',
      description: 'Designed around predictable routes and schedules.',
      icon: ShieldCheck,
      detail: 'Fixed routes and timetables mean you can plan your day without wondering if a ride will show up.',
    },
    {
      title: 'Accessible',
      description: 'Built for everyday shared transportation.',
      icon: Users,
      detail: 'Designed for daily commuters, students, and professionals needing dependable transit.',
    },
    {
      title: 'Simple',
      description: 'Easy-to-understand routes, stops and ride information.',
      icon: Sparkles,
      detail: 'Clear pickup points, transparent digital details, and straightforward booking.',
    },
    {
      title: 'Connected',
      description: 'Passengers and drivers connected through one platform.',
      icon: Network,
      detail: 'A shared ecosystem aligning traveler demand with driver availability on fixed corridors.',
    },
  ];

  return (
    <section id="why-nextride" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F0F5FF] border border-[#C7DCFE] text-[#1258D4] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1258D4]" />
            Why NextRide
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Built for everyday predictability.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            A fundamentally different approach to shared mobility, focused on reliability and consistency.
          </p>
        </div>

        {/* 4 Premium Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl bg-white border border-slate-200/90 p-7 shadow-xs hover:shadow-md hover:border-[#C7DCFE] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#F0F5FF] border border-[#C7DCFE] text-[#1258D4] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#1258D4] transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-slate-800 font-medium text-sm leading-snug mb-3">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                  {feature.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
