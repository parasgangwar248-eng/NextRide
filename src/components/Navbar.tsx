import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../design-system/components/BrandLogo';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  onJoinClick: () => void;
  onOpenIntegrations?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJoinClick, onOpenIntegrations }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why NextRide', href: '#why-nextride' },
    { label: 'Coming Soon', href: '#waiting-list' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-4.5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Exact NextRide logo + "NextRide" */}
        <div className="flex items-center gap-3">
          <a
            href="#home"
            className="flex items-center gap-2.5 focus:outline-hidden"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <BrandLogo size="md" showText={true} />
          </a>

          {/* Minimal Pilot Location Badge */}
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#1258D4] bg-[#F0F5FF] border border-[#C7DCFE] rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1258D4] animate-pulse" />
            Bareilly Pilot
          </span>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className="text-sm font-medium text-slate-600 hover:text-[#1258D4] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: CTA & Integrations Status */}
        <div className="hidden sm:flex items-center gap-3">
          {onOpenIntegrations && (
            <button
              onClick={onOpenIntegrations}
              title="Cloud & Deployment Status (GitHub, Vercel, Supabase)"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1258D4]" />
              <span className="hidden lg:inline text-[11px] font-medium text-slate-500">Integrations</span>
            </button>
          )}

          <button
            onClick={onJoinClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1258D4] hover:bg-[#0D4BB8] active:bg-[#0A3C94] text-white text-sm font-semibold transition-all shadow-xs hover:shadow-md hover:shadow-blue-500/10 cursor-pointer"
          >
            <span>Join Waiting List</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Navigation</span>
            <span className="text-xs text-[#1258D4] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1258D4]" />
              Bareilly, UP
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-[#1258D4] hover:bg-blue-50/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onJoinClick();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1258D4] text-white font-semibold text-sm shadow-xs"
            >
              <span>Join Waiting List</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
