import React, { useState } from 'react';
import { UserProfile, UserRole, Language } from '../lib/types';
import { translations } from '../lib/translations';
import { InstallPwaButton } from './InstallPwaButton';
import { Compass, Car, Database, LogOut, User, Menu, X, ShieldCheck, Languages, Zap, AlertTriangle, Settings } from 'lucide-react';
import { getSavedSupabaseConfig } from '../lib/supabaseClient';

interface NavbarProps {
  currentUser: UserProfile | null;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSupabaseGuide: () => void;
  onOpenSafety: () => void;
  onOpenSettings: () => void;
  lang: Language;
  onToggleLang: () => void;
  activeTab: 'explore' | 'bookings' | 'live-map' | 'driver-routes' | 'driver-post';
  setActiveTab: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeRole,
  onRoleChange,
  onOpenAuth,
  onLogout,
  onOpenSupabaseGuide,
  onOpenSafety,
  onOpenSettings,
  lang,
  onToggleLang,
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabaseConfig = getSavedSupabaseConfig();
  const isSupabaseConfigured = !!supabaseConfig.url;
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('explore')}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-lg shadow-brand-500/25 border-2 border-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                <img src="/logo.jpg" alt="NextRide Logo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" title="Online" />
            </div>
            
            <div className="cursor-pointer" onClick={() => setActiveTab('explore')}>
              <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                Next<span className="text-brand-600">Ride</span>
              </span>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-tight hidden xs:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Center Navigation Bar (Strictly Role-Specific) */}
          <div className="hidden md:flex items-center">
            {currentUser?.role === 'driver' ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl shadow-sm text-xs font-black">
                <Car className="w-4 h-4 text-amber-400" />
                <span>{t.driverPortal} (चालक पोर्टल)</span>
              </div>
            ) : currentUser?.role === 'admin' ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 rounded-2xl shadow-sm text-xs font-black">
                <ShieldCheck className="w-4 h-4" />
                <span>NextRide Admin HQ</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 text-brand-900 rounded-2xl text-xs font-black">
                <Zap className="w-4 h-4 text-brand-600" />
                <span>{t.findRide}</span>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher Button (EN / हिंदी) */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all active:scale-95"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-3.5 h-3.5 text-brand-600" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Safety Standards Quick Button */}
            <button
              onClick={onOpenSafety}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all"
              title="NextRide Safety Standards"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden sm:inline">{t.safety}</span>
            </button>

            {/* PWA Install Button */}
            <InstallPwaButton variant="navbar" />

            {/* User Auth & Settings */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 pl-1">
                <div 
                  onClick={onOpenSettings}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 p-1 sm:pr-3 rounded-full cursor-pointer transition-all"
                  title="Click to open Settings & Switch Account"
                >
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.full_name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-brand-500"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[90px]">
                      {currentUser.full_name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-brand-600 font-semibold capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenSettings}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Settings & Accounts"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
              >
                <User className="w-4 h-4" />
                <span className="hidden xs:inline">{t.loginSignUp}</span>
                <span className="xs:hidden">Login</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-3 animate-fadeIn">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Role:</span>
              <span className="text-xs font-black text-brand-600 uppercase">
                {currentUser ? currentUser.role : 'Guest Passenger'}
              </span>
            </div>
            {currentUser && (
              <button
                onClick={() => {
                  onOpenSettings();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            )}
          </div>

          <div className="pt-1 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenSafety();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-slate-50 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-between border border-slate-200"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                {t.safetyToolkit}
              </span>
              <span className="text-[10px] bg-brand-600 text-white px-2 py-0.5 rounded-full font-bold">Standards</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
