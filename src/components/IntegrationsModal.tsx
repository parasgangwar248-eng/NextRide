import React, { useState } from 'react';
import {
  X,
  Globe,
  Database,
  Copy,
  Check,
  Download,
  GitBranch,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  configureSupabase,
  getLocalWaitingList,
} from '../lib/supabase';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'supabase' | 'github' | 'vercel'>('supabase');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [supabaseSaveMsg, setSupabaseSaveMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl || !supabaseKey) return;
    const ok = configureSupabase(supabaseUrl.trim(), supabaseKey.trim());
    if (ok) {
      setSupabaseSaveMsg('Supabase configured successfully! Live sync enabled.');
      setTimeout(() => setSupabaseSaveMsg(''), 4000);
    }
  };

  const exportWaitingListCsv = () => {
    const list = getLocalWaitingList();
    if (list.length === 0) {
      alert('No entries in waiting list yet.');
      return;
    }
    const headers = ['Full Name', 'Mobile Number', 'Email', 'Interest Type', 'Route', 'Created At'];
    const rows = list.map((e) => [
      `"${e.full_name}"`,
      `"${e.mobile_number}"`,
      `"${e.email || ''}"`,
      `"${e.interest_type || 'commuter'}"`,
      `"${e.route_interest || 'Bypass -> Bhojipura'}"`,
      `"${e.created_at || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nextride_waiting_list_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sqlCode = `-- SQL Query to create NextRide waiting_list table in Supabase
CREATE TABLE IF NOT EXISTS public.waiting_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL UNIQUE,
    email TEXT,
    interest_type TEXT DEFAULT 'commuter',
    route_interest TEXT DEFAULT 'Bypass → Bhojipura',
    source TEXT DEFAULT 'web_coming_soon_landing',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON public.waiting_list 
FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select" ON public.waiting_list 
FOR SELECT TO anon, authenticated USING (true);`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">NextRide Platform Integrations</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Connected to GitHub, Vercel, and Supabase for continuous launch readiness.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'supabase'
                ? 'bg-[#1258D4] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase Database</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'github'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>GitHub Repository</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vercel'
                ? 'bg-black text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Vercel Deployment</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto py-5 space-y-4 text-xs sm:text-sm text-slate-600 pr-1 flex-1">
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isSupabaseConfigured ? 'bg-green-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      {isSupabaseConfigured
                        ? 'Supabase Cloud: Connected & Active'
                        : 'Storage Status: Resilient Local Storage Queue'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {isSupabaseConfigured
                        ? 'Waiting list entries write directly to your cloud database.'
                        : 'Entries are safely saved locally and ready to sync whenever credentials are added.'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={exportWaitingListCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#1258D4]" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Set Supabase Keys Live */}
              <form onSubmit={handleSaveSupabase} className="p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                  Connect Live Supabase Project
                </span>
                <p className="text-xs text-slate-500">
                  You can set your project URL and Anon key in <code className="bg-slate-100 px-1 py-0.5 rounded">.env</code> or paste them here:
                </p>
                <div>
                  <input
                    type="text"
                    placeholder="VITE_SUPABASE_URL (e.g. https://xyz.supabase.co)"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-[#1258D4] outline-hidden font-mono"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="VITE_SUPABASE_ANON_KEY (anon public key)"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-[#1258D4] outline-hidden font-mono"
                  />
                </div>
                {supabaseSaveMsg && (
                  <p className="text-xs text-green-600 font-semibold">{supabaseSaveMsg}</p>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1258D4] hover:bg-[#0D4BB8] text-white text-xs font-semibold cursor-pointer"
                >
                  Save & Enable Supabase
                </button>
              </form>

              {/* SQL Migration Schema */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Database Table Setup SQL</span>
                  <button
                    onClick={() => handleCopy(sqlCode, 'sql')}
                    className="text-xs text-[#1258D4] hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedCode === 'sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'sql' ? 'Copied SQL!' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] overflow-x-auto font-mono">
                  {sqlCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-xs">GitHub Repository Connection</div>
                  <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    parasgangwar248-eng
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  This repository is tracked with Git on the <code className="font-mono text-slate-800">main</code> branch.
                  Use the script below or push directly to GitHub.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs">PowerShell Push Command</span>
                  <button
                    onClick={() =>
                      handleCopy('.\\push-to-github.ps1 -RepoUrl "https://github.com/parasgangwar248-eng/nextride.git"', 'git-ps')
                    }
                    className="text-xs text-[#1258D4] hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedCode === 'git-ps' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'git-ps' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono">
                  .\push-to-github.ps1 -RepoUrl "https://github.com/parasgangwar248-eng/nextride.git"
                </pre>
              </div>

              <div>
                <span className="font-bold text-slate-900 text-xs block mb-1.5">Standard Git CLI Commands</span>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono space-y-1">
                  git remote add origin https://github.com/parasgangwar248-eng/nextride.git{'\n'}
                  git branch -M main{'\n'}
                  git push -u origin main
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-xs">Vercel Deployment Setup</div>
                  <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    vercel.json Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Optimized for instant zero-config deployment to Vercel with SPA rewrite rules and fast global CDN.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs">Deploy via Vercel CLI</span>
                  <button
                    onClick={() => handleCopy('npx vercel --prod', 'vercel-cli')}
                    className="text-xs text-[#1258D4] hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedCode === 'vercel-cli' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'vercel-cli' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono">
                  npx vercel --prod
                </pre>
              </div>

              <div>
                <span className="font-bold text-slate-900 text-xs block mb-1.5">Deploy via Vercel Web Dashboard</span>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600">
                  <li>Push your repository to GitHub using the GitHub tab.</li>
                  <li>Go to <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-[#1258D4] underline">vercel.com/new</a>.</li>
                  <li>Import <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">nextride</code>.</li>
                  <li>Add environment variables <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>.</li>
                  <li>Click <strong>Deploy</strong>. Every git push to main will automatically deploy!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">NextRide Bareilly Pilot Deployment Stack</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
