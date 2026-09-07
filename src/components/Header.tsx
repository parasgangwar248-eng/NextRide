import React, { useState } from 'react';
import { BrandLogo } from '../design-system/components/BrandLogo';
import { LanguageSwitcher } from '../design-system/components/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { useMobility } from '../context/MobilityContext';
import { Modal } from '../design-system/components/Modal';
import { Database, CheckCircle2, Sparkles } from 'lucide-react';

export type UserRole = 'passenger' | 'driver' | 'admin';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  const { t } = useLanguage();
  const { isSupabaseLive } = useMobility();
  const [showDbModal, setShowDbModal] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo - Official Proportions */}
          <div className="flex items-center gap-3">
            <BrandLogo size="md" showTagline={false} />
          </div>

          {/* Role Navigation Switcher */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => onRoleChange('passenger')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                currentRole === 'passenger'
                  ? 'bg-white text-[#1258D4] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.nav.passenger}
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('driver')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                currentRole === 'driver'
                  ? 'bg-[#1258D4] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.nav.driver}
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('admin')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                currentRole === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.nav.admin}
            </button>
          </div>

          {/* Right Controls: Database Status & Language Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Supabase Status Pill */}
            <button
              type="button"
              onClick={() => setShowDbModal(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isSupabaseLive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-[#F0F5FF] text-[#1258D4] border-[#C7DCFE] hover:bg-[#E2EDFE]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isSupabaseLive ? 'Supabase Live' : 'Backend Ready'}
              </span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden border-t border-slate-100 py-2 justify-around">
          <button
            type="button"
            onClick={() => onRoleChange('passenger')}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all ${
              currentRole === 'passenger'
                ? 'bg-[#1258D4] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.nav.passenger}
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('driver')}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all ${
              currentRole === 'driver'
                ? 'bg-[#1258D4] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.nav.driver}
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('admin')}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all ${
              currentRole === 'admin'
                ? 'bg-[#1258D4] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.nav.admin}
          </button>
        </div>
      </div>

      {/* Supabase Status Modal */}
      <Modal
        isOpen={showDbModal}
        onClose={() => setShowDbModal(false)}
        title="Supabase Backend Integration"
        subtitle="NextRide PostgreSQL Database & Real-Time Sync"
      >
        <div className="space-y-4 text-slate-700 text-sm">
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isSupabaseLive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-[#F0F5FF] border-[#C7DCFE] text-slate-800'
            }`}
          >
            {isSupabaseLive ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#1258D4] flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-sm">
                {isSupabaseLive
                  ? 'Connected to Live Supabase Backend'
                  : 'Operating in High-Reliability Local Simulation Mode'}
              </p>
              <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                {isSupabaseLive
                  ? 'All route updates, driver status changes, and bookings sync in real time across the network via Supabase PostgreSQL.'
                  : 'NextRide is fully functional with persistent browser memory, live OTP verification, and scheduled route dispatch out of the box.'}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
              How to Connect Your Live Supabase Project:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600">
              <li>Open your project on Supabase and create a new project.</li>
              <li>
                Run the pre-built schema script from{' '}
                <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">
                  supabase/schema.sql
                </code>{' '}
                in the SQL Editor.
              </li>
              <li>
                Copy your Project URL and Anon API Key into{' '}
                <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">
                  .env
                </code>
                :
              </li>
            </ol>
            <div className="mt-3 bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-xs overflow-x-auto">
              <div>VITE_SUPABASE_URL=https://xyzcompany.supabase.co</div>
              <div>VITE_SUPABASE_ANON_KEY=eyJh...your-anon-key</div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowDbModal(false)}
              className="px-4 py-2 bg-[#1258D4] text-white rounded-xl text-sm font-semibold hover:bg-[#0D4BB8]"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
};
