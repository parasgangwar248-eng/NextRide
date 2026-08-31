import React from 'react';
import { UserProfile, UserRole } from '../lib/types';
import { InstallPwaButton } from './InstallPwaButton';
import { Compass, Car, Database, LogOut, User, Menu, X, PlusCircle, CheckCircle, Sparkles } from 'lucide-react';
import { getSavedSupabaseConfig } from '../lib/supabaseClient';

interface NavbarProps {
  currentUser: UserProfile | null;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSupabaseGuide: () => void;
  activeTab: 'explore' | 'bookings' | 'driver-routes' | 'driver-post';
  setActiveTab: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeRole,
  onRoleChange,
  onOpenAuth,
  onLogout,
  onOpenSupabaseGuide,
  activeTab,
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const supabaseConfig = getSavedSupabaseConfig();
  const isSupabaseConfigured = !!supabaseConfig.url;

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
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                  Next<span className="text-brand-600">Ride</span>
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-brand-50 text-brand-700 rounded-full border border-brand-200">
                  Rural Mobility
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-tight hidden xs:block">
                Your next ride, on time, every time
              </p>
            </div>
          </div>

          {/* Center Role Toggle (Desktop & Tablet) */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => onRoleChange('traveller')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeRole === 'traveller'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Find a Ride (Traveller)</span>
            </button>
            <button
              onClick={() => onRoleChange('driver')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeRole === 'driver'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Driver Portal</span>
            </button>
          </div>

          {/* Right Actions: Supabase Status + PWA Install + User Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Supabase Status Button */}
            <button
              onClick={onOpenSupabaseGuide}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title="Click to view/configure Supabase Database"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">
                {isSupabaseConfigured ? 'Supabase Connected' : 'Connect Supabase'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
            </button>

            {/* PWA Install Button (Always visible on top-right as requested) */}
            <InstallPwaButton variant="navbar" />

            {/* Auth Actions */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 sm:pl-2">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 sm:pr-3 rounded-full">
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
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                      {currentUser.full_name}
                    </p>
                    <p className="text-[10px] text-brand-600 font-semibold capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Log out"
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
                <span>Login / Sign Up</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
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
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                onRoleChange('traveller');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold ${
                activeRole === 'traveller' ? 'bg-brand-600 text-white' : 'text-slate-600'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Traveller Mode</span>
            </button>
            <button
              onClick={() => {
                onRoleChange('driver');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold ${
                activeRole === 'driver' ? 'bg-brand-600 text-white' : 'text-slate-600'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Driver Portal</span>
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenSupabaseGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-blue-50 text-brand-700 rounded-xl font-bold text-xs flex items-center justify-between border border-blue-100"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Supabase PostgreSQL Setup
              </span>
              <span className="text-[10px] bg-brand-600 text-white px-2 py-0.5 rounded-full">Guide</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
