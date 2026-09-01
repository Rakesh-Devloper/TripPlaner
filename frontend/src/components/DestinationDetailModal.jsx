import React from 'react';
import {
  X,
  Star,
  Heart,
  MapPin,
  Calendar,
  Sparkles,
  CloudSun,
  Utensils,
  Hotel,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from './BackButton';

export const DestinationDetailModal = () => {
  const {
    selectedDestinationForDetail,
    setSelectedDestinationForDetail,
    toggleSavePlace,
    isPlaceSaved,
    triggerAIPlan,
  } = useApp();

  if (!selectedDestinationForDetail) return null;

  const dest = selectedDestinationForDetail;
  const isSaved = isPlaceSaved(dest.id);

  const handlePlanHere = () => {
    setSelectedDestinationForDetail(null);
    triggerAIPlan({
      destination: dest.name,
      startDate: 'Jun 10, 2025',
      endDate: 'Jun 16, 2025',
      travelers: '2 Travelers',
      tripType: dest.category || 'Adventure',
      budgetLevel: 'Moderate',
    });
  };

  return (
    <div
      id="destination-detail-modal"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={() => setSelectedDestinationForDetail(null)}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col my-auto animate-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Image */}
        <div className="relative h-48 sm:h-60 bg-slate-900 shrink-0">
          <img
            src={dest.image}
            alt={dest.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />

          {/* Top buttons */}
          <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <BackButton
                onClick={() => setSelectedDestinationForDetail(null)}
                variant="white"
                label="Back"
                className="py-1 px-2.5 text-xs shadow-md"
              />
              <span className="bg-sky-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                {dest.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSavePlace(dest)}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-red-500 hover:bg-white flex items-center justify-center transition-colors shadow cursor-pointer"
                aria-label="Save place"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              <button
                onClick={() => setSelectedDestinationForDetail(null)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors shadow cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Title on Banner */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">{dest.name}</h3>
            </div>
            <div className="flex items-center gap-3 text-xs mt-1 text-white/90 font-medium">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{dest.rating}</span>
                <span className="text-white/70 font-normal">({dest.reviewCount} reviews)</span>
              </div>
              <span>•</span>
              <span>{dest.duration}</span>
              <span>•</span>
              <span>From ${dest.price}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 overscroll-contain">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About</h4>
            <p className="text-xs text-slate-600 leading-relaxed mt-1 font-normal">
              {dest.description}
            </p>
          </div>

          {/* Highlights & Weather */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <CloudSun className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Weather</span>
                <p className="font-semibold text-slate-800">
                  {dest.temp} • {dest.weather}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Best Time</span>
                <p className="font-semibold text-slate-800">{dest.bestTime}</p>
              </div>
            </div>
          </div>

          {/* Attractions */}
          {dest.popularAttractions && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Top Attractions
              </h4>
              <div className="flex flex-wrap gap-2">
                {dest.popularAttractions.map((att, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold bg-sky-50 text-sky-700 px-3 py-1 rounded-full border border-sky-100"
                  >
                    📍 {att}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Hotels */}
          {dest.recommendedHotels && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Recommended Stays
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dest.recommendedHotels.map((hotel, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3"
                  >
                    {hotel.image && (
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    )}
                    <div>
                      <h5 className="font-bold text-xs text-slate-800 truncate">{hotel.name}</h5>
                      <div className="flex items-center gap-2 text-[11px] mt-0.5">
                        <span className="text-amber-500 font-bold">★ {hotel.rating}</span>
                        <span className="text-slate-500">${hotel.pricePerNight}/night</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Starting From</span>
            <span className="text-lg font-extrabold text-slate-900">${dest.price}</span>
          </div>

          <button
            onClick={handlePlanHere}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Trip for {dest.name.split(',')[0]}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
