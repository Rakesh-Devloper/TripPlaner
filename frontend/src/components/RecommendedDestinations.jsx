import React, { useRef } from 'react';
import { Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RecommendedDestinations = () => {
  const {
    destinations,
    toggleSavePlace,
    isPlaceSaved,
    setSelectedDestinationForDetail,
    setActivePage,
  } = useApp();

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Beach':
        return 'bg-emerald-500/80 text-white backdrop-blur-md';
      case 'Mountains':
        return 'bg-blue-600/80 text-white backdrop-blur-md';
      case 'Culture':
        return 'bg-amber-600/80 text-white backdrop-blur-md';
      case 'Adventure':
        return 'bg-indigo-600/80 text-white backdrop-blur-md';
      default:
        return 'bg-slate-800/80 text-white backdrop-blur-md';
    }
  };

  return (
    <div id="recommended-destinations-section" className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100/90 shadow-sm mt-5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
            Recommended Destinations for You
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Scroll Navigation Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Previous destinations"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Next destinations"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="view-all-recommended-destinations-button"
            onClick={() => setActivePage('Explore Destinations')}
            className="text-xs font-bold text-sky-700 hover:text-sky-800 hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>
      </div>

      {/* Destinations Horizontal Scroll Grid */}
      <div
        ref={scrollRef}
        className="grid grid-flow-col auto-cols-[minmax(200px,1fr)] sm:auto-cols-[minmax(220px,1fr)] lg:grid-flow-row lg:grid-cols-4 gap-3.5 overflow-x-auto pb-1.5 scrollbar-thin"
      >
        {destinations.slice(0, 4).map((dest) => {
          const isSaved = isPlaceSaved(dest.id);
          return (
            <div
              key={dest.id}
              id={`destination-card-${dest.id}`}
              onClick={() => setSelectedDestinationForDetail(dest)}
              className="group bg-white rounded-xl border border-slate-200/70 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Image Container with Badge and Save Button */}
              <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                />

                {/* Category Badge */}
                <span
                  className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide ${getCategoryBadgeClass(
                    dest.category
                  )}`}
                >
                  {dest.category}
                </span>

                {/* Save to Wishlist Heart Button */}
                <button
                  type="button"
                  id={`save-destination-${dest.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSavePlace(dest);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-white transition-all shadow-xs"
                  aria-label={`Save ${dest.name}`}
                >
                  <Heart
                    className={`w-3 h-3 ${
                      isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                    }`}
                  />
                </button>
              </div>

              {/* Destination Details */}
              <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 tracking-tight group-hover:text-sky-700 transition-colors truncate">
                      {dest.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{dest.rating}</span>
                    </div>
                    <span className="text-[9px] text-slate-400">({dest.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 text-[10px] font-medium">{dest.duration}</span>
                  <span className="font-bold text-slate-900 text-[11px]">
                    <span className="text-[9px] text-slate-400 font-normal mr-1">From</span>
                    <span className="text-sky-700 font-extrabold">${dest.price}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
