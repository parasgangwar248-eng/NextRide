import React from 'react';
import { UserCheck, Shield } from 'lucide-react';

export const FounderSection: React.FC = () => {
  const founders = [
    {
      name: 'Paras Gangwar',
      initials: 'PG',
    },
    {
      name: 'Saurabh',
      initials: 'S',
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Section Heading Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F0F5FF] border border-[#C7DCFE] text-[#1258D4] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Built by the Founders</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Leadership & Vision
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-12">
            Committed to transforming regional transit through scheduled, reliable mobility.
          </p>

          {/* Minimal and Premium Founder Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            {founders.map((founder) => (
              <div
                key={founder.name}
                className="group rounded-2xl bg-white border border-slate-200/90 p-7 shadow-xs hover:shadow-md hover:border-[#C7DCFE] transition-all duration-200 flex flex-col items-center text-center"
              >
                {/* Monogram Avatar with Royal Blue Gradient Accent */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0F54D6] to-[#256BF5] text-white flex items-center justify-center font-bold text-xl shadow-sm mb-4 group-hover:scale-105 transition-transform">
                  {founder.initials}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {founder.name}
                </h3>

                <div className="mt-2 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-[#1258D4] text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Founding Team</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
