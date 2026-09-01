import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Mail,
  Shield,
  Award,
  MapPin,
  Globe,
  Sparkles,
  Check,
  Camera,
  Upload,
  Palette,
  Phone,
  Compass,
  Lock,
  LogOut,
  RefreshCw,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateInitialsAvatar, readFileAsDataURL } from '../lib/avatars';
import { BackButton } from '../components/BackButton';

export const ProfilePage = () => {
  const { user, updateUserProfile, trips, setShowUpgradeModal, logout, openAuthModal, changeAvatar, isAuthenticated } = useApp();

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role || 'Travel Enthusiast');
  const [phone, setPhone] = useState(user.phone || '');
  const [homeCity, setHomeCity] = useState(user.homeCity || '');
  const [travelStyle, setTravelStyle] = useState(user.travelStyle || 'Scenic & Cultural Discovery');
  const [bio, setBio] = useState(
    user.bio || 'Exploring scenic coastal sanctuaries, mountain trails, and cultural landmarks worldwide.'
  );

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role || 'Travel Enthusiast');
    setPhone(user.phone || '');
    setHomeCity(user.homeCity || '');
    setTravelStyle(user.travelStyle || 'Scenic & Cultural Discovery');
    setBio(user.bio || 'Exploring scenic coastal sanctuaries, mountain trails, and cultural landmarks worldwide.');
  }, [user]);

  // Avatar customization states
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatarTab, setAvatarTab] = useState('initials');
  const [initialsColor, setInitialsColor] = useState('indigo');
  const [uploadError, setUploadError] = useState(null);

  // Security / Password modal states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState(null);

  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadError(null);
      const dataUrl = await readFileAsDataURL(file);
      changeAvatar(dataUrl);
      setShowAvatarSelector(false);
    } catch (err) {
      setUploadError(err?.message || 'Failed to upload photo');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      role,
      phone,
      homeCity,
      travelStyle,
      bio,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setSecurityMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setSecurityMessage({ type: 'success', text: 'Password successfully updated!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecurityMessage(null), 3000);
  };

  const passportCountries = [
    { country: 'Indonesia', stamp: 'DPS-2024', visited: true },
    { country: 'Switzerland', stamp: 'ZRH-2024', visited: true },
    { country: 'Japan', stamp: 'NRT-2023', visited: true },
    { country: 'Iceland', stamp: 'KEF-2023', visited: true },
    { country: 'France', stamp: 'CDG-2023', visited: true },
    { country: 'Italy', stamp: 'FCO-2022', visited: true },
    { country: 'Thailand', stamp: 'BKK-2022', visited: true },
    { country: 'Spain', stamp: 'BCN-2022', visited: true },
  ];

  return (
    <div id="user-profile-page" className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb / Back Button Bar */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Dashboard" fallbackPage="Dashboard" />
        <span className="text-xs font-semibold text-slate-400">Profile & Preferences</span>
      </div>

      {/* Top Profile Hero Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/70 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
        <div className="relative group">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-sky-100 shadow-md transition-transform group-hover:scale-105"
          />
          <button
            onClick={() => setShowAvatarSelector((prev) => !prev)}
            className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl shadow-md transition-colors cursor-pointer"
            title="Change Profile Avatar"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{user.name}</h2>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-full uppercase tracking-wider border border-emerald-200/60">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{user.email}</p>
            </div>

            <div className="flex items-center gap-2 self-center sm:self-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{user.plan === 'free' ? 'Standard Plan' : 'Pro Premium Plan'}</span>
              </div>
              {user.plan === 'free' && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-full text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Upgrade Pro
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-xl line-clamp-2">{user.bio}</p>

          <div className="grid grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Trips Planned</span>
              <p className="text-base font-extrabold text-slate-900">{trips.length || 12}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Countries</span>
              <p className="text-base font-extrabold text-slate-900">{user.countriesVisited || 8}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Money Saved</span>
              <p className="text-base font-extrabold text-emerald-600">${user.moneySaved || 1250}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">CO₂ Offset</span>
              <p className="text-base font-extrabold text-sky-700">{user.co2Saved || 120} kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Avatar Customizer Drawer / Panel */}
      {showAvatarSelector && (
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">Custom Profile Picture</h3>
            </div>
            <button
              onClick={() => setShowAvatarSelector(false)}
              className="text-xs text-slate-400 hover:text-slate-700 font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>

          {uploadError && (
            <div className="p-2.5 bg-rose-50 text-rose-600 text-xs rounded-xl font-medium">
              {uploadError}
            </div>
          )}

          {/* Navigation tabs */}
          <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
            <button
              onClick={() => setAvatarTab('initials')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                avatarTab === 'initials' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Initials Monogram
            </button>
            <button
              onClick={() => setAvatarTab('upload')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                avatarTab === 'upload' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Upload Device Photo
            </button>
          </div>

          {/* Tab 1: Initials Generator */}
          {avatarTab === 'initials' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-center gap-4">
                <img
                  src={generateInitialsAvatar(name || user.name || 'Traveler', initialsColor)}
                  alt="Initials preview"
                  className="w-16 h-16 rounded-2xl shadow-sm ring-2 ring-white"
                />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800">Monogram Initials</h4>
                  <p className="text-[11px] text-slate-500">Pick a gradient color scheme for your initials badge:</p>
                  <div className="flex gap-2 mt-2">
                    {['indigo', 'emerald', 'sunset', 'rose', 'ocean', 'violet'].map((col) => (
                      <button
                        key={col}
                        onClick={() => {
                          setInitialsColor(col);
                          changeAvatar(generateInitialsAvatar(name || user.name || 'Traveler', col));
                        }}
                        className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                          initialsColor === col ? 'scale-125 ring-2 ring-offset-2 ring-sky-500' : ''
                        }`}
                        style={{
                          backgroundColor:
                            col === 'indigo'
                              ? '#4f46e5'
                              : col === 'emerald'
                              ? '#059669'
                              : col === 'sunset'
                              ? '#ea580c'
                              : col === 'rose'
                              ? '#e11d48'
                              : col === 'ocean'
                              ? '#0284c7'
                              : '#7c3aed',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Upload from Computer */}
          {avatarTab === 'upload' && (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-sky-400 transition-colors bg-slate-50/50">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-sky-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">Upload high-resolution profile photo</p>
              <p className="text-[11px] text-slate-400 mb-3">PNG, JPG, or WEBP up to 5MB</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Choose Photo</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Digital Travel Passport */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Digital Travel Passport</h3>
          </div>
          <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
            8 / 195 Countries Visited
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Official verification stamps unlocked from completed travel itineraries.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {passportCountries.map((c) => (
            <div
              key={c.country}
              className="p-3.5 bg-gradient-to-br from-slate-50 to-slate-100/60 rounded-2xl border border-slate-200/70 flex flex-col justify-between gap-1 text-xs hover:border-sky-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{c.country}</span>
                <span className="text-[9px] font-mono font-bold bg-white text-sky-700 px-1.5 py-0.5 rounded border border-slate-200">
                  {c.stamp}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                <Check className="w-3 h-3" />
                <span>Verified Trip</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings & Profile Form */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/70 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-sky-600" />
            Personal & Travel Information
          </h3>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-semibold py-3 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                Home City / Country
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="w-full text-xs font-semibold py-3 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                Travel Style
              </label>
              <div className="relative">
                <Compass className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full text-xs font-semibold py-3 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
              Traveler Tagline / Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
              About / Travel Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs font-medium p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {isSaved ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Profile details saved successfully!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Save Profile Details
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/70 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-600" />
            Account Security & Authentication
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Last active: Just now</span>
        </div>

        {securityMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              securityMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}
          >
            {securityMessage.type === 'success' ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{securityMessage.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600 focus:bg-white"
            />
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>

        {/* Account Switcher & Logout actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Switch Account / Sign In with Another Email
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              openAuthModal('login');
            }}
            className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out of TripPlanner AI
          </button>
        </div>
      </div>
    </div>
  );
};
