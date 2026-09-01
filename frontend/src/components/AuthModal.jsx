import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Camera,
  LogIn,
  UserPlus,
  Trash2,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateInitialsAvatar, readFileAsDataURL } from '../lib/avatars';

export const AuthModal = () => {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    loginWithProfile,
    savedProfiles,
    removeSavedProfile,
    signup,
    quickDemoLogin,
  } = useApp();

  const [mode, setMode] = useState(authModalMode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatarTab, setAvatarTab] = useState('initials');
  const [initialsColor, setInitialsColor] = useState('indigo');
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Sync mode with prop
  React.useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
  }, [authModalMode]);

  if (!authModalOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      setUploadedPhoto(dataUrl);
      setAvatarTab('upload');
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to upload photo');
    }
  };

  const matchedSavedProfile = email
    ? savedProfiles.find((p) => p.user.email.trim().toLowerCase() === email.trim().toLowerCase())
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.message || 'Invalid email or password.');
          setLoading(false);
          return;
        }
      } else if (mode === 'signup') {
        let finalAvatar = generateInitialsAvatar(name || 'Traveler', initialsColor);
        if (avatarTab === 'upload' && uploadedPhoto) {
          finalAvatar = uploadedPhoto;
        }

        const res = await signup(name, email, password, finalAvatar);
        if (!res.success) {
          setError(res.message || 'Could not complete registration.');
          setLoading(false);
          return;
        }
      } else if (mode === 'forgot') {
        setSuccessMsg(`Password reset instructions have been sent to ${email}`);
        setLoading(false);
        setTimeout(() => {
          setMode('login');
          setSuccessMsg(null);
        }, 3000);
        return;
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        id="auth-modal-dialog"
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col relative my-auto overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all z-20 cursor-pointer shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Modal Header Banner */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 pt-6 pb-5 text-white text-center relative overflow-hidden shrink-0">
          <div className="w-11 h-11 mx-auto rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2.5 shadow-inner ring-1 ring-white/20">
            {mode === 'login' ? (
              <LogIn className="w-5 h-5 text-white" />
            ) : mode === 'signup' ? (
              <UserPlus className="w-5 h-5 text-white" />
            ) : (
              <Lock className="w-5 h-5 text-white" />
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight">
            {mode === 'login' ? 'Sign In to TripPlanner AI' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h3>
          <p className="text-xs text-indigo-100 mt-1 font-normal max-w-xs mx-auto">
            {mode === 'login'
              ? 'Access your saved profile, custom avatar, itineraries, and bookings.'
              : mode === 'signup'
              ? 'Join thousands of travelers planning unforgettable journeys with AI.'
              : 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-slate-100 bg-slate-50/70 p-1 shrink-0">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              New Account
            </button>
          </div>
        )}

        {/* Form Body - Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* PREVIOUS PROFILES SECTION (Visible on Login tab when profiles exist) */}
          {mode === 'login' && savedProfiles.length > 0 && (
            <div className="mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Previous Profiles ({savedProfiles.length})
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Click to resume</span>
              </div>

              <div className="space-y-2">
                {savedProfiles.map((item) => (
                  <div
                    key={item.user.email}
                    className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/70 hover:border-indigo-200 rounded-2xl transition-all group"
                  >
                    <button
                      type="button"
                      onClick={() => loginWithProfile(item)}
                      className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer"
                    >
                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0 shadow-sm"
                        onError={(e) => {
                          // Fallback to monogram if photo fails
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                            {item.user.name}
                          </span>
                          {item.user.plan === 'pro' && (
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
                              PRO
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {item.user.email}
                        </span>
                        {item.trips && item.trips.length > 0 && (
                          <span className="text-[10px] text-slate-400 block">
                            {item.trips.length} saved trip{item.trips.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 pl-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => loginWithProfile(item)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSavedProfile(item.user.email)}
                        title="Remove from saved profiles"
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Or sign in with email
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    required
                    className="w-full text-xs py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  required
                  className="w-full text-xs py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white font-medium"
                />
              </div>

              {/* Matched profile indicator */}
              {matchedSavedProfile && mode === 'login' && (
                <div className="mt-2 p-2 bg-indigo-50/80 border border-indigo-100 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={matchedSavedProfile.user.avatar}
                      alt={matchedSavedProfile.user.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-300 shrink-0"
                    />
                    <span className="text-[11px] text-indigo-900 font-semibold truncate">
                      Saved profile found: <strong>{matchedSavedProfile.user.name}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => loginWithProfile(matchedSavedProfile)}
                    className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2 py-0.5 rounded-md border border-indigo-200 shrink-0 cursor-pointer shadow-2xs"
                  >
                    Quick Resume
                  </button>
                </div>
              )}
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase text-slate-700">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full text-xs py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white font-medium"
                  />
                </div>
              </div>
            )}

            {/* Profile Avatar Selection on Signup */}
            {mode === 'signup' && (
              <div className="pt-2 border-t border-slate-100">
                <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1.5">
                  Choose Profile Picture
                </label>

                {/* Avatar sub-tabs */}
                <div className="flex gap-1.5 mb-2.5">
                  <button
                    type="button"
                    onClick={() => setAvatarTab('initials')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                      avatarTab === 'initials' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Monogram Initials
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarTab('upload')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                      avatarTab === 'upload' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Upload Photo
                  </button>
                </div>

                {avatarTab === 'initials' && (
                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <img
                      src={generateInitialsAvatar(name || 'TU', initialsColor)}
                      alt="Initials preview"
                      className="w-10 h-10 rounded-full shadow-sm"
                    />
                    <div className="flex-1">
                      <span className="text-[10px] text-slate-500 font-semibold block mb-1">Color Scheme:</span>
                      <div className="flex gap-1.5">
                        {['indigo', 'emerald', 'sunset', 'rose', 'ocean', 'violet'].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setInitialsColor(color)}
                            className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                              initialsColor === color ? 'scale-125 ring-2 ring-offset-1 ring-slate-400' : ''
                            }`}
                            style={{
                              backgroundColor:
                                color === 'indigo'
                                  ? '#4f46e5'
                                  : color === 'emerald'
                                  ? '#059669'
                                  : color === 'sunset'
                                  ? '#ea580c'
                                  : color === 'rose'
                                  ? '#e11d48'
                                  : color === 'ocean'
                                  ? '#0284c7'
                                  : '#7c3aed',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {avatarTab === 'upload' && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300 text-center">
                    {uploadedPhoto ? (
                      <div className="flex items-center justify-center gap-3">
                        <img src={uploadedPhoto} alt="Uploaded preview" className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500" />
                        <label className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                          Change photo
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                        <Camera className="w-5 h-5 text-slate-400" />
                        <span className="text-xs font-bold text-indigo-600">Select Image File</span>
                        <span className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB</span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : mode === 'signup' ? (
                <>
                  <span>Create Account</span>
                  <Check className="w-3.5 h-3.5" />
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={quickDemoLogin}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl text-xs font-bold border border-slate-200/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Continue with Demo Traveler Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
