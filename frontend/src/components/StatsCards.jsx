import React from 'react';
import { Briefcase, Globe, PiggyBank, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StatsCards = () => {
  const { user, trips, isDarkMode } = useApp();

  const stats = [
    {
      id: 'stat-trips-planned',
      title: 'Trips Planned',
      value: user.tripsCount || trips.length || 12,
      badge: '+3 this month',
      badgeColor: isDarkMode
        ? 'text-sky-300 font-bold bg-sky-500/20 border border-sky-500/40 shadow-[0_0_10px_rgba(14,165,233,0.3)]'
        : 'text-sky-800 font-bold bg-sky-50 border border-sky-200/60',
      icon: Briefcase,
      iconBg: isDarkMode
        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
        : 'bg-sky-50 text-sky-600 border border-sky-100',
      glowBorder: 'hover:dark:border-sky-500/50 hover:dark:shadow-[0_0_20px_rgba(14,165,233,0.2)]',
    },
    {
      id: 'stat-countries-visited',
      title: 'Countries Visited',
      value: user.countriesVisited || 8,
      badge: '+2 this year',
      badgeColor: isDarkMode
        ? 'text-indigo-300 font-bold bg-indigo-500/20 border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
        : 'text-indigo-800 font-bold bg-indigo-50 border border-indigo-200/60',
      icon: Globe,
      iconBg: isDarkMode
        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
        : 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      glowBorder: 'hover:dark:border-indigo-500/50 hover:dark:shadow-[0_0_20px_rgba(99,102,241,0.2)]',
    },
    {
      id: 'stat-money-saved',
      title: 'Money Saved',
      value: `$${(user.moneySaved || 1250).toLocaleString()}`,
      badge: 'AI Optimized',
      badgeColor: isDarkMode
        ? 'text-emerald-300 font-bold bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
        : 'text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/60',
      icon: PiggyBank,
      iconBg: isDarkMode
        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        : 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      glowBorder: 'hover:dark:border-emerald-500/50 hover:dark:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    },
    {
      id: 'stat-co2-saved',
      title: 'CO₂ Reduced',
      value: `${user.co2Saved || 120} kg`,
      badge: 'Eco Routes',
      badgeColor: isDarkMode
        ? 'text-teal-300 font-bold bg-teal-500/20 border border-teal-500/40 shadow-[0_0_10px_rgba(20,184,166,0.3)]'
        : 'text-teal-800 font-bold bg-teal-50 border border-teal-200/60',
      icon: Leaf,
      iconBg: isDarkMode
        ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
        : 'bg-teal-50 text-teal-600 border border-teal-100',
      glowBorder: 'hover:dark:border-teal-500/50 hover:dark:shadow-[0_0_20px_rgba(20,184,166,0.2)]',
    },
  ];

  return (
    <div id="dashboard-statistics-grid" className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mt-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            id={stat.id}
            className={`rounded-2xl p-3.5 sm:p-4 border transition-all duration-300 flex flex-col justify-between ${
              isDarkMode
                ? `bg-slate-900/90 border-slate-800 text-slate-100 shadow-[0_0_20px_rgba(0,0,0,0.3)] ${stat.glowBorder}`
                : 'bg-white border-slate-200/70 shadow-xs hover:shadow-md hover:border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-md ${stat.badgeColor}`}>
                {stat.badge}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {stat.title}
              </p>
              <h3 className="text-lg sm:text-xl font-extrabold leading-tight mt-0.5">
                {stat.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};
