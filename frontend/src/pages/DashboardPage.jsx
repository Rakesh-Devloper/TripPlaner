import React, { useState } from 'react';
import { HeroPlanner } from '../components/HeroPlanner';
import { StatsCards } from '../components/StatsCards';
import { WeatherForecastWidget } from '../components/WeatherForecastWidget';
import { MonthlyTripCalendar } from '../components/MonthlyTripCalendar';
import { RecommendedDestinations } from '../components/RecommendedDestinations';
import { ItineraryCard } from '../components/ItineraryCard';
import { PopularTrips } from '../components/PopularTrips';
import { RightSidebar } from '../components/RightSidebar';
import { InteractiveTravelMap } from '../components/InteractiveTravelMap';
import { MapPin, Navigation, Compass, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardPage = () => {
  const { savedPlaces, setActivePage, isDarkMode } = useApp();
  const [mapTab, setMapTab] = useState('routes');

  return (
    <div id="main-dashboard-content" className="w-full flex flex-col xl:flex-row gap-6">
      {/* Main Content Center Area */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Hero AI Trip Planner Banner */}
        <HeroPlanner />

        {/* 4 Stats Cards */}
        <StatsCards />

        {/* 7-Day Destination Weather Forecast Widget */}
        <WeatherForecastWidget />

        {/* Monthly Calendar View & Interactive Day Inspector */}
        <MonthlyTripCalendar />

        {/* Interactive Travel Map & Routes Section */}
        <div
          id="dashboard-interactive-map-card"
          className={`rounded-3xl p-5 border transition-all duration-300 space-y-4 ${
            isDarkMode
              ? 'bg-slate-900/90 border-slate-800 shadow-[0_0_25px_rgba(14,165,233,0.1)] text-slate-100'
              : 'bg-white border-slate-200/80 shadow-xs text-slate-900'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Interactive Travel Map & Route Visualizer
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Explore worldwide destinations, view your {savedPlaces.length} saved locations, and trace multi-day transit routes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActivePage('Explore Destinations')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800/90 hover:bg-sky-500/20 text-slate-200 hover:text-sky-300 border-slate-700 hover:border-sky-500/40 shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <span>Full Map Explorer</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Interactive Map Component */}
          <InteractiveTravelMap
            initialMode="routes"
            heightClass="h-[380px] sm:h-[430px]"
            showFullscreenButton={true}
          />
        </div>

        {/* Recommended Destinations Carousel */}
        <RecommendedDestinations />

        {/* 2-Column Section: AI Recommended Itinerary & Popular Trips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ItineraryCard />
          <PopularTrips />
        </div>
      </div>

      {/* Right Sidebar Column matching screenshot */}
      <RightSidebar />
    </div>
  );
};

