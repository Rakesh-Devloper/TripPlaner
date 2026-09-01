import React from 'react';
import { useApp } from '../context/AppContext';

export const PopularTrips = () => {
  const { trips, setActiveTrip, setActivePage, activeTrip } = useApp();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
      case 'Planning':
        return 'bg-amber-50 text-amber-800 border-amber-200/70';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-sky-50 text-sky-800 border-sky-200/70';
    }
  };

  return (
    <div
      id="popular-trips-section"
      className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/70 shadow-xs flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Popular Trips</h3>
          <button
            id="view-all-trips-button"
            onClick={() => setActivePage('Trips')}
            className="text-xs font-bold text-sky-700 hover:text-sky-800 hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Trips List */}
        <div className="space-y-2.5">
          {trips.slice(0, 3).map((trip) => {
            const isSelected = activeTrip.id === trip.id;

            return (
              <div
                key={trip.id}
                id={`popular-trip-item-${trip.id}`}
                onClick={() => {
                  setActiveTrip(trip);
                }}
                className={`group p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-sky-300 bg-sky-50/70 shadow-xs'
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
                    <img
                      src={trip.image}
                      alt={trip.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Trip Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 tracking-tight truncate group-hover:text-sky-700 transition-colors">
                        {trip.title}
                      </h4>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${getStatusBadge(
                          trip.status
                        )}`}
                      >
                        {trip.status}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">
                      {trip.startDate} - {trip.endDate} • {trip.days} Days • {trip.travelers}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">
                    ${trip.estimatedCost}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">Est. total</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan New Trip Secondary CTA */}
      <button
        id="plan-new-trip-shortcut-button"
        onClick={() => setActivePage('AI Trip Planner')}
        className="w-full mt-3.5 py-2 px-3.5 rounded-xl text-xs font-bold text-sky-700 bg-sky-50/70 hover:bg-sky-100 border border-sky-200/70 transition-colors cursor-pointer text-center"
      >
        + Plan Another Trip with AI
      </button>
    </div>
  );
};
