import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { MobilityProvider } from './context/MobilityContext';
import { Header } from './components/Header';
import type { UserRole } from './components/Header';
import { PassengerPortal } from './modules/passenger/PassengerPortal';
import { DriverPortal } from './modules/driver/DriverPortal';
import { AdminPortal } from './modules/admin/AdminPortal';
import { BrandLogo } from './design-system/components/BrandLogo';

const MainApp: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('passenger');
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header currentRole={currentRole} onRoleChange={setCurrentRole} />

      <main className="flex-1">
        {currentRole === 'passenger' && <PassengerPortal />}
        {currentRole === 'driver' && <DriverPortal />}
        {currentRole === 'admin' && <AdminPortal />}
      </main>

      {/* Standard NextRide Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <BrandLogo size="sm" showTagline={false} />
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium text-center sm:text-left">
              "{t.brand.tagline}"
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} NextRide Network.</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <MobilityProvider>
        <MainApp />
      </MobilityProvider>
    </LanguageProvider>
  );
}
