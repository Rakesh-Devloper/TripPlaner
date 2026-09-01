import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Compass,
  Briefcase,
  CheckSquare,
  CalendarCheck,
  Heart,
  PieChart,
  ListOrdered,
  Bot,
  Star,
  User,
  Settings,
  Send,
  Luggage,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { key: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'AI Trip Planner', label: 'AI Trip Planner', icon: Sparkles },
  { key: 'Explore Destinations', label: 'Explore Destinations', icon: Compass },
  { key: 'Trips', label: 'Trips', icon: Briefcase, badge: 3 },
  { key: 'Pre-Trip Checklist', label: 'Pre-Trip Checklist', icon: CheckSquare },
  { key: 'Bookings', label: 'Bookings', icon: CalendarCheck },
  { key: 'Saved Places', label: 'Saved Places', icon: Heart },
  { key: 'Budget Tracker', label: 'Budget Tracker', icon: PieChart },
  { key: 'Itineraries', label: 'Itineraries', icon: ListOrdered },
  { key: 'Travel Assistant', label: 'Travel Assistant', icon: Bot },
  { key: 'Reviews', label: 'Reviews', icon: Star },
  { key: 'Profile', label: 'Profile', icon: User },
  { key: 'Settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { activePage, setActivePage, trips, user, isAuthenticated, openAuthModal, checklists } = useApp();

  const pendingChecklistCount = checklists.filter((i) => !i.completed).length;

  return (
    <aside
      id="sidebar-navigation"
      aria-label="Main Navigation"
      className={`fixed top-0 bottom-0 left-0 z-40 w-[240px] bg-white border-r border-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full'
      } select-none`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto p-5 scrollbar-thin">
        {/* Logo and Brand Header */}
        <div
          id="brand-header"
          onClick={() => {
            setActivePage('Dashboard');
            if (onCloseMobile) onCloseMobile();
          }}
          className="flex items-center gap-3 mb-6 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
            <Send className="w-5 h-5 -rotate-45 ml-0.5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
              TripPlanner AI
            </h1>
            <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">Smart & Memorable</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1" aria-label="Sidebar Menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            const badgeCount =
              item.key === 'Trips'
                ? trips.length
                : item.key === 'Pre-Trip Checklist'
                ? pendingChecklistCount > 0
                  ? pendingChecklistCount
                  : undefined
                : item.badge;

            return (
              <button
                key={item.key}
                id={`nav-item-${item.key.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  setActivePage(item.key);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left cursor-pointer ${
                  isActive
                    ? 'bg-sky-50/90 text-sky-950 font-bold border border-sky-200/80 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {badgeCount !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sleek User Profile / Auth Footer */}
      <div className="p-4 border-t border-slate-100 mt-auto">
        {isAuthenticated ? (
          <button
            onClick={() => {
              setActivePage('Profile');
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-sky-200 group-hover:ring-sky-400 transition-all shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-sky-700 transition-colors">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {user.role || 'Member'}
              </p>
            </div>
          </button>
        ) : (
          <button
            onClick={() => {
              openAuthModal('login');
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 hover:bg-sky-50/80 border border-slate-200/60 hover:border-sky-200 transition-all text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs ring-2 ring-sky-50 shadow-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-sky-700 group-hover:text-sky-800 truncate">
                Sign In / Register
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                Access your profile
              </p>
            </div>
          </button>
        )}
      </div>
    </aside>
  );
};
