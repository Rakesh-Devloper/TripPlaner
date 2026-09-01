import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Sparkles,
  Moon,
  Sun,
  DollarSign,
  Check,
  Download,
  Trash2,
  Cpu,
  Globe2,
  Lock,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/BackButton';

export const SettingsPage = () => {
  const { isDarkMode, toggleDarkMode, setShowUpgradeModal, user, trips, bookings, expenses, openAuthModal, logout } = useApp();

  const [currency, setCurrency] = useState('USD ($)');
  const [measurement, setMeasurement] = useState('Metric (°C, km)');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [aiModel, setAiModel] = useState('Gemini 2.5 Flash Ultra');
  const [dealAlerts, setDealAlerts] = useState(true);
  const [itineraryReminders, setItineraryReminders] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [exportNotice, setExportNotice] = useState(null);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const data = {
      user,
      trips,
      bookings,
      expenses,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TripPlannerAI_Export_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice('Trip data exported to JSON file successfully!');
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div id="settings-preferences-page" className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb / Back Button Bar */}
      <div className="flex items-center justify-between">
        <BackButton label="Back" fallbackPage="Dashboard" />
        <span className="text-xs font-semibold text-slate-400">Settings</span>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Settings & System Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure currency units, AI model selection, notification alerts, and data management.
        </p>
      </div>

      {/* Regional & Units Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/70 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe2 className="w-5 h-5 text-sky-600" />
          <h3 className="text-base font-bold text-slate-900">Regional & Display Format</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
              Preferred Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600"
            >
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="EUR (€)">EUR (€) - Euro</option>
              <option value="GBP (£)">GBP (£) - British Pound</option>
              <option value="JPY (¥)">JPY (¥) - Japanese Yen</option>
              <option value="AUD ($)">AUD ($) - Australian Dollar</option>
              <option value="INR (₹)">INR (₹) - Indian Rupee</option>
              <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
              <option value="SGD ($)">SGD ($) - Singapore Dollar</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
              Units of Measurement
            </label>
            <select
              value={measurement}
              onChange={(e) => setMeasurement(e.target.value)}
              className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600"
            >
              <option value="Metric (°C, km)">Metric (°C, Kilometers, kg)</option>
              <option value="Imperial (°F, miles)">Imperial (°F, Miles, lbs)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
              Date Format
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (25/05/2025)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (05/25/2025)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2025-05-25)</option>
            </select>
          </div>
        </div>

        {/* AI Model Intelligence */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">AI Itinerary Engine Settings</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                Generative AI Model
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-600"
              >
                <option value="Gemini 2.5 Flash Ultra">Gemini 2.5 Flash (Ultra Fast & Detailed)</option>
                <option value="Gemini 2.5 Pro Pro">Gemini 2.5 Pro (Deep Research & Hidden Gems)</option>
                <option value="Hybrid Route Optimizer">Hybrid Route & Budget Optimizer</option>
              </select>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[11px] font-bold text-slate-700 uppercase mb-1">AI Execution Mode</span>
              <p className="text-xs text-slate-500">
                Automatic budget clustering & multi-stop route sequencing enabled by default.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Alerts */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Notification Alerts & Updates</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h5 className="text-xs font-bold text-slate-800">Flight & Hotel Price Drop Alerts</h5>
                <p className="text-[11px] text-slate-500">Real-time alerts when airfares or hotel rates drop for your saved trips.</p>
              </div>
              <input
                type="checkbox"
                checked={dealAlerts}
                onChange={(e) => setDealAlerts(e.target.checked)}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h5 className="text-xs font-bold text-slate-800">Daily Itinerary & Transit Timing Reminders</h5>
                <p className="text-[11px] text-slate-500">Receive morning breakdown and departure reminders during ongoing trips.</p>
              </div>
              <input
                type="checkbox"
                checked={itineraryReminders}
                onChange={(e) => setItineraryReminders(e.target.checked)}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h5 className="text-xs font-bold text-slate-800">AI Concierge Proactive Suggestions</h5>
                <p className="text-[11px] text-slate-500">Proactively suggest local cafes, weather backup activities, and scenic detours.</p>
              </div>
              <input
                type="checkbox"
                checked={aiSuggestions}
                onChange={(e) => setAiSuggestions(e.target.checked)}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Data & Backup Section */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Data Management & Offline Backup</h3>
          </div>

          <p className="text-xs text-slate-500">
            Export all your planned trips, bookings, expenses, and personal travel notes into an offline-ready JSON file.
          </p>

          {exportNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{exportNotice}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-600" />
              <span>Export Complete Trip Data (.JSON)</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Preferences saved successfully!
            </span>
          ) : <span />}

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            Save All Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
