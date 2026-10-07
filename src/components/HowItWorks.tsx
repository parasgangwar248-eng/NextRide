import React from 'react';
import { Route, MapPin, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Choose your route',
      desc: 'Browse defined transit corridors serving your daily destination.',
      icon: Route,
    },
    {
      num: '02',
      title: 'Select your stop and departure',
      desc: 'Pick your nearest designated stop and preferred scheduled time.',
      icon: MapPin,
    },
    {
      num: '03',
      title: 'Request your ride',
      desc: 'Confirm your seat ahead of time without waiting on the curb in uncertainty.',
      icon: CheckCircle,
    },
    {
      num: '04',
      title: 'Ride with confidence',
      desc: 'Board your scheduled vehicle and enjoy a predictable, punctual journey.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F0F5FF] border border-[#C7DCFE] text-[#1258D4] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1258D4]" />
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Your ride, simplified.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            A reliable 4-step flow engineered for punctuality and peace of mind.
          </p>
        </div>

        {/* 4-Step Visual Flow */}
        <div className="relative">
          {/* Subtle animated connecting route line for desktop (horizontal) */}
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-0.5 -z-0">
            <svg className="w-full h-4 overflow-visible" fill="none">
              <line
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                stroke="#E2E8F0"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <line
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                stroke="#1258D4"
                strokeWidth="2"
                className="animate-route-flow"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="group relative rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-[#C7DCFE] transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top step icon with number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#F0F5FF] border border-[#C7DCFE] text-[#1258D4] flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-black text-slate-300 group-hover:text-[#1258D4] transition-colors">
                        {step.num}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="hidden sm:flex lg:hidden items-center justify-end pt-4 text-slate-300">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
