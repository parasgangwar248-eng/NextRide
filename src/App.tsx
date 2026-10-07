import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WhatIsNextRide } from './components/WhatIsNextRide';
import { HowItWorks } from './components/HowItWorks';
import { WhyNextRide } from './components/WhyNextRide';
import { WaitingListSection } from './components/WaitingListSection';
import { FounderSection } from './components/FounderSection';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModals';

export default function App() {
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

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
      <Navbar onJoinClick={scrollToWaitingList} />

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

        {/* 5. Why NextRide */}
        <WhyNextRide />

        {/* 6. Coming Soon / Waiting List */}
        <WaitingListSection />

        {/* 7. Built by the Founders */}
        <FounderSection />
      </main>

      {/* 8. Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
      />

      {/* Legal Modals */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
