import React, { useState } from 'react';
import { Heart, Star, Sparkles, Trash2, ArrowRight, MapPin, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/BackButton';
import { InteractiveTravelMap } from '../components/InteractiveTravelMap';

export const SavedPlacesPage = () => {
  const { savedPlaces, setSavedPlaces, triggerAIPlan, setActivePage } = useApp();
  const [showMap, setShowMap] = useState(true);

  const handleRemove = (id) => {
    setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePlanForPlace = (place) => {
    triggerAIPlan({
      destination: place.destinationName,
      startDate: 'Jul 20, 2025',
      endDate: 'Jul 26, 2025',
      travelers: '2 Travelers',
      tripType: place.category || 'Adventure',
      budgetLevel: 'Moderate',
    });
  };

  return (
    <div id="saved-places-page" className="space-y-6">
      {/* Top Breadcrumb / Back Button Bar */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Dashboard" fallbackPage="Dashboard" />
        <span className="text-xs font-semibold text-slate-400">Wishlist & Saved Places</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Saved Places & Wishlist ({savedPlaces.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Your bookmarked dream destinations ready to be turned into AI travel itineraries.
          </p>
        </div>

        {savedPlaces.length > 0 && (
          <button
            type="button"
            onClick={() => setShowMap((prev) => !prev)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              showMap
                ? 'bg-sky-50 border-sky-200 text-sky-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>{showMap ? 'Hide Map View' : 'Show Wishlist Map'}</span>
          </button>
        )}
      </div>

      {/* Interactive Map of Saved Places */}
      {showMap && savedPlaces.length > 0 && (
        <div className="space-y-2">
          <InteractiveTravelMap
            initialMode="saved"
            heightClass="h-[360px] sm:h-[420px]"
            showFullscreenButton={true}
          />
        </div>
      )}

      {savedPlaces.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            Explore world destinations and click the heart icon to save your favorite spots.
          </p>
          <button
            onClick={() => setActivePage('Explore Destinations')}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            Explore Destinations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-3xl border border-slate-200/70 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100">
                  <img
                    src={place.image}
                    alt={place.destinationName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                    {place.category}
                  </span>

                  <button
                    onClick={() => handleRemove(place.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-rose-500 hover:bg-white flex items-center justify-center transition-colors shadow cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                    {place.destinationName}
                  </h3>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{place.rating}</span>
                    </div>

                    <span className="font-extrabold text-slate-900">
                      <span className="text-[10px] text-slate-400 font-normal mr-1">From</span>$
                      {place.price}
                    </span>
                  </div>

                  {place.notes && (
                    <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 mt-2">
                      💡 {place.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => handlePlanForPlace(place)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Trip for {place.destinationName.split(',')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

