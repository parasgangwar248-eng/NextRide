import React from 'react';
import { Language } from '../lib/types';
import { translations } from '../lib/translations';
import { ArrowUp, Zap, Instagram } from 'lucide-react';

interface FooterProps {
  onOpenSupabaseGuide?: () => void;
  onOpenSafety?: () => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Logo & Tagline */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="NextRide Logo" className="w-10 h-10 rounded-2xl shadow-md border border-white/20 object-cover" />
              <div>
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  Next<span className="text-brand-400">Ride</span>
                </span>
                <p className="text-xs text-blue-200 font-medium">{t.tagline}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              India's first specialized rural E-Rickshaw (Toto) and Shared Auto network connecting village chowks with Mandis, railway junctions, and block hospitals.
            </p>
          </div>

          {/* Quick Links (Cleaned: Only Book Auto/Toto & Instagram) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-bold">
              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-brand-400 flex items-center gap-1.5 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Book Auto / Toto</span>
                </button>
              </li>
              <li>
                <a
                  href="https://instagram.com/nextride.one"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 flex items-center gap-1.5 transition-colors text-pink-300 font-bold"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram: @nextride.one</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Guarantee / Promise */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">NextRide Promise</h4>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>100% Verified E-Autos & Drivers</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Safe, affordable, 4-digit OTP protected rides starting at just ₹10.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NextRide Technologies. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all flex items-center gap-1 text-xs font-bold"
            title="Back to Top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
