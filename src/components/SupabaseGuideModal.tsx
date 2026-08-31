import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, Key, Server, Sparkles, X, ShieldCheck, HelpCircle } from 'lucide-react';
import { getSavedSupabaseConfig, saveSupabaseConfig, resetSupabaseClient } from '../lib/supabaseClient';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const currentConfig = getSavedSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql' | 'vercel'>('config');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && anonKey) {
      saveSupabaseConfig(url, anonKey);
      resetSupabaseClient();
      setStatusMessage('✓ Supabase credentials saved! Connecting to your live database...');
      setTimeout(() => {
        onConfigSaved();
        onClose();
      }, 1200);
    } else {
      saveSupabaseConfig('', '');
      resetSupabaseClient();
      setStatusMessage('Switched back to local demo storage mode.');
      setTimeout(() => {
        onConfigSaved();
        onClose();
      }, 1000);
    }
  };

  const sqlSchemaSnippet = `-- Run this in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('traveller', 'driver', 'admin')),
    village_town TEXT,
    avatar_url TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    total_trips INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    origin_name TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    intermediate_stops TEXT[] DEFAULT '{}',
    departure_time TEXT NOT NULL,
    price_per_seat NUMERIC(10, 2) NOT NULL DEFAULT 40.00,
    available_seats INTEGER NOT NULL DEFAULT 6,
    total_seats INTEGER NOT NULL DEFAULT 6,
    vehicle_type TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    traveller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    seats_booked INTEGER NOT NULL DEFAULT 1,
    total_fare NUMERIC(10, 2) NOT NULL,
    pickup_point TEXT NOT NULL,
    drop_point TEXT NOT NULL,
    passenger_name TEXT NOT NULL,
    passenger_phone TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Routes are viewable by everyone" ON public.routes;
CREATE POLICY "Routes are viewable by everyone" ON public.routes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view bookings" ON public.bookings;
CREATE POLICY "Users can view bookings" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert bookings" ON public.bookings;
CREATE POLICY "Users can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Drivers can insert routes" ON public.routes;
CREATE POLICY "Drivers can insert routes" ON public.routes FOR INSERT WITH CHECK (true);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-6 animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-700 to-blue-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 p-2.5 flex items-center justify-center backdrop-blur-md border border-white/20">
              <Database className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                Supabase & Database Setup
                <span className="text-xs bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-medium">
                  Fullstack Integration
                </span>
              </h2>
              <p className="text-xs text-blue-100 mt-1">
                Store user accounts, rural driver routes, and live traveller bookings securely in PostgreSQL.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-5 border-b border-white/15 pb-0">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all ${
                activeTab === 'config'
                  ? 'bg-white text-brand-900 shadow-sm'
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
            >
              1. Connect Credentials
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all ${
                activeTab === 'sql'
                  ? 'bg-white text-brand-900 shadow-sm'
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
            >
              2. SQL Schema Script
            </button>
            <button
              onClick={() => setActiveTab('vercel')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all ${
                activeTab === 'vercel'
                  ? 'bg-white text-brand-900 shadow-sm'
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
            >
              3. Vercel & GitHub Deploy
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'config' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">How to get these keys:</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-brand-600 underline font-semibold inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a> and create a free project named <strong>NextRide</strong>.</li>
                    <li>Go to <strong>Project Settings</strong> (gear icon) &gt; <strong>API</strong>.</li>
                    <li>Copy your <strong>Project URL</strong> and <strong>anon/public Key</strong> and paste below.</li>
                  </ol>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Supabase Project URL
                </label>
                <div className="relative">
                  <Server className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-project-id.supabase.co"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Supabase Anon / Public Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-xs"
                  />
                </div>
              </div>

              {statusMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl animate-fadeIn flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setUrl('');
                    setAnonKey('');
                    saveSupabaseConfig('', '');
                    resetSupabaseClient();
                    setStatusMessage('Switched back to local demo storage mode.');
                    setTimeout(() => {
                      onConfigSaved();
                      onClose();
                    }, 1000);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                >
                  Clear keys (Use Local Demo Mode)
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 transition-all"
                >
                  Save & Connect Database
                </button>
              </div>
            </form>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Open <strong>SQL Editor</strong> in Supabase dashboard, paste this script and click <strong>RUN</strong>:
                </p>
                <button
                  onClick={copySqlToClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-cyan-300 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-64 leading-relaxed border border-slate-800">
                {sqlSchemaSnippet}
              </pre>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>The complete schema is also saved in your project root as <code>supabase_schema.sql</code>.</span>
              </div>
            </div>
          )}

          {activeTab === 'vercel' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Deploying NextRide on GitHub & Vercel:</h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-600">
                  <li>
                    <strong>Push to GitHub:</strong>
                    <div className="mt-1 bg-slate-900 text-emerald-400 p-2.5 rounded-xl font-mono text-xs overflow-x-auto">
                      git init<br />
                      git add .<br />
                      git commit -m "Initial commit for NextRide PWA"<br />
                      git remote add origin https://github.com/your-username/nextride.git<br />
                      git push -u origin main
                    </div>
                  </li>
                  <li>
                    <strong>Connect on Vercel:</strong> Go to <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-brand-600 underline font-semibold">vercel.com/new</a> and import your NextRide GitHub repo.
                  </li>
                  <li>
                    <strong>Add Environment Variables:</strong> Under <strong>Environment Variables</strong> in Vercel settings, add:
                    <div className="mt-1 bg-slate-900 text-blue-200 p-2.5 rounded-xl font-mono text-[11px]">
                      VITE_SUPABASE_URL = your_supabase_project_url<br />
                      VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
                    </div>
                  </li>
                  <li>
                    Click <strong>Deploy</strong>! Your NextRide PWA is now live worldwide with auto SSL & instant home-screen installs!
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
