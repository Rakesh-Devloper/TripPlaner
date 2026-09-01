import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Calendar, Users, MapPin, ChevronDown, Plus, Minus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const tripTypes = [
  'Weekend Getaway',
  'Family Trip',
  'Adventure',
  'Honeymoon',
  'Relaxation',
  'Cultural Tour',
];

export const HeroPlanner = () => {
  const { triggerAIPlan, isGeneratingAI } = useApp();

  const [destination, setDestination] = useState('Bali, Indonesia');
  const [startDate, setStartDate] = useState('May 25, 2025');
  const [endDate, setEndDate] = useState('May 31, 2025');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedType, setSelectedType] = useState('Relaxation');
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);

  const travelersDropdownRef = useRef(null);

  const getTravelersString = () => {
    const total = adults + children;
    if (children === 0) {
      return total === 1 ? '1 Traveler' : `${total} Travelers`;
    }
    const adultLabel = adults === 1 ? '1 Adult' : `${adults} Adults`;
    const childLabel = children === 1 ? '1 Child' : `${children} Kids`;
    return `${adultLabel}, ${childLabel}`;
  };

  const travelers = getTravelersString();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        travelersDropdownRef.current &&
        !travelersDropdownRef.current.contains(event.target)
      ) {
        setShowTravelersDropdown(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowTravelersDropdown(false);
      }
    };

    if (showTravelersDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTravelersDropdown]);

  const setPreset = (numAdults, numChildren) => {
    setAdults(numAdults);
    setChildren(numChildren);
    setShowTravelersDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTravelersDropdown(false);
    triggerAIPlan({
      destination: destination || 'Bali, Indonesia',
      startDate,
      endDate,
      travelers,
      tripType: selectedType,
      budgetLevel: 'Moderate',
    });
  };

  return (
    <div
      id="hero-ai-trip-planner"
      className="relative w-full rounded-[24px] overflow-hidden shadow-xl shadow-indigo-100/50 bg-slate-900 min-h-[300px] flex flex-col justify-between p-6 sm:p-8"
    >
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85"
        alt="Travel scenic landscape"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.75] scale-105 transform hover:scale-100 transition-transform duration-1000"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-indigo-950/60 pointer-events-none" />

      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold mb-2.5 border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI-Powered Travel Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
          Where do you want to go?
        </h2>
        <p className="text-white/90 text-xs sm:text-sm font-medium mt-1 drop-shadow">
          Let AI craft the perfect trip tailored just for you
        </p>
      </div>

      <div className="relative z-10 mt-6">
        <form
          id="trip-planner-main-form"
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/60 flex flex-col gap-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50/90 hover:bg-slate-100/90 transition-colors border border-slate-200/70 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100">
              <label
                htmlFor="hero-destination-input"
                className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider"
              >
                Destination
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                <input
                  id="hero-destination-input"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Bali, Japan"
                  className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent border-none outline-none placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-50/90 hover:bg-slate-100/90 transition-colors border border-slate-200/70 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100">
              <label
                htmlFor="hero-start-date-input"
                className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider"
              >
                Start Date
              </label>
              <div className="flex items-center justify-between gap-1.5 mt-0.5">
                <input
                  id="hero-start-date-input"
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent border-none outline-none"
                />
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-50/90 hover:bg-slate-100/90 transition-colors border border-slate-200/70 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100">
              <label
                htmlFor="hero-end-date-input"
                className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider"
              >
                End Date
              </label>
              <div className="flex items-center justify-between gap-1.5 mt-0.5">
                <input
                  id="hero-end-date-input"
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent border-none outline-none"
                />
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>

            <div
              ref={travelersDropdownRef}
              className={`relative px-3.5 py-2 rounded-xl transition-all border ${
                showTravelersDropdown
                  ? 'bg-white border-sky-500 ring-2 ring-sky-100'
                  : 'bg-slate-50/90 hover:bg-slate-100/90 border-slate-200/70'
              }`}
            >
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Travelers
              </label>
              <button
                id="hero-travelers-selector-button"
                type="button"
                onClick={() => setShowTravelersDropdown((prev) => !prev)}
                className="w-full flex items-center justify-between gap-1 mt-0.5 text-left text-xs sm:text-sm font-bold text-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <Users className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="truncate">{travelers}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    showTravelersDropdown ? 'rotate-180 text-sky-600' : ''
                  }`}
                />
              </button>

              {showTravelersDropdown && (
                <div
                  id="travelers-popover-card"
                  className="absolute top-full right-0 sm:right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 ring-1 ring-slate-900/10 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Select Travelers</span>
                    <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                      Total: {adults + children} {adults + children === 1 ? 'person' : 'people'}
                    </span>
                  </div>

                  <div className="py-3 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Adults</div>
                        <div className="text-[10px] text-slate-400">Ages 13 and above</div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                          disabled={adults <= 1}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-extrabold text-slate-900">
                          {adults}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAdults((prev) => Math.min(12, prev + 1))}
                          disabled={adults >= 12}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Children</div>
                        <div className="text-[10px] text-slate-400">Ages 0 to 12</div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                          disabled={children <= 0}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-extrabold text-slate-900">
                          {children}
                        </span>
                        <button
                          type="button"
                          onClick={() => setChildren((prev) => Math.min(8, prev + 1))}
                          disabled={children >= 8}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Quick Presets
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreset(1, 0)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left transition-all border cursor-pointer ${
                          adults === 1 && children === 0
                            ? 'bg-sky-50 text-sky-700 border-sky-200 font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
                        }`}
                      >
                        Solo (1 Adult)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreset(2, 0)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left transition-all border cursor-pointer ${
                          adults === 2 && children === 0
                            ? 'bg-sky-50 text-sky-700 border-sky-200 font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
                        }`}
                      >
                        Couple (2 Adults)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreset(2, 2)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left transition-all border cursor-pointer ${
                          adults === 2 && children === 2
                            ? 'bg-sky-50 text-sky-700 border-sky-200 font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
                        }`}
                      >
                        Family (2 Adults, 2 Kids)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreset(4, 0)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left transition-all border cursor-pointer ${
                          adults === 4 && children === 0
                            ? 'bg-sky-50 text-sky-700 border-sky-200 font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
                        }`}
                      >
                        Group (4 Adults)
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setShowTravelersDropdown(false)}
                      className="w-full py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply Travelers</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Instant AI custom itinerary, stays & budget breakdown</span>
            </div>
            <button
              id="hero-plan-my-trip-button"
              type="submit"
              disabled={isGeneratingAI}
              className="px-7 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shrink-0 disabled:opacity-75"
            >
              <Sparkles className="w-4 h-4 fill-white/30" />
              <span className="whitespace-nowrap">Plan My Trip</span>
            </button>
          </div>
        </form>

        <div
          id="hero-quick-trip-type-chips"
          className="flex items-center gap-2 mt-3.5 overflow-x-auto pb-1 scrollbar-none"
        >
          {tripTypes.map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                id={`chip-${type.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedType(type)}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-white text-sky-950 shadow-md font-bold'
                    : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/25'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
