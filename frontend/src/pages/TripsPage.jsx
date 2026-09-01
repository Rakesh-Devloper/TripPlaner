import React, { useState } from 'react';
import { Plus, Calendar, Users, MapPin, Trash2, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/BackButton';

export const TripsPage = () => {
  const { trips, setActiveTrip, setActivePage, deleteTripById } = useApp();
  const [filter, setFilter] = useState('All');

  const filteredTrips = trips.filter((t) => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Planning':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="trips-management-page" className="space-y-6">
      {/* Top Breadcrumb / Back Button Bar */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Dashboard" fallbackPage="Dashboard" />
        <span className="text-xs font-semibold text-slate-400">My Trips</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Trips</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your past journeys, active itineraries, and upcoming adventures.
          </p>
        </div>

        <button
          onClick={() => setActivePage('AI Trip Planner')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(['All', 'Confirmed', 'Planning', 'Completed']).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-3xl border border-slate-200/70 shadow-xs hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image banner */}
              <div className="relative h-44 w-full bg-slate-100">
                <img
                  src={trip.image}
                  alt={trip.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${getStatusBadge(
                    trip.status
                  )}`}
                >
                  {trip.status}
                </span>

                <button
                  onClick={() => deleteTripById(trip.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-slate-500 hover:text-rose-500 hover:bg-white flex items-center justify-center transition-colors shadow-xs"
                  title="Delete Trip"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Trip Info */}
              <div className="p-5 space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-sky-600 text-xs font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{trip.destination}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1 tracking-tight">
                    {trip.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {trip.startDate} - {trip.endDate}
                    </span>
                  </div>
                  <span>{trip.days} Days</span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Preparation</span>
                    <span className="text-sky-700 font-bold">{trip.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 rounded-full"
                      style={{ width: `${trip.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Budget
                </span>
                <span className="text-sm font-extrabold text-slate-900">${trip.estimatedCost}</span>
              </div>

              <button
                onClick={() => {
                  setActiveTrip(trip);
                  setActivePage('Itineraries');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-sky-700 bg-white border border-slate-200 hover:bg-sky-50 hover:border-sky-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span>View Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
