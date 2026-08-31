import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Car, Compass, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile, UserRole } from '../lib/types';
import { DEMO_USERS } from '../lib/mockData';
import { getSupabaseClient } from '../lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'traveller',
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [villageTown, setVillageTown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoLogin = (demoUser: UserProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess(demoUser);
      setIsLoading(false);
      onClose();
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
              full_name: fullName || 'NextRide User',
              phone: phone || '+91 98000 00000',
              role: role,
              village_town: villageTown || 'Rural Hub',
              rating: 5.0,
              total_trips: 0
            };
            onLoginSuccess(newProfile);
            onClose();
          }
        } else {
          // Login
          const { data, error: signInErr } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (signInErr) throw signInErr;

          if (data.user) {
            // Fetch profile
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
              rating: 4.9,
              total_trips: 12
            };
            onLoginSuccess(loggedInProfile);
            onClose();
          }
        }
      } catch (err: any) {
        console.error('Supabase Auth Error:', err);
        setError(err.message || 'Authentication failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local demo mode authentication fallback
      setTimeout(() => {
        const localUser: UserProfile = {
          id: `usr-${Date.now()}`,
          email: email || (role === 'driver' ? 'driver@nextride.in' : 'traveller@nextride.in'),
          full_name: fullName || (isSignUp ? fullName : (role === 'driver' ? 'Ramesh Patel' : 'Anita Sharma')),
          phone: phone || '+91 98765 00000',
          role: role,
          village_town: villageTown || 'Rampur Village',
          rating: 4.9,
          total_trips: isSignUp ? 0 : 15
        };
        setIsLoading(false);
        onLoginSuccess(localUser);
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden my-6 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-blue-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="NextRide Logo" className="w-12 h-12 rounded-2xl shadow-lg border-2 border-white/20 object-cover" />
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">NextRide</h2>
              <p className="text-xs text-blue-100 font-medium">Your next ride, on time, every time</p>
            </div>
          </div>

          {/* Role selector buttons */}
          <div className="grid grid-cols-2 gap-2 mt-5 bg-black/20 p-1 rounded-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => setRole('traveller')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                role === 'traveller'
                  ? 'bg-white text-brand-900 shadow-md scale-[1.02]'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>I am a Traveller</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                role === 'driver'
                  ? 'bg-white text-brand-900 shadow-md scale-[1.02]'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>I am a Driver</span>
            </button>
          </div>
        </div>

        {/* Tab & Form */}
        <div className="p-6">
          <div className="flex border-b border-slate-100 mb-5">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all ${
                !isSignUp ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all ${
                isSignUp ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={role === 'driver' ? 'e.g. Ramesh Patel' : 'e.g. Anita Sharma'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Village / Town / Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={villageTown}
                      onChange={(e) => setVillageTown(e.target.value)}
                      placeholder="e.g. Rampur Village, Block A"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? `Register as ${role === 'driver' ? 'Driver' : 'Traveller'}` : 'Login to NextRide'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick 1-Click Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin(DEMO_USERS[2])}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-blue-50/50 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <img src={DEMO_USERS[2].avatar_url} alt="Traveller" className="w-7 h-7 rounded-full object-cover" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate">Anita (Traveller)</p>
                    <p className="text-[10px] text-slate-500">Demo Account</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin(DEMO_USERS[0])}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-blue-50/50 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <img src={DEMO_USERS[0].avatar_url} alt="Driver" className="w-7 h-7 rounded-full object-cover" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate">Ramesh (Driver)</p>
                    <p className="text-[10px] text-slate-500">Bolero Jeep</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
