import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WhatIsNextRide } from './components/WhatIsNextRide';
import { HowItWorks } from './components/HowItWorks';
import { FirstPilot } from './components/FirstPilot';
import { WhyNextRide } from './components/WhyNextRide';
import { WaitingListSection } from './components/WaitingListSection';
import { FounderSection } from './components/FounderSection';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModals';
import { IntegrationsModal } from './components/IntegrationsModal';

export default function App() {
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);

  const scrollToWaitingList = () => {
    const el = document.getElementById('waiting-list');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const input = document.getElementById('full-name');
        if (input) input.focus();
      }, 500);
    }
  };

  const scrollToWhatIsNextRide = () => {
    const el = document.getElementById('what-is-nextride');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#1258D4] selection:text-white">
      {/* 1. Navbar */}
      <Navbar
        onJoinClick={scrollToWaitingList}
        onOpenIntegrations={() => setIsIntegrationsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection
          onJoinClick={scrollToWaitingList}
          onExploreClick={scrollToWhatIsNextRide}
        />

        {/* 3. What is NextRide? */}
        <WhatIsNextRide />

        {/* 4. How It Works */}
        <HowItWorks />

        {/* 5. First Pilot: Bypass → Bhojipura */}
        <FirstPilot />

        {/* 6. Why NextRide */}
        <WhyNextRide />

        {/* 7. Coming Soon / Waiting List */}
        <WaitingListSection
          onOpenIntegrations={() => setIsIntegrationsOpen(true)}
        />

        {/* 8. Built by the Founders */}
        <FounderSection />
      </main>

      {/* 9. Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
        onOpenIntegrations={() => setIsIntegrationsOpen(true)}
      />

      {/* Legal Modals */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Cloud & Deployment Manager Modal (GitHub, Vercel, Supabase) */}
      <IntegrationsModal
        isOpen={isIntegrationsOpen}
        onClose={() => setIsIntegrationsOpen(false)}
      />
    </div>
  );
}
