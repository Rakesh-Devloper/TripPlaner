import React, { useState } from 'react';
import {
  Search,
  Filter,
  Star,
  Heart,
  MapPin,
  Sparkles,
  LayoutGrid,
  Map,
  Columns,
  Navigation,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/BackButton';
import { InteractiveTravelMap } from '../components/InteractiveTravelMap';

export const ExplorePage = () => {
  const { destinations, toggleSavePlace, isPlaceSaved, setSelectedDestinationForDetail, savedPlaces } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewLayout, setViewLayout] = useState('split');

  const categories = ['All', 'Beach', 'Mountains', 'Culture', 'Adventure', 'Luxury'];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === 'All' || dest.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCat;
  });

  return (
    <div id="explore-destinations-page" className="space-y-6">
      {/* Top Breadcrumb / Back Button Bar */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Dashboard" fallbackPage="Dashboard" />
        <span className="text-xs font-semibold text-slate-400">Explore Destinations</span>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Explore World Destinations & Routes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visualize your {savedPlaces.length} saved locations, explore curated world travel blueprints, and trace scenic multi-day transit routes.
          </p>
        </div>

        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, country, or tag..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 shadow-xs transition-all"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="p-1 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewLayout('split')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'split'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewLayout('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'map'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewLayout('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'grid'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 1. FULL MAP VIEW */}
      {viewLayout === 'map' && (
        <div className="space-y-4">
          <InteractiveTravelMap
            initialMode="all"
            heightClass="h-[600px] sm:h-[680px]"
            showFullscreenButton={true}
          />
        </div>
      )}

      {/* 2. SPLIT VIEW: MAP ON TOP/LEFT + CARDS */}
      {viewLayout === 'split' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Map Column (7 cols on XL) */}
          <div className="xl:col-span-7 sticky top-4 self-start space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-600" />
                Interactive Visualizer
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Click any pin or waypoint to inspect
              </span>
            </div>
            <InteractiveTravelMap
              initialMode="all"
              heightClass="h-[480px] sm:h-[540px] xl:h-[600px]"
              showFullscreenButton={true}
            />
          </div>

          {/* Destination Cards Column (5 cols on XL) */}
          <div className="xl:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700">
                Destinations ({filteredDestinations.length})
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Sorted by popularity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredDestinations.map((dest) => {
                const isSaved = isPlaceSaved(dest.id);

                return (
                  <div
                    key={dest.id}
                    onClick={() => setSelectedDestinationForDetail(dest)}
                    className="group bg-white rounded-2xl border border-slate-200/80 p-3 hover:border-sky-300 hover:shadow-md transition-all duration-200 flex gap-3 cursor-pointer"
                  >
                    <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavePlace(dest);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-rose-500 flex items-center justify-center shadow-xs"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-extrabold text-sm text-slate-900 truncate group-hover:text-sky-600 transition-colors">
                            {dest.name}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{dest.rating}</span>
                          <span className="text-[11px] text-slate-400 font-normal">({dest.reviewCount})</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md font-semibold ml-1">
                            {dest.category}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {dest.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="font-extrabold text-sky-700">From ${dest.price}</span>
                        <span className="text-[11px] font-bold text-sky-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          View Details <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. STANDARD GRID VIEW */}
      {viewLayout === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((dest) => {
            const isSaved = isPlaceSaved(dest.id);

            return (
              <div
                key={dest.id}
                onClick={() => setSelectedDestinationForDetail(dest)}
                className="group bg-white rounded-3xl border border-slate-200/70 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                    {dest.category}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavePlace(dest);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-rose-500 hover:bg-white flex items-center justify-center transition-colors shadow-xs"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-slate-900 tracking-tight group-hover:text-sky-700 transition-colors">
                        {dest.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {dest.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-semibold bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{dest.rating}</span>
                      <span className="text-slate-400 font-normal">({dest.reviewCount})</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-normal">From</span>
                      <span className="font-extrabold text-sky-700 text-sm">${dest.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

