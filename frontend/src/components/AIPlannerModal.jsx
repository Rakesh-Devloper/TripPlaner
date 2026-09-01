import React from 'react';
import {
  Sparkles,
  Calendar,
  DollarSign,
  X,
  CheckCircle2,
  BookmarkPlus,
  MapPin,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AIPlannerModal = () => {
  const {
    isGeneratingAI,
    aiGenerationStep,
    aiGeneratedPlan,
    showAIResultModal,
    setShowAIResultModal,
    saveGeneratedTrip,
    setActivePage,
  } = useApp();

  const steps = [
    'Analyzing destination & seasonal weather...',
    'Finding top-rated boutique accommodations...',
    'Curating hidden gems & iconic landmarks...',
    'Optimizing transit routes and timing...',
    'Finalizing customized budget breakdown...',
  ];

  if (isGeneratingAI) {
    return (
      <div
        id="ai-generation-overlay-modal"
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/30 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 mt-5 tracking-tight">
            Crafting Your Perfect Itinerary
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Our AI travel engine is assembling a personalized plan...
          </p>

          <div className="mt-6 space-y-2.5 text-left">
            {steps.map((step, idx) => {
              const isCompleted = aiGenerationStep > idx + 1;
              const isCurrent = aiGenerationStep === idx + 1;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-sky-50/80 border border-sky-200/80 text-sky-950 font-semibold shadow-xs'
                      : isCompleted
                      ? 'text-emerald-700 font-medium'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-sky-600 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span className="text-xs">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (!showAIResultModal || !aiGeneratedPlan) return null;

  return (
    <div
      id="ai-plan-result-modal"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={() => setShowAIResultModal(false)}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col my-auto animate-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Destination Photo Banner */}
        <div className="relative h-40 sm:h-44 bg-slate-900 p-5 sm:p-6 flex flex-col justify-between shrink-0">
          <img
            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80"
            alt="Trip banner"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="bg-sky-600 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              AI Generated Masterpiece
            </span>
            <button
              onClick={() => setShowAIResultModal(false)}
              className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {aiGeneratedPlan.title || `${aiGeneratedPlan.destination} Journey`}
            </h3>
            <p className="text-xs text-white/90 font-medium flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{aiGeneratedPlan.destination}</span>
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 overscroll-contain">
          {/* Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {aiGeneratedPlan.summary}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200/60 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Best Time to Visit
                </span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {aiGeneratedPlan.bestTimeToVisit || 'Apr to Oct'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Est. Total Cost
                </span>
                <p className="font-extrabold text-sky-700 text-sm mt-0.5">
                  ${aiGeneratedPlan.totalEstimatedCost || 1149}
                </p>
              </div>
            </div>
          </div>

          {/* Days Preview */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Itinerary Schedule ({aiGeneratedPlan.days?.length || 6} Days)
            </h4>
            <div className="space-y-2.5">
              {aiGeneratedPlan.days?.map((day, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white border border-slate-100/90 shadow-sm hover:border-sky-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-600">{day.title}</span>
                    <span className="text-[11px] font-bold text-slate-800">{day.subtitle}</span>
                  </div>

                  {day.activities && (
                    <div className="mt-2 space-y-1.5 pt-2 border-t border-slate-100">
                      {day.activities.slice(0, 2).map((act, aIdx) => (
                        <div key={aIdx} className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 truncate max-w-[80%]">
                            • {act.title}
                          </span>
                          <span className="text-slate-400 text-[10px]">{act.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Budget Breakdown */}
          {aiGeneratedPlan.budgetBreakdown && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Estimated Budget Allocation
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Flights</span>
                  <span className="font-bold text-slate-800">
                    ${aiGeneratedPlan.budgetBreakdown.flights}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Hotels</span>
                  <span className="font-bold text-slate-800">
                    ${aiGeneratedPlan.budgetBreakdown.hotels}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Activities</span>
                  <span className="font-bold text-slate-800">
                    ${aiGeneratedPlan.budgetBreakdown.activities}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Food</span>
                  <span className="font-bold text-slate-800">
                    ${aiGeneratedPlan.budgetBreakdown.food}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Transport</span>
                  <span className="font-bold text-slate-800">
                    ${aiGeneratedPlan.budgetBreakdown.transport}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={() => setShowAIResultModal(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Dismiss
          </button>

          <button
            id="save-ai-trip-button"
            onClick={saveGeneratedTrip}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Save & Open Itinerary</span>
          </button>
        </div>
      </div>
    </div>
  );
};
