import React, { useState } from 'react';
import { UserProfile, UserRole, Language } from '../lib/types';
import { translations } from '../lib/translations';
import { DEMO_USERS } from '../lib/mockData';
import { getSupabaseClient } from '../lib/supabaseClient';
import { Lock, Mail, User, Phone, MapPin, Car, Zap, ArrowRight, Sparkles, Languages, ShieldCheck, Download, Compass, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { InstallPwaButton } from './InstallPwaButton';

interface AuthGatewayProps {
  onLoginSuccess: (user: UserProfile) => void;
  onExploreAsGuest: () => void;
  lang: Language;
  onToggleLang: () => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  onLoginSuccess,
  onExploreAsGuest,
  lang,
  onToggleLang,
}) => {
  const t = translations[lang];
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>('traveller');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [villageTown, setVillageTown] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemoLogin = (demoUser: UserProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess(demoUser);
      setIsLoading(false);
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        if (isSignUp) {
          const { data, error: signUpErr } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                role: role,
                phone: phone,
                village_town: villageTown,
              }
            }
          });

          if (signUpErr) throw signUpErr;

          if (data.user) {
            const newProfile: UserProfile = {
              id: data.user.id,
              email: data.user.email || email,
              full_name: fullName || 'NextRide Member',
              phone: phone || '+91 98000 00000',
              role: role,
              village_town: villageTown || 'Rural Hub',
              rating: 5.0,
              total_trips: 0
            };
            onLoginSuccess(newProfile);
          }
        } else {
          // Sign In
          const { data, error: signInErr } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (signInErr) throw signInErr;

          if (data.user) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            const loggedInProfile: UserProfile = profileData || {
              id: data.user.id,
              email: data.user.email || email,
              full_name: data.user.user_metadata?.full_name || 'NextRide User',
              phone: data.user.user_metadata?.phone || '+91 98000 00000',
              role: data.user.user_metadata?.role || role,
              village_town: data.user.user_metadata?.village_town || 'Rural Hub',
              rating: 4.95,
              total_trips: 15
            };
            onLoginSuccess(loggedInProfile);
          }
        }
      } catch (err: any) {
        console.error('Supabase Auth Error:', err);
        setError(err.message || 'Authentication failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local demo mode fallback
      setTimeout(() => {
        const localUser: UserProfile = {
          id: `usr-${Date.now()}`,
          email: email || (role === 'driver' ? 'driver@nextride.in' : 'traveller@nextride.in'),
          full_name: fullName || (isSignUp ? fullName : (role === 'driver' ? 'Kailash Meena' : 'Anita Sharma')),
          phone: phone || '+91 99881 77263',
          role: role,
          village_town: villageTown || 'Rampur Village Chowk',
          rating: 4.95,
          total_trips: isSignUp ? 0 : 20
        };
        setIsLoading(false);
        onLoginSuccess(localUser);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Lighting Gradients */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] bg-brand-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[450px] h-[450px] bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar on Login Page */}
      <header className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-lg shadow-brand-500/30 border-2 border-white/20">
            <img src="/logo.jpg" alt="NextRide" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
              Next<span className="text-brand-400">Ride</span>
            </span>
            <p className="text-[10px] text-blue-200 font-semibold hidden xs:block">
              {t.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
            title="भाषा बदलें"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-300" />
            <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          <InstallPwaButton variant="navbar" />
        </div>
      </header>

      {/* Main Login / Sign Up Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-4">
        <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn">
          
          {/* Card Top Banner */}
          <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-blue-800 p-6 text-white text-center relative">
            <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-3 shadow-lg border-2 border-white/30">
              <img src="/logo.jpg" alt="NextRide" className="w-full h-full object-cover" />
            </div>

            <h2 className="text-2xl font-black tracking-tight">
              {t.tagline}
            </h2>
            <p className="text-xs text-blue-100 mt-1 font-medium">
              {t.ruralMobility}
            </p>

            {/* Role Switcher: Traveller vs Driver */}
            <div className="grid grid-cols-2 gap-2 mt-5 bg-black/25 p-1 rounded-2xl backdrop-blur-md border border-white/10">
              <button
                type="button"
                onClick={() => setRole('traveller')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all ${
                  role === 'traveller'
                    ? 'bg-white text-brand-900 shadow-md scale-[1.02]'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'सवारी (Traveller)' : 'I am a Traveller'}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('driver')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all ${
                  role === 'driver'
                    ? 'bg-white text-brand-900 shadow-md scale-[1.02]'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'चालक (Driver)' : 'I am a Driver'}</span>
              </button>
            </div>
          </div>

          {/* Form Tabs (Sign In vs Create New Account) */}
          <div className="p-6">
            <div className="flex border-b border-slate-100 mb-5">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 pb-3 text-sm font-black text-center border-b-2 transition-all ${
                  !isSignUp
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {lang === 'hi' ? 'साइन इन (Sign In)' : 'Sign In'}
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 pb-3 text-sm font-black text-center border-b-2 transition-all ${
                  isSignUp
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {lang === 'hi' ? 'नया खाता बनाएं' : 'Create Account'}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Registration Extra Fields */}
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      {lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={role === 'driver' ? 'e.g. Kailash Meena' : 'e.g. Anita Sharma'}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      {lang === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 99881 77263"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      {lang === 'hi' ? 'गांव / कस्बा' : 'Village / Town'}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={villageTown}
                        onChange={(e) => setVillageTown(e.target.value)}
                        placeholder="e.g. Rampur Village Chowk"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  {lang === 'hi' ? 'ईमेल पता' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  {lang === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {isSignUp
                        ? (role === 'driver' ? 'Register as Driver' : 'Create Traveller Account')
                        : 'Sign In to NextRide'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Demo Logins */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-2.5 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                1-Click Quick Demo Login
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin(DEMO_USERS[2])}
                  className="p-2.5 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-blue-50/50 text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <img src={DEMO_USERS[2].avatar_url} alt="Anita" className="w-7 h-7 rounded-full object-cover" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-slate-900 truncate">Anita (Traveller)</p>
                      <p className="text-[10px] text-slate-500 font-bold">1-Click Login</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin(DEMO_USERS[0])}
                  className="p-2.5 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-blue-50/50 text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <img src={DEMO_USERS[0].avatar_url} alt="Kailash" className="w-7 h-7 rounded-full object-cover" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-slate-900 truncate">Kailash (Driver)</p>
                      <p className="text-[10px] text-emerald-600 font-extrabold">E-Rickshaw</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Explore as Guest Link */}
            <div className="mt-4 pt-3 text-center border-t border-slate-100">
              <button
                type="button"
                onClick={onExploreAsGuest}
                className="text-xs font-extrabold text-slate-500 hover:text-brand-600 flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <span>Continue as Guest / Explore Rides First</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="p-4 text-center text-xs text-slate-500 z-10">
        © {new Date().getFullYear()} NextRide. Bharat's Rural E-Rickshaw & Auto Network.
      </footer>
    </div>
  );
};
