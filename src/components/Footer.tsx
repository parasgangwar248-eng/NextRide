import React from 'react';
import { Compass, Car, Database, Smartphone, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenSupabaseGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSupabaseGuide }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="NextRide Logo" className="w-10 h-10 rounded-2xl shadow-md border border-white/20" />
              <div>
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  Next<span className="text-brand-400">Ride</span>
                </span>
                <p className="text-xs text-blue-200 font-medium">Your next ride, on time, every time</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              NextRide is India's dedicated rural shared mobility ecosystem connecting villages, farming communities, and small towns with reliable daily shared transport to Mandis, hospitals, and railway hubs.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PWA Enabled (Installable on Homescreen)
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#find-ride" onClick={scrollToTop} className="hover:text-white transition-colors">Find a Shared Ride</a></li>
              <li><a href="#driver-portal" onClick={scrollToTop} className="hover:text-white transition-colors">Driver Registration</a></li>
              <li><a href="#popular-routes" onClick={scrollToTop} className="hover:text-white transition-colors">Village Mandi Routes</a></li>
              <li>
                <button onClick={onOpenSupabaseGuide} className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" /> Supabase Database Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Mobility Guarantee */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">NextRide Promise</h4>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Fixed Transparent Fares</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                No surge pricing. Reliable daily schedules for farm produce and passenger comfort.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NextRide Technologies. Built for Bharat's rural connectivity.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
