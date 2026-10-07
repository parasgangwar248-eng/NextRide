import React from 'react';
import { Route, Clock, Smartphone } from 'lucide-react';

export const WhatIsNextRide: React.FC = () => {
  const cards = [
    {
      num: '01',
      title: 'Know Your Route',
      description: 'Clear routes and designated stops.',
      icon: Route,
      detail: 'Fixed transit corridors with predictable pickup points, eliminating guesswork and uncertainty.',
    },
    {
      num: '02',
      title: 'Know Your Time',
      description: 'Published schedules designed around real travel needs.',
      icon: Clock,
      detail: 'Rides planned around genuine commuting hours so you always know when the next departure is.',
    },
    {
      num: '03',
      title: 'Know Your Ride',
      description: 'Ride information, booking and service updates in one place.',
      icon: Smartphone,
      detail: 'Transparent ride status, digital seat reservations, and instant route notices before you travel.',
    },
  ];

  return (
    <section id="what-is-nextride" className="py-20 md:py-28 bg-[#F8FAFC] border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1258D4]" />
            What is NextRide?
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            Mobility should be predictable.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            NextRide is a shared mobility platform designed to connect passengers with reliable
            scheduled rides on defined routes.
          </p>
        </div>

        {/* 3 Core Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.num}
                className="group relative rounded-2xl bg-white border border-slate-200/90 p-8 shadow-xs hover:shadow-md hover:border-[#C7DCFE] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top card header with number and icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-bold tracking-widest text-[#1258D4] bg-[#F0F5FF] border border-[#C7DCFE] px-2.5 py-1 rounded-md">
                      {card.num}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-[#F0F5FF] group-hover:border-[#C7DCFE] group-hover:text-[#1258D4] text-slate-600 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-[#1258D4] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-700 font-medium text-base mb-4 leading-snug">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                  {card.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
