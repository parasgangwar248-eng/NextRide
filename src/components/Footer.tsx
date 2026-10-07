import React from 'react';
import { BrandLogo } from '../design-system/components/BrandLogo';
import { MapPin } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200/90 py-14 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-100">
          {/* Left Brand & Tagline */}
          <div className="space-y-3">
            <BrandLogo size="md" showText={true} />
            {/* Tagline from Prompt */}
            <p className="text-slate-600 text-sm font-medium">
              “Your next ride, on time, every time”
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#1258D4]" />
              <span>Scheduled Mobility Network • Bareilly, Uttar Pradesh</span>
            </div>
          </div>

          {/* Navigation Links from Prompt */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollTo('#home')}
              className="hover:text-[#1258D4] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('#how-it-works')}
              className="hover:text-[#1258D4] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('#waiting-list')}
              className="hover:text-[#1258D4] transition-colors cursor-pointer"
            >
              Waiting List
            </button>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#1258D4] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-[#1258D4] transition-colors cursor-pointer"
            >
              Terms
            </button>
          </div>
        </div>

        {/* Bottom Copyright & Official Instagram Handle */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 NextRide. All rights reserved.</p>

          <div className="flex items-center gap-5">
            {/* Official Instagram Handle */}
            <a
              href="https://instagram.com/nextride.one"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#1258D4] font-semibold transition-all group"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-slate-500 group-hover:text-[#E1306C] transition-colors"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>@nextride.one</span>
            </a>

            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-400">Bareilly Mobility Pilot</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
