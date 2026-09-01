import React, { useEffect, useState } from 'react';
import { Download, CheckCircle, Smartphone, Share, PlusSquare, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallPwaButton: React.FC<{ variant?: 'navbar' | 'banner' | 'card' }> = ({ variant = 'navbar' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone/installed mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt event (Chromium, Android Chrome, Edge, Desktop Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) {
      alert('NextRide is already installed on your device! Check your home screen or apps list.');
      return;
    }

    if (deferredPrompt) {
      // Trigger native browser install prompt
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback for browsers that require manual install
      setShowIOSModal(true);
    }
  };

  if (isInstalled && variant === 'navbar') {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs font-semibold">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>Installed</span>
      </div>
    );
  }

  return (
    <>
      {variant === 'navbar' && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-brand-600 to-blue-700 hover:from-brand-500 hover:to-blue-600 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-brand-500/25 hover:shadow-lg transition-all duration-200 active:scale-95 group animate-pulse-subtle"
          title="Install NextRide on your phone or computer home screen"
        >
          <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform">
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="hidden xs:inline font-bold">Install App</span>
          <span className="xs:hidden">Install</span>
        </button>
      )}

      {variant === 'banner' && !isInstalled && (
        <div className="bg-gradient-to-r from-blue-900 via-brand-700 to-blue-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-blue-400/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 p-2 flex items-center justify-center backdrop-blur-md shrink-0 border border-white/20">
              <Smartphone className="w-6 h-6 text-blue-200 animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-white">
                Install NextRide on your Phone
              </h4>
              <p className="text-xs text-blue-100/90 mt-0.5">
                Fast 1-tap access from your Home Screen with offline route viewing and instant booking updates.
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-5 py-2.5 bg-white text-brand-700 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4 text-brand-600" />
            <span>Install NextRide App</span>
          </button>
        </div>
      )}

      {/* Manual Install Instructions Modal (for iOS or non-automated browsers) */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.jpg" alt="NextRide" className="w-12 h-12 rounded-2xl shadow-md" />
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Install NextRide App</h3>
                <p className="text-xs text-slate-500">Your next ride, on time, every time</p>
              </div>
            </div>

            <div className="space-y-3 my-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <p>
                  {isIOS ? (
                    <>
                      Tap the <strong className="text-slate-900 inline-flex items-center gap-1"><Share className="w-3.5 h-3.5 text-brand-600 inline" /> Share button</strong> in Safari's bottom toolbar.
                    </>
                  ) : (
                    <>
                      Open your browser's menu (<strong>⋮</strong> or <strong>⋯</strong> in the top right corner).
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <p>
                  Scroll down and tap <strong className="text-slate-900 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 text-brand-600 inline" /> "Add to Home Screen"</strong> or <strong>"Install App"</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <p>
                  Tap <strong>"Add"</strong> in the top right. NextRide will now launch just like a native app directly from your phone screen!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
