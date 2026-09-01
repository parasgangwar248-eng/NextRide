import React from 'react';
import { Language } from '../lib/types';
import { translations } from '../lib/translations';
import { Database, ShieldCheck, ArrowUp, Zap, Heart } from 'lucide-react';

interface FooterProps {
  onOpenSupabaseGuide: () => void;
  onOpenSafety: () => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSupabaseGuide, onOpenSafety, lang }) => {
  const t = translations[lang];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pb-16 md:pb-0">
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
                <p className="text-xs text-blue-200 font-medium">{t.tagline}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              India's first specialized rural E-Rickshaw (Toto) and Shared Auto network connecting village chowks with Mandis, railway junctions, and block hospitals.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PWA Enabled (Direct Home Screen App)
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={scrollToTop} className="hover:text-white transition-colors">{t.findRide}</button></li>
              <li><button onClick={scrollToTop} className="hover:text-white transition-colors">{t.driverPortal}</button></li>
              <li>
                <button onClick={onOpenSafety} className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {t.safetyToolkit} (SOS 112)
                </button>
              </li>
              <li>
                <button onClick={onOpenSupabaseGuide} className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" /> Supabase Database Setup
                </button>
              </li>
            </ul>
          </div>

          {/* Guarantee */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">NextRide Promise</h4>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>100% Verified E-Autos</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Safe, affordable, 4-digit OTP protected rides starting at just ₹10.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NextRide Technologies. Built for Bharat's E-Rickshaw & Auto connectivity.</p>
          <button
            onClick={scrollToTop}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
