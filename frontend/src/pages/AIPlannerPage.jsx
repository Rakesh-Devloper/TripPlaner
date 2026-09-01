import React, { useState } from 'react';
import { Sparkles, Calendar, Users, DollarSign, Compass, Heart, Coffee, Camera, Mountain, Palmtree, Utensils, Music, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/BackButton';

const interestTags = [
  { label: 'Scenic Nature', icon: Mountain },
  { label: 'Beaches & Ocean', icon: Palmtree },
  { label: 'Local Food & Street Dining', icon: Utensils },
  { label: 'Cafes & Hidden Bars', icon: Coffee },
  { label: 'Photography Spots', icon: Camera },
  { label: 'Historic Temples & Culture', icon: Compass },
  { label: 'Nightlife & Live Music', icon: Music },
  { label: 'Wellness & Spas', icon: Heart },
];

export const AIPlannerPage = () => {
  const { triggerAIPlan, isGeneratingAI } = useApp();

  const [destination, setDestination] = useState('Kyoto & Tokyo, Japan');
  const [startDate, setStartDate] = useState('Oct 12, 2025');
  const [endDate, setEndDate] = useState('Oct 19, 2025');
  const [travelers, setTravelers] = useState('2 Travelers');
  const [budgetLevel, setBudgetLevel] = useState('Moderate');
  const [tripVibe, setTripVibe] = useState('Cultural & Relaxed');
  const [selectedInterests, setSelectedInterests] = useState([
    'Scenic Nature',
    'Historic Temples & Culture',
    'Local Food & Street Dining',
  ]);

  const toggleInterest = (label) => {
    if (selectedInterests.includes(label)) {
      setSelectedInterests((prev) => prev.filter((i) => i !== label));
    } else {
      setSelectedInterests((prev) => [...prev, label]);
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    triggerAIPlan({
      destination,
      startDate,
      endDate,
      travelers,
      tripType: tripVibe,
      budgetLevel,
      interests: selectedInterests,
    });
  };

  return (
    <div id="ai-planner-page" className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb / Back Button Bar */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Dashboard" fallbackPage="Dashboard" />
        <span className="text-xs font-semibold text-slate-400">AI Architect</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="bg-white/20 backdrop-blur-md text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Gemini 3.7 Pro Powered
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            AI Travel Studio & Itinerary Architect
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Customize your vibe, pacing, dietary preferences, and travel party. Our AI crafts minute-by-minute realistic travel blueprints.
          </p>
        </div>

        {/* Decorative sparkles */}
        <Sparkles className="absolute right-6 -bottom-6 w-48 h-48 text-white/10 pointer-events-none" />
      </div>

      {/* Main Generator Form Card */}
      <form
        onSubmit={handleGenerate}
        className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/70 shadow-xs space-y-6"
      >
        {/* Row 1: Destination & Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Where to?
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Rome, Swiss Alps, Iceland"
              className="w-full text-xs sm:text-sm font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:bg-white transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Start Date
            </label>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold bg-transparent border-none outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              End Date
            </label>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold bg-transparent border-none outline-none text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Travelers & Budget Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Who is traveling?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Solo (1)', 'Couple (2)', 'Family (3-4)', 'Group (5+)'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTravelers(opt)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    travelers === opt
                      ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-transparent shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Budget Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Budget', 'Moderate', 'Luxury'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudgetLevel(b)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    budgetLevel === b
                      ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white border-transparent shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {b === 'Budget' ? '💰 Budget' : b === 'Moderate' ? '✨ Moderate' : '👑 Luxury'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interests & Activities Selection */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            What are your must-have interests?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {interestTags.map((tag) => {
              const Icon = tag.icon;
              const isSelected = selectedInterests.includes(tag.label);
              return (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => toggleInterest(tag.label)}
                  className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-semibold text-left transition-all ${
                    isSelected
                      ? 'bg-sky-50 border-sky-300 text-sky-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span className="truncate">{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Includes flight estimates, verified boutique stays, and day maps</span>
          </div>

          <button
            type="submit"
            disabled={isGeneratingAI}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGeneratingAI ? 'Generating...' : 'Generate My Complete Itinerary'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
