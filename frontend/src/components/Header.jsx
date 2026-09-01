import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Bell, ChevronDown, CheckCheck, User, LogOut, Sparkles, Menu, LogIn, UserPlus, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from './BackButton';

export const Header = ({ onOpenMobileMenu }) => {
  const {
    user,
    isAuthenticated,
    openAuthModal,
    logout,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    activePage,
    setActivePage,
    isDarkMode,
    toggleDarkMode,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="top-dashboard-header"
      className="w-full flex items-center justify-between py-4 px-4 md:px-8 bg-transparent"
    >
      {/* Left side: Greeting and Back Button */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile menu trigger */}
        <button
          id="mobile-menu-button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-white/80 border border-slate-200/60 shadow-sm"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Reusable Back Button */}
        <BackButton />

        <div>
          <h2 className="text-lg md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {activePage === 'Dashboard' ? (
              <>
                Hi, {isAuthenticated && user.name ? user.name : 'Traveler'}!{' '}
                <span className="inline-block animate-bounce text-xl">👋</span>
              </>
            ) : (
              <span>{activePage}</span>
            )}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">
            {activePage === 'Dashboard'
              ? "Let's plan your next unforgettable journey"
              : `Explore and manage your ${activePage.toLowerCase()}`}
          </p>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2.5 md:gap-3">
        {/* Dark/Light mode button */}
        <button
          id="theme-toggle-button"
          onClick={toggleDarkMode}
          className={`w-9 h-9 rounded-full border shadow-xs flex items-center justify-center transition-all cursor-pointer ${
            isDarkMode
              ? 'bg-slate-800 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:bg-slate-700'
              : 'bg-white border-slate-200/80 text-slate-600 hover:text-sky-600 hover:border-sky-300'
          }`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-sky-600" />}
        </button>

        {/* Notifications Button & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className={`w-9 h-9 rounded-full border shadow-xs flex items-center justify-center transition-all relative cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-sky-400 hover:border-sky-500/50 hover:shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                : 'bg-white border-slate-200/80 text-slate-600 hover:text-sky-600 hover:border-sky-300'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span
                id="notification-badge-count"
                className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs"
              >
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              id="notifications-dropdown-menu"
              className={`absolute right-0 mt-2 w-80 md:w-96 rounded-2xl shadow-2xl border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] text-slate-100'
                  : 'bg-white border-slate-100 text-slate-800'
              }`}
            >
              <div
                className={`p-3.5 border-b flex items-center justify-between ${
                  isDarkMode ? 'border-slate-800 bg-slate-800/60' : 'border-slate-100 bg-sky-50/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sky-500" />
                  <span className="font-bold text-sm">Notifications</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isDarkMode ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {unreadNotificationsCount} new
                  </span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-sky-500 hover:text-sky-400 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className={`max-h-72 overflow-y-auto divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100/80'}`}>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-3.5 transition-colors cursor-pointer flex gap-3 ${
                      isDarkMode
                        ? !notif.read
                          ? 'bg-sky-950/40 hover:bg-slate-800/80'
                          : 'hover:bg-slate-800/40'
                        : !notif.read
                        ? 'bg-sky-50/30 hover:bg-slate-50'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        !notif.read
                          ? isDarkMode
                            ? 'bg-sky-400 ring-4 ring-sky-900/50 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                            : 'bg-sky-600 ring-4 ring-sky-100'
                          : 'bg-slate-500'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold">{notif.title}</h5>
                        <span className="text-[10px] text-slate-400">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-2.5 border-t text-center ${isDarkMode ? 'border-slate-800 bg-slate-800/30' : 'border-slate-100 bg-slate-50/50'}`}>
                <button
                  onClick={() => {
                    setActivePage('Settings');
                    setShowNotifications(false);
                  }}
                  className="text-xs text-slate-400 hover:text-sky-400 font-bold cursor-pointer"
                >
                  Configure notification preferences
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Authentication / Avatar Capsule */}
        {isAuthenticated ? (
          <div className="relative" ref={userRef}>
            <button
              id="user-profile-capsule-button"
              onClick={() => setShowUserDropdown((prev) => !prev)}
              className={`flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-full shadow-xs transition-all cursor-pointer border ${
                isDarkMode
                  ? 'bg-slate-800/90 border-slate-700 hover:border-sky-500/50 hover:shadow-[0_0_15px_rgba(14,165,233,0.2)] text-slate-200'
                  : 'bg-white border-slate-200/80 hover:border-sky-300 text-slate-800'
              }`}
              aria-label="User Account Menu"
            >
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-400/50 shadow-xs"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold leading-tight">{user.name}</div>
                <div className="text-[10px] text-sky-500 font-bold leading-none">{user.role || 'Member'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* User Account Dropdown */}
            {showUserDropdown && (
              <div
                id="user-account-dropdown"
                className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl border p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] text-slate-200'
                    : 'bg-white border-slate-100 text-slate-800'
                }`}
              >
                <div className={`px-3 py-2.5 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <p className="text-xs font-bold">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <div
                    className={`mt-1.5 flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${
                      isDarkMode
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'text-sky-800 bg-sky-50'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {user.plan === 'free' ? 'Standard Plan' : 'Pro Premium Plan'}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActivePage('Profile');
                      setShowUserDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl cursor-pointer ${
                      isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    My Profile & Avatar
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('Settings');
                      setShowUserDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl cursor-pointer ${
                      isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                    Plan & Preferences
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      openAuthModal('login');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl cursor-pointer ${
                      isDarkMode ? 'text-sky-400 hover:bg-slate-800' : 'text-sky-700 hover:bg-sky-50'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-sky-500" />
                    Switch Account
                  </button>
                </div>

                <div className={`pt-1 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                      openAuthModal('login');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-500 rounded-xl cursor-pointer ${
                      isDarkMode ? 'hover:bg-rose-950/40' : 'hover:bg-rose-50'
                    }`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal('login')}
              className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-xs cursor-pointer flex items-center gap-1.5 border transition-all ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-sky-500/50'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:text-sky-700'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.35)] cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
