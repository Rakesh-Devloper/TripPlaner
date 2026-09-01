
import React from 'react';
import {
  Calendar,
  DollarSign,
  ChevronRight,
  ListTodo,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ItineraryCard = () => {
  const { currentTrip, setActivePage } = useApp();

  if (!currentTrip) return null;

  const days = Array.isArray(currentTrip.days) ? currentTrip.days : [];

  return (
    <div
      id="current-trip-itinerary-card"
      className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100/90 flex flex-col justify-between"
    >
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />

            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {currentTrip.status || 'Active Itinerary'}
            </span>
          </div>

          <button
            id="view-full-itinerary-button"
            onClick={() => setActivePage('AIPlanner')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer transition-colors group"
          >
            <span>Full Schedule</span>

            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Trip Banner */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative w-full sm:w-28 h-24 sm:h-24 rounded-2xl overflow-hidden shadow-inner shrink-0 bg-slate-900">
            <img
              src={
                currentTrip.coverImage ||
                'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80'
              }
              alt={currentTrip.title || 'Trip destination'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            <div className="absolute bottom-1.5 left-2 right-2 text-[10px] text-white font-bold truncate">
              {currentTrip.destination || 'Your Destination'}
            </div>
          </div>

          {/* Trip Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
              {currentTrip.title || 'My Trip'}
            </h3>

            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
              {currentTrip.summary || 'Your personalized travel itinerary.'}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />

                <span>
                  {currentTrip.startDate || 'Start Date'} –{' '}
                  {currentTrip.endDate || 'End Date'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />

                <span className="font-bold text-slate-800">
                  $
                  {currentTrip.totalEstimatedCost ||
                    currentTrip.spentAmount ||
                    1149}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Highlights */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Daily Highlights ({days.length} Days)
          </span>

          <button
            onClick={() => setActivePage('Checklist')}
            className="text-xs font-semibold text-slate-500 hover:text-sky-600 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ListTodo className="w-3.5 h-3.5" />

            <span>Trip Checklist</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {days.slice(0, 3).map((day, idx) => (
            <div
              key={day.id || idx}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-sky-200 transition-colors"
            >
              <span className="text-[10px] font-extrabold text-sky-600 uppercase block">
                {day.title || `Day ${idx + 1}`}
              </span>

              <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
                {day.subtitle || 'Explore your destination'}
              </p>

              <span className="text-[10px] text-slate-400 block mt-1">
                {Array.isArray(day.activities)
                  ? day.activities.length
                  : 0}{' '}
                activities scheduled
              </span>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {days.length === 0 && (
          <div className="text-center py-6 text-sm text-slate-400">
            No daily itinerary available yet.
          </div>
        )}
      </div>
    </div>
  );
};

