import React, { useState } from 'react';
import { Sparkles, Check, X, Shield, Zap, HeartHandshake } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UpgradeModal = () => {
  const { showUpgradeModal, setShowUpgradeModal, setUser } = useApp();
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [upgraded, setUpgraded] = useState(false);

  if (!showUpgradeModal) return null;

  const handleUpgrade = () => {
    setUser((prev) => ({ ...prev, plan: 'pro' }));
    setUpgraded(true);
    setTimeout(() => {
      setUpgraded(false);
      setShowUpgradeModal(false);
    }, 1800);
  };

  const features = [
    'Unlimited AI Itinerary Generations (Powered by Gemini 3.7)',
    'Real-time Flight Price Drop Radar & Alerts',
    'Smart Budget Optimizer & Multi-Currency Expense Tracker',
    'Offline PDF & Apple Wallet / Google Wallet Itinerary Sync',
    'Curated Secret Local Spots & VIP Hotel Perks',
    '24/7 Dedicated AI Concierge with Voice & Live Directions',
  ];

  return (
    <div
      id="upgrade-membership-modal"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={() => setShowUpgradeModal(false)}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 p-5 sm:p-7 md:p-8 animate-in zoom-in-95 duration-150 relative max-h-[92vh] overflow-y-auto my-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Close upgrade modal"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {upgraded ? (
          <div className="text-center py-10 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Welcome to Pro Member!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your account has been upgraded with unlimited Gemini AI itineraries and VIP booking perks.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mt-4 tracking-tight">
                Upgrade to TripPlanner Pro
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Access advanced AI travel intelligence, private booking perks, and luxury itineraries.
              </p>

              {/* Billing Switch */}
              <div className="mt-5 inline-flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Monthly ($12/mo)
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    billingCycle === 'yearly'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>Yearly ($99/yr)</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                    Save 30%
                  </span>
                </button>
              </div>
            </div>

            {/* Feature List */}
            <div className="mt-6 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <button
              onClick={handleUpgrade}
              className="w-full mt-6 py-3.5 px-4 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 shadow-xl shadow-indigo-500/25 transition-all duration-200 cursor-pointer"
            >
              {billingCycle === 'yearly' ? 'Start 14-Day Free Trial ($99/yr)' : 'Upgrade for $12/month'}
            </button>

            <p className="text-[10px] text-center text-slate-400 mt-2.5">
              Cancel anytime with 1-click. 30-day money-back guarantee.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
