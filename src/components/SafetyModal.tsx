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
          {/* SOS Big Button */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-red-950">{t.emergencyHelpline}</h4>
                <p className="text-xs text-red-700">Immediate Police & Ambulance response</p>
              </div>
            </div>
            <a
              href="tel:112"
              className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-500/30 transition-all shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 112 SOS</span>
            </a>
          </div>

          {/* Share Ride with Family Button */}
          <button
            onClick={handleShareWhatsApp}
            className="w-full p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-between text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-emerald-950">{t.shareWithFamily}</h4>
                <p className="text-xs text-emerald-700">Send live auto details & driver contact via WhatsApp</p>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold shrink-0">
              Share
            </span>
          </button>

          {/* Safety Pillars */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">NextRide Safety Standards</h4>
            
            <div className="grid grid-cols-1 gap-2.5">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Lock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">
                  <strong>4-Digit Boarding OTP:</strong> The ride will not begin until the driver enters your verified PIN.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">
                  <strong>100% KYC Verified Drivers:</strong> All e-rickshaw & auto drivers submit valid RC, license & identity documents.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <HeartHandshake className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">
                  <strong>Fixed Transparent Fares:</strong> Zero midnight surge pricing on rural routes.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Close Safety Toolkit
          </button>
        </div>
      </div>
    </div>
  );
};
