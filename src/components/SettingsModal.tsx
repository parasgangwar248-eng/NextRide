import React, { useState } from 'react';
import { UserProfile, UserRole, Language } from '../lib/types';
import { translations } from '../lib/translations';
import { Settings, UserPlus, Users, LogOut, Check, X, Shield, Globe, Database, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { DEMO_USERS } from '../lib/mockData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSwitchUser: (user: UserProfile) => void;
  onCreateAnotherAccount: () => void;
  onLogout: () => void;
  onOpenSupabaseGuide: () => void;
  lang: Language;
  onToggleLang: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
  onCreateAnotherAccount,
  onLogout,
  onOpenSupabaseGuide,
  lang,
  onToggleLang,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden my-6 animate-fadeIn text-slate-900">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-700 to-blue-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 p-2.5 flex items-center justify-center backdrop-blur-md border border-white/20">
              <Settings className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-lg font-black">{lang === 'hi' ? 'सेटिंग्स और खाते' : 'Settings & Accounts'}</h3>
              <p className="text-xs text-blue-100">{lang === 'hi' ? 'खाता बदलें या नया खाता जोड़ें' : 'Manage profile & switch accounts'}</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Active Profile Card */}
          {currentUser && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentUser.avatar_url ? (
                  <img src={currentUser.avatar_url} alt={currentUser.full_name} className="w-12 h-12 rounded-full object-cover border-2 border-brand-500" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-black text-base flex items-center justify-center">
                    {currentUser.full_name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-slate-900">{currentUser.full_name}</h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{currentUser.email || currentUser.phone}</p>
                  <p className="text-[11px] text-brand-600 font-semibold">{currentUser.village_town || 'Rampur Village'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Feature: Create Another Account */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {lang === 'hi' ? 'खाता प्रबंधन' : 'Account Management'}
            </h4>

            <button
              onClick={() => {
                onClose();
                onCreateAnotherAccount();
              }}
              className="w-full p-3.5 bg-gradient-to-r from-brand-50 to-blue-50 hover:from-brand-100 hover:to-blue-100 border border-brand-200 rounded-2xl flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-black text-xs sm:text-sm text-brand-950">
                    {lang === 'hi' ? '+ नया खाता बनाएं / जोड़ें' : '+ Create Another Account'}
                  </h5>
                  <p className="text-[11px] text-brand-700">
                    {lang === 'hi' ? 'नया चालक या सवारी प्रोफाइल बनाएं' : 'Register another passenger or driver profile'}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Switch Between Saved Profiles */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {lang === 'hi' ? 'प्रोफ़ाइल बदलें' : 'Switch Profiles'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onSwitchUser(DEMO_USERS[2]); // Anita (Traveller)
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentUser?.id === DEMO_USERS[2].id
                    ? 'border-brand-600 bg-brand-50/70 font-bold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img src={DEMO_USERS[2].avatar_url} alt="Anita" className="w-7 h-7 rounded-full object-cover" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-slate-900 truncate">Anita (Traveller)</p>
                    <p className="text-[10px] text-slate-500">Passenger</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  onSwitchUser(DEMO_USERS[0]); // Kailash (Driver)
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentUser?.id === DEMO_USERS[0].id
                    ? 'border-brand-600 bg-brand-50/70 font-bold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img src={DEMO_USERS[0].avatar_url} alt="Kailash" className="w-7 h-7 rounded-full object-cover" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-slate-900 truncate">Kailash (Driver)</p>
                    <p className="text-[10px] text-emerald-600 font-bold">E-Rickshaw</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* App Preferences */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {lang === 'hi' ? 'प्राथमिकताएं' : 'Preferences'}
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onToggleLang}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-bold">{lang === 'en' ? 'हिंदी भाषा' : 'English'}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenSupabaseGuide();
                }}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold">Supabase DB</span>
                </div>
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
