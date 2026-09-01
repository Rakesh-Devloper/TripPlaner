import React, { useState } from 'react';
import {
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Compass,
  Layers,
  Sparkles,
  Info,
  Calendar,
  DollarSign,
  Star,
  Eye,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { travelPins, mapStats } from '../data/mapData';
import { useApp } from '../context/AppContext';

export const InteractiveTravelMap = ({
  initialMode = 'all',
  heightClass = 'h-[440px]',
  showFullscreenButton = true,
}) => {
  const { setSelectedDestinationForDetail, triggerAIPlan, savedPlaces } = useApp();
  const [selectedFilter, setSelectedFilter] = useState(initialMode);
  const [selectedPin, setSelectedPin] = useState(travelPins[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredPin, setHoveredPin] = useState(null);

  const filteredPins =
    selectedFilter === 'all'
      ? travelPins
      : selectedFilter === 'saved'
      ? travelPins.filter((pin) =>
          savedPlaces?.some(
            (sp) =>
              sp.destinationName?.toLowerCase().includes(pin.name.split(',')[0].toLowerCase()) ||
              pin.name.toLowerCase().includes(sp.destinationName?.toLowerCase())
          )
        )
      : travelPins.filter((pin) => pin.category === selectedFilter || pin.status === selectedFilter);

  const getPinColor = (category, status) => {
    if (status === 'visited') return 'bg-emerald-500 text-white shadow-emerald-500/40 ring-emerald-300';
    if (status === 'planned') return 'bg-sky-500 text-white shadow-sky-500/40 ring-sky-300';
    switch (category) {
      case 'beach':
        return 'bg-amber-500 text-white shadow-amber-500/40 ring-amber-300';
      case 'mountain':
        return 'bg-violet-600 text-white shadow-violet-500/40 ring-violet-300';
      case 'cultural':
        return 'bg-rose-500 text-white shadow-rose-500/40 ring-rose-300';
      case 'city':
        return 'bg-indigo-600 text-white shadow-indigo-500/40 ring-indigo-300';
      default:
        return 'bg-sky-600 text-white shadow-sky-500/40 ring-sky-300';
    }
  };

  const handlePlanWithAI = (pin) => {
    triggerAIPlan({
      destination: pin.name,
      startDate: pin.bestMonth ? `${pin.bestMonth} 10, 2025` : 'May 20, 2025',
      endDate: pin.bestMonth ? `${pin.bestMonth} 17, 2025` : 'May 27, 2025',
      travelers: '2 Travelers',
      tripType: pin.category === 'beach' ? 'Relaxation' : pin.category === 'mountain' ? 'Adventure' : 'Cultural Tour',
      budgetLevel: 'Moderate',
    });
  };

  return (
    <div
      id="interactive-travel-map-container"
      className={`relative w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden transition-all duration-300 flex flex-col ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl h-[calc(100vh-2rem)]' : heightClass
      }`}
    >
      {/* Header bar over map */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* Title + Pill */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-md">
          <Navigation className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
          <span className="text-xs font-bold text-white tracking-wide">Interactive Global Pinpoint</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
            {filteredPins.length} Destinations
          </span>
        </div>

        {/* Category Filters + Fullscreen toggle */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-md">
          {['all', 'planned', 'visited', 'beach', 'mountain', 'cultural'].map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setSelectedFilter(filterKey)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-xl capitalize transition-all cursor-pointer ${
                selectedFilter === filterKey
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {filterKey}
            </button>
          ))}

          {showFullscreenButton && (
            <>
              <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
              <button
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative flex-1 w-full h-full bg-radial from-slate-800 via-slate-900 to-slate-950 overflow-hidden select-none">
        {/* World Map SVG Vector */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-cover opacity-60 transition-opacity duration-300"
          style={{ filter: 'drop-shadow(0 0 8px rgba(14, 165, 233, 0.08))' }}
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <rect width="1000" height="500" fill="url(#mapGrid)" />

          {/* Continents (Stylized geometric world path) */}
          <g fill="#1e293b" stroke="#334155" strokeWidth="0.75" opacity="0.9">
            {/* North America */}
            <path d="M 120,80 L 190,75 L 260,110 L 290,140 L 240,190 L 190,210 L 170,250 L 150,220 L 110,180 L 90,120 Z" />
            {/* South America */}
            <path d="M 240,260 L 320,280 L 340,340 L 300,420 L 260,450 L 230,370 L 220,300 Z" />
            {/* Europe */}
            <path d="M 460,90 L 530,85 L 560,120 L 520,160 L 470,170 L 440,130 Z" />
            {/* Africa */}
            <path d="M 450,180 L 550,180 L 580,240 L 560,330 L 520,380 L 460,350 L 440,240 Z" />
            {/* Asia */}
            <path d="M 570,80 L 720,70 L 840,110 L 860,200 L 760,260 L 680,240 L 600,180 Z" />
            {/* Australia */}
            <path d="M 760,320 L 860,310 L 880,380 L 820,410 L 770,380 Z" />
            {/* Japan / Islands */}
            <path d="M 865,140 L 880,150 L 870,180 L 855,160 Z" />
            <path d="M 740,260 L 780,270 L 760,290 Z" />
          </g>

          {/* Connected Route Arch Lines between destinations */}
          <path
            d="M 180,150 Q 320,80 500,125 T 820,230"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="1.75"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
          <path
            d="M 500,125 Q 600,280 770,240"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.7"
          />
        </svg>

        {/* Dynamic Interactive Pin Markers */}
        {filteredPins.map((pin) => {
          const isSelected = selectedPin?.id === pin.id;
          const isHovered = hoveredPin?.id === pin.id;
          const colorClasses = getPinColor(pin.category, pin.status);

          return (
            <div
              key={pin.id}
              style={{ left: `${pin.coordinates.x}%`, top: `${pin.coordinates.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              onClick={() => setSelectedPin(pin)}
              onMouseEnter={() => setHoveredPin(pin)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              {/* Radar pulse for active/selected pins */}
              {(isSelected || isHovered) && (
                <span className="absolute -inset-2.5 rounded-full bg-sky-400/30 animate-ping" />
              )}

              {/* Pin capsule */}
              <div
                className={`relative flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-extrabold shadow-lg transition-all duration-200 border border-white/40 ring-2 ${colorClasses} ${
                  isSelected
                    ? 'scale-125 z-30 ring-white shadow-sky-500/50'
                    : isHovered
                    ? 'scale-110 ring-white/60'
                    : 'scale-95 hover:scale-105'
                }`}
              >
                <MapPin className="w-2.5 h-2.5 fill-current" />
                <span className="whitespace-nowrap tracking-tight">{pin.name.split(',')[0]}</span>
              </div>
            </div>
          );
        })}

        {/* Selected Destination Flyout / Detail Card Overlay */}
        {selectedPin && (
          <div
            id="map-selected-pin-flyout"
            className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 text-white"
          >
            <div className="flex gap-3 items-center">
              <img
                src={selectedPin.image}
                alt={selectedPin.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-600 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {selectedPin.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{selectedPin.rating}</span>
                  </div>
                </div>

                <h4 className="text-xs sm:text-sm font-extrabold text-white truncate mt-1">
                  {selectedPin.name}
                </h4>
                <p className="text-[11px] text-slate-300 truncate mt-0.5">
                  {selectedPin.highlight}
                </p>
              </div>
            </div>

            {/* Quick meta stats */}
            <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-slate-800 text-[10px]">
              <div>
                <span className="text-slate-400 block">Est. Cost</span>
                <span className="font-bold text-sky-400">${selectedPin.price}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Best Month</span>
                <span className="font-bold text-slate-200">{selectedPin.bestMonth}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Status</span>
                <span
                  className={`font-bold capitalize ${
                    selectedPin.status === 'visited'
                      ? 'text-emerald-400'
                      : selectedPin.status === 'planned'
                      ? 'text-sky-400'
                      : 'text-amber-400'
                  }`}
                >
                  {selectedPin.status}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-3 pt-2">
              <button
                onClick={() =>
                  setSelectedDestinationForDetail({
                    id: `map-${selectedPin.id}`,
                    name: selectedPin.name,
                    category: selectedPin.category,
                    image: selectedPin.image,
                    rating: selectedPin.rating,
                    reviewCount: 420,
                    price: selectedPin.price,
                    duration: '6 Days',
                    description: selectedPin.highlight,
                    temp: '28°C',
                    weather: 'Sunny',
                    bestTime: selectedPin.bestMonth,
                  })
                }
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-[11px] font-bold border border-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => handlePlanWithAI(selectedPin)}
                className="flex-1 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-[11px] font-bold shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plan Trip AI</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer statistics summary bar */}
      <div className="bg-slate-950/90 border-t border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
            <strong className="text-slate-200">{mapStats.countriesVisited}</strong> Countries Visited
          </span>
          <span className="flex items-center gap-1.5 hidden sm:inline-flex">
            <span className="w-2 h-2 rounded-full bg-sky-500 ring-2 ring-sky-500/30" />
            <strong className="text-slate-200">{mapStats.plannedTrips}</strong> Upcoming Pins
          </span>
          <span className="flex items-center gap-1.5 hidden md:inline-flex">
            <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-500/30" />
            <strong className="text-slate-200">{mapStats.bucketListItems}</strong> Wishlisted
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-sky-400 font-bold">
          <TrendingUp className="w-3 h-3" />
          <span>Global Explorer Tier: Level 4</span>
        </div>
      </div>
    </div>
  );
};
