import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' ? (
              <Shield className="w-5 h-5 text-[#1258D4]" />
            ) : (
              <FileText className="w-5 h-5 text-[#1258D4]" />
            )}
            <h3 className="text-xl font-bold text-slate-900">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-6 space-y-4 text-sm text-slate-600 leading-relaxed pr-2">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>Last Updated: October 2026</strong>
              </p>
              <p>
                NextRide ("we", "our", or "us") is dedicated to protecting your personal information.
                This Privacy Policy explains how we collect and use information through our pre-launch
                waiting list website.
              </p>
              <h4 className="font-bold text-slate-900 text-base pt-2">1. Information We Collect</h4>
              <p>
                When you join our waiting list, we collect your name, mobile phone number, and optionally your
                email address and commute preference.
              </p>
              <h4 className="font-bold text-slate-900 text-base pt-2">2. How We Use Your Information</h4>
              <p>
                We use this information exclusively to communicate launch announcements, pilot route updates
                for the Bypass → Bhojipura corridor in Bareilly, Uttar Pradesh, and prioritize early access invitations.
              </p>
              <h4 className="font-bold text-slate-900 text-base pt-2">3. Data Protection</h4>
              <p>
                We will not sell, rent, or trade your contact information to third-party marketing companies.
                All information is securely stored with encryption in transit and at rest.
              </p>
              <h4 className="font-bold text-slate-900 text-base pt-2">4. Your Rights</h4>
              <p>
                You may request removal from the waiting list at any time by contacting our founding team.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Last Updated: October 2026</strong>
              </p>
              <p>
                Welcome to NextRide. By accessing our landing page and submitting your details to the waiting list,
                you agree to these Terms of Service.
              </p>
              <h4 className="font-bold text-slate-900 text-base pt-2">1. Pre-Launch Nature of Service</h4>
              <p>
                NextRide is currently preparing for launch. Joining the waiting list grants priority notification
                and early onboarding privileges, but does not guarantee immediate vehicle availability or contractual
                ride fulfillment until our official pilot commences in Bareilly, Uttar Pradesh.
              </p>
              <h4 className="font-bold text-slate-900 text-base pt-2">2. Accurate Contact Information</h4>
              <p>
                You agree to provide authentic and accurate contact information so we can deliver launch alerts
                regarding the Bypass → Bhojipura route.
              </p>
              <h4 className="font-bold text-slate-900 text-base pt-2">3. Intellectual Property</h4>
              <p>
                All trademarks, logo assets, software, and brand designs associated with NextRide remain the
                exclusive property of NextRide and its founders.
              </p>
              <h4 className="font-bold text-slate-900 text-base pt-2">4. Contact & Jurisdiction</h4>
              <p>
                This agreement is governed by the laws of India, with jurisdiction in Uttar Pradesh.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
