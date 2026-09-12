import React from 'react';
import { Language } from '../lib/types';
import { translations } from '../lib/translations';
import { ShieldCheck, PhoneCall, Share2, AlertTriangle, X, Lock, CheckCircle2, HeartHandshake } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const t = translations[lang];

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🛡️ *NextRide Safety Share*\nI am travelling on NextRide shared auto.\nTrack my ride status and driver details on NextRide platform: https://nextride.vercel.app`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-6 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-brand-700 to-blue-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 p-2.5 flex items-center justify-center backdrop-blur-md border border-white/20">
              <ShieldCheck className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">{t.safetyToolkit}</h2>
              <p className="text-xs text-blue-100 mt-0.5">24x7 Rider Protection for Rural & Town Commutes</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Safety Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {lang === 'hi' ? 'नेक्स्टराइड सुरक्षा मानक' : 'NextRide Safety Standards'}
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900">
                    {lang === 'hi' ? '4-अंकों का बोर्डिंग ओटीपी' : '4-Digit Boarding OTP'}
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'hi' ? 'सवारी तब तक शुरू नहीं होगी जब तक चालक आपका सही पिन दर्ज नहीं करता।' : 'The ride will not begin until the driver enters your verified 4-digit PIN.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900">
                    {lang === 'hi' ? '100% सत्यापित चालक साथी' : '100% KYC Verified Drivers'}
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'hi' ? 'सभी ई-रिक्शा और ऑटो चालक सत्यापन और वैध पहचान पत्र के बाद ही जुड़ते हैं।' : 'All e-rickshaw & auto drivers submit valid RC, license & identity documents.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900">
                    {lang === 'hi' ? 'पारदर्शी व निश्चित किराया' : 'Fixed Transparent Fares'}
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'hi' ? 'ग्रामीण मार्गों पर कोई अतिरिक्त सर्ज चार्ज नहीं, केवल उचित किराया।' : 'Zero surge pricing on rural routes, fair standard rates.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            {lang === 'hi' ? 'बंद करें (Close)' : 'Close Safety Standards'}
          </button>
        </div>
      </div>
    </div>
  );
};
