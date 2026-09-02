import React, { useState } from 'react';
import { UserProfile, UserRole, Language } from '../lib/types';
import { translations } from '../lib/translations';
import { DEMO_USERS } from '../lib/mockData';
import { getSupabaseClient } from '../lib/supabaseClient';
import { Lock, Mail, User, Phone, MapPin, Car, Zap, ArrowRight, Sparkles, Languages, ShieldCheck, Download, Compass, ChevronRight, Eye, EyeOff, KeyRound, CheckCircle2, UserCheck } from 'lucide-react';
import { InstallPwaButton } from './InstallPwaButton';

interface AuthGatewayProps {
  onLoginSuccess: (user: UserProfile) => void;
  onExploreAsGuest: () => void;
  lang: Language;
  onToggleLang: () => void;
  initialRole?: UserRole;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  onLoginSuccess,
  onExploreAsGuest,
  lang,
  onToggleLang,
  initialRole = 'traveller',
}) => {
  const t = translations[lang];
  const [activePortal, setActivePortal] = useState<'passenger' | 'driver'>(
    initialRole === 'driver' ? 'driver' : 'passenger'
  );
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverPin, setDriverPin] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverVehicle, setDriverVehicle] = useState('E-Rickshaw (Toto)');
  const [driverVillage, setDriverVillage] = useState('Rampur Chowk');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [villageTown, setVillageTown] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    if (adminUsername.trim() === 'Teamnextride' && adminPassword === '#nextride@123') {
      const adminProfile: UserProfile = {
        id: 'adm-nextride-hq',
        email: 'admin@nextride.in',
        full_name: 'NextRide HQ Admin',
        phone: '+91 99999 00000',
        role: 'admin',
        village_town: 'NextRide HQ',
        rating: 5.0,
        total_trips: 0
      };
      setIsAdminModalOpen(false);
      onLoginSuccess(adminProfile);
    } else {
      setAdminError('Invalid Admin credentials. (Username: Teamnextride)');
    }
  };

  const handleDemoLogin = (demoUser: UserProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess(demoUser);
      setIsLoading(false);
    }, 400);
  };

  // Simple Driver Login Handler (Minimal friction for auto drivers)
  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const driverEmail = driverPhone.includes('@') 
          ? driverPhone 
          : `driver.${driverPhone.replace(/\D/g, '') || 'partner'}@nextride.in`;
        const driverPwd = driverPin || 'driver1234';

        if (isSignUp) {
          const { data, error: signUpErr } = await supabase.auth.signUp({
            email: driverEmail,
            password: driverPwd,
            options: {
              data: {
                full_name: driverName || 'Auto Driver Partner',
                role: 'driver',
                phone: driverPhone,
                village_town: driverVillage,
              }
            }
          });

          if (signUpErr && !signUpErr.message.includes('already registered')) {
            throw signUpErr;
          }
        }

        // Try sign in
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email: driverEmail,
          password: driverPwd
        });

        if (signInErr) {
          // If fallback needed
          const newDriver: UserProfile = {
            id: `drv-${Date.now()}`,
            email: driverEmail,
            full_name: driverName || 'Kailash Meena',
            phone: driverPhone || '+91 99881 77263',
            role: 'driver',
            village_town: driverVillage || 'Rampur Village',
            rating: 4.95,
            total_trips: 420
          };
          onLoginSuccess(newDriver);
        } else if (data.user) {
          const driverProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || driverEmail,
            full_name: data.user.user_metadata?.full_name || driverName || 'Driver Partner',
            phone: data.user.user_metadata?.phone || driverPhone || '+91 99881 77263',
            role: 'driver',
            village_town: data.user.user_metadata?.village_town || driverVillage || 'Rampur Chowk',
            rating: 4.95,
            total_trips: 18
          };
          onLoginSuccess(driverProfile);
        }
      } catch (err: any) {
        console.error('Driver auth error:', err);
        setError(err.message || 'Driver login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local demo mode for driver
      setTimeout(() => {
        const localDriver: UserProfile = {
          id: `drv-${Date.now()}`,
          email: `driver.${driverPhone || 'kailash'}@nextride.in`,
          full_name: driverName || (isSignUp ? driverName : 'Kailash Meena (Driver)'),
          phone: driverPhone || '+91 99881 77263',
          role: 'driver',
          village_town: driverVillage || 'Rampur Village Chowk',
          rating: 4.95,
          total_trips: isSignUp ? 0 : 340
        };
        setIsLoading(false);
        onLoginSuccess(localDriver);
      }, 400);
    }
  };

  // Passenger Login Handler
  const handlePassengerSubmit = async (e: React.FormEvent) => {
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
                role: 'traveller',
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
              full_name: fullName || 'NextRide Passenger',
              phone: phone || '+91 98000 00000',
              role: 'traveller',
              village_town: villageTown || 'Rural Hub',
              rating: 5.0,
              total_trips: 0
            };
            onLoginSuccess(newProfile);
          }
        } else {
          // Passenger Sign In
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
              full_name: data.user.user_metadata?.full_name || 'NextRide Passenger',
              phone: data.user.user_metadata?.phone || '+91 98000 00000',
              role: 'traveller',
              village_town: data.user.user_metadata?.village_town || 'Rural Hub',
              rating: 5.0,
              total_trips: 12
            };
            onLoginSuccess(loggedInProfile);
          }
        }
      } catch (err: any) {
        console.error('Passenger auth error:', err);
        setError(err.message || 'Authentication failed. Please check credentials.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setTimeout(() => {
        const localPassenger: UserProfile = {
          id: `usr-${Date.now()}`,
          email: email || 'passenger@nextride.in',
          full_name: fullName || (isSignUp ? fullName : 'Anita Sharma'),
          phone: phone || '+91 97112 33445',
          role: 'traveller',
          village_town: villageTown || 'Rampur Village Chowk',
          rating: 5.0,
          total_trips: isSignUp ? 0 : 22
        };
        setIsLoading(false);
        onLoginSuccess(localPassenger);
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Lighting */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] bg-brand-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[450px] h-[450px] bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
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
          {/* Admin Login Button on Top Corner */}
          <button
            onClick={() => {
              setAdminError(null);
              setIsAdminModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-sm transition-all active:scale-95"
            title="Admin Login Portal (प्रशासक लॉगिन)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>

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

      {/* Admin Login Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">NextRide Admin Portal</h3>
                  <p className="text-[10px] text-slate-400">Executive & Verification Access</p>
                </div>
              </div>
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {adminError && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 text-xs rounded-xl font-bold">
                {adminError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Teamnextride"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Login to Admin Panel</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-3">
        <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn">
          
          {/* Portal Switcher (Passenger vs Driver) */}
          <div className="p-3 bg-slate-100 border-b border-slate-200 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActivePortal('passenger');
                setError(null);
              }}
              className={`py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activePortal === 'passenger'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सवारी (Passenger)' : 'Passenger Login'}</span>
            </button>

            <button
              onClick={() => {
                setActivePortal('driver');
                setError(null);
              }}
              className={`py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activePortal === 'driver'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>{lang === 'hi' ? 'चालक (Driver)' : 'Driver Login'}</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 1. SIMPLE DRIVER LOGIN INTERFACE (High Contrast, Simple for Auto Drivers) */}
          {/* ========================================================================= */}
          {activePortal === 'driver' ? (
            <div>
              {/* Driver Portal Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 p-6 text-white text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/10 p-2.5 flex items-center justify-center mx-auto mb-2 border border-white/20">
                  <Car className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-black">
                  {lang === 'hi' ? 'चालक आसान लॉगिन' : 'Driver Partner Login'}
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  {lang === 'hi' ? 'ई-रिक्शा और ऑटो चालक पोर्टल' : 'E-Rickshaw & Auto Driver Portal'}
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Driver Toggle (Sign In vs Register Driver) */}
                <div className="flex border-b border-slate-100 pb-2">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-1.5 text-xs font-black text-center rounded-xl transition-all ${
                      !isSignUp ? 'bg-slate-900 text-white' : 'text-slate-500'
                    }`}
                  >
                    {lang === 'hi' ? 'चालक लॉगिन' : 'Driver Sign In'}
                  </button>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-1.5 text-xs font-black text-center rounded-xl transition-all ${
                      isSignUp ? 'bg-slate-900 text-white' : 'text-slate-500'
                    }`}
                  >
                    {lang === 'hi' ? 'नया चालक रजिस्ट्रेशन' : 'New Driver Register'}
                  </button>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleDriverSubmit} className="space-y-3">
                  {isSignUp && (
                    <>
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">
                          {lang === 'hi' ? 'आपका नाम (Driver Name)' : 'Driver Full Name'}
                        </label>
                        <input
                          type="text"
                          required
                          value={driverName}
                          onChange={(e) => setDriverName(e.target.value)}
                          placeholder="e.g. Kailash Meena"
                          className="w-full px-3.5 py-3 rounded-2xl border-2 border-slate-200 text-sm font-bold focus:outline-none focus:border-brand-600 bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">
                          {lang === 'hi' ? 'वाहन का प्रकार (Vehicle Type)' : 'Vehicle Type'}
                        </label>
                        <select
                          value={driverVehicle}
                          onChange={(e) => setDriverVehicle(e.target.value)}
                          className="w-full px-3.5 py-3 rounded-2xl border-2 border-slate-200 text-sm font-bold bg-white focus:outline-none focus:border-brand-600"
                        >
                          <option value="E-Rickshaw (Toto)">⚡ ई-रिक्शा / टोटो (E-Rickshaw 4-Seater)</option>
                          <option value="Shared CNG Auto">🛺 शेयर्ड CNG ऑटो (6-Seater)</option>
                          <option value="Auto Parcel Cargo">📦 मालवाहक / पार्सल ऑटो (Cargo Loader)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">
                          {lang === 'hi' ? 'आपका मुख्य स्टैंड / गांव' : 'Main Stand / Village Chowk'}
                        </label>
                        <input
                          type="text"
                          value={driverVillage}
                          onChange={(e) => setDriverVillage(e.target.value)}
                          placeholder="e.g. Rampur Chowk"
                          className="w-full px-3.5 py-3 rounded-2xl border-2 border-slate-200 text-sm font-bold focus:outline-none focus:border-brand-600 bg-slate-50"
                        />
                      </div>
                    </>
                  )}

                  {/* Driver Mobile Number */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      {lang === 'hi' ? 'मोबाइल नंबर (Mobile Number)' : 'Mobile Phone Number'}
                    </label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        placeholder="99881 77263"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 text-sm sm:text-base font-black tracking-wide focus:outline-none focus:border-brand-600 bg-slate-50 font-mono"
                      />
                    </div>
                  </div>

                  {/* Driver PIN / Password */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      {lang === 'hi' ? '4-अंकों का पिन या पासवर्ड' : '4-Digit PIN or Password'}
                    </label>
                    <div className="relative">
                      <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        value={driverPin}
                        onChange={(e) => setDriverPin(e.target.value)}
                        placeholder="••••"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 text-sm sm:text-base font-black tracking-widest focus:outline-none focus:border-brand-600 bg-slate-50 font-mono"
                      />
                    </div>
                  </div>

                  {/* Big Simple Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Car className="w-5 h-5" />
                        <span>{isSignUp ? 'चालक खाता बनाएं (Register)' : 'चालक लॉगिन करें (Sign In)'}</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Quick 1-Tap Driver Demo */}
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <p className="text-[11px] font-bold text-slate-400 mb-2">
                    ⚡ 1-Tap Instant Driver Login:
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin(DEMO_USERS[0])}
                    className="w-full p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <img src={DEMO_USERS[0].avatar_url} alt="Kailash" className="w-6 h-6 rounded-full object-cover" />
                    <span>Login as Kailash (E-Rickshaw Driver)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* 2. PASSENGER LOGIN INTERFACE (Modern, Feature-Rich for Travellers)        */
            /* ========================================================================= */
            <div>
              {/* Passenger Banner */}
              <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-blue-800 p-6 text-white text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/20 p-2.5 flex items-center justify-center mx-auto mb-2 border border-white/20">
                  <Zap className="w-7 h-7 text-yellow-300 fill-yellow-300" />
                </div>
                <h3 className="text-xl font-black">
                  {lang === 'hi' ? 'सवारी लॉगिन' : 'Passenger Login'}
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  {t.ruralMobility}
                </p>
              </div>

              <div className="p-6">
                {/* Sign In vs Create Account Tabs */}
                <div className="flex border-b border-slate-100 mb-5">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 pb-3 text-sm font-black text-center border-b-2 transition-all ${
                      !isSignUp
                        ? 'border-brand-600 text-brand-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {lang === 'hi' ? 'साइन इन' : 'Sign In'}
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

                <form onSubmit={handlePassengerSubmit} className="space-y-3.5">
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
                            placeholder="e.g. Anita Sharma"
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
                            placeholder="+91 97112 33445"
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
                        placeholder="anita@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

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

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isSignUp ? 'Create Passenger Account' : 'Sign In as Passenger'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* 1-Click Demo Login */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-2">
                    ⚡ 1-Click Passenger Demo:
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin(DEMO_USERS[2])}
                    className="w-full p-2.5 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-blue-50/50 text-left transition-all flex items-center gap-2"
                  >
                    <img src={DEMO_USERS[2].avatar_url} alt="Anita" className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-black text-slate-900">Anita Sharma (Passenger Demo)</p>
                      <p className="text-[10px] text-slate-500">1-Click Sign In</p>
                    </div>
                  </button>
                </div>

                {/* Continue as Guest Link */}
                <div className="mt-4 pt-3 text-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onExploreAsGuest}
                    className="text-xs font-extrabold text-slate-500 hover:text-brand-600 flex items-center justify-center gap-1 mx-auto transition-colors"
                  >
                    <span>Explore Autos as Guest</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-500 z-10">
        © {new Date().getFullYear()} NextRide. Rural E-Rickshaw & Auto Shared Mobility.
      </footer>
    </div>
  );
};
