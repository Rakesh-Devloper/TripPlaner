import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Sparkles,
  Lightbulb,
  Plane,
  Utensils,
  Send,
  Loader2,
  Bot,
  DollarSign,
  CheckSquare,
  CheckCircle2,
  Circle,
  ArrowRight,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';

const COLORS = ['#0284c7', '#2563eb', '#10b981', '#f59e0b', '#ec4899'];

export const RightSidebar = () => {
  const { activeTrip, setActivePage, checklists, toggleChecklistItem } = useApp();

  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [quickMessages, setQuickMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I'm ready to assist with your ${activeTrip.title || 'trip'}. Ask me for recommendations, hidden gems, or budget advice!`,
      time: 'Just now',
    },
  ]);

  const tripChecklistItems = checklists.filter((i) => i.tripId === activeTrip.id);
  const checklistTotal = tripChecklistItems.length;
  const checklistCompleted = tripChecklistItems.filter((i) => i.completed).length;
  const checklistPercent = checklistTotal > 0 ? Math.round((checklistCompleted / checklistTotal) * 100) : 0;
  const topPendingTasks = tripChecklistItems.filter((i) => !i.completed).slice(0, 3);

  const budgetData = [
    { name: 'Flights', value: activeTrip.budgetBreakdown?.flights || 450 },
    { name: 'Hotels', value: activeTrip.budgetBreakdown?.hotels || 350 },
    { name: 'Activities', value: activeTrip.budgetBreakdown?.activities || 200 },
    { name: 'Food', value: activeTrip.budgetBreakdown?.food || 100 },
    { name: 'Transport', value: activeTrip.budgetBreakdown?.transport || 49 },
  ];

  const totalBudget = budgetData.reduce((sum, item) => sum + item.value, 0);

  const handleSendMessage = async (customText) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text: textToSend, time: timeNow };
    setQuickMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await api.askChat(textToSend, {
        destination: activeTrip.destination,
        dates: `${activeTrip.startDate} - ${activeTrip.endDate}`,
        travelers: activeTrip.travelers,
        budget: `$${totalBudget}`,
      });

      setQuickMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response.text || "Here's the best recommendation for your journey!",
          time: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <aside
      id="dashboard-right-sidebar"
      className="w-full xl:w-[320px] shrink-0 space-y-4"
    >
      {/* 1. Trip Summary Card */}
      <div
        id="right-trip-summary-card"
        className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight uppercase">Next Trip Overview</h3>
          <span className="text-[10px] font-bold text-sky-800 bg-sky-50 border border-sky-200/60 px-2 py-0.5 rounded-full">
            {activeTrip.status}
          </span>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-sky-600">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <h4 className="font-bold text-sm text-slate-800 tracking-tight">
              {activeTrip.title}
            </h4>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-0.5">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>
              {activeTrip.startDate} – {activeTrip.endDate}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-1.5 mt-3 bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Duration</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{activeTrip.days} Days</p>
            </div>
            <div className="border-x border-slate-200/60">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Party</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{activeTrip.travelers}</p>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Activities</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {activeTrip.activitiesCount}
              </p>
            </div>
          </div>

          {/* Planning Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-slate-500">Trip Readiness</span>
              <span className="text-sky-700 font-extrabold">{activeTrip.progress || 75}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${activeTrip.progress || 75}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Trip Packing & Checklist Mini Card */}
      <div
        id="right-checklist-summary-card"
        className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-900 tracking-tight uppercase">Pre-Trip Checklist</h3>
          </div>
          <button
            onClick={() => setActivePage('Pre-Trip Checklist')}
            className="text-[10px] font-bold text-sky-700 hover:text-sky-800 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Progress summary */}
        <div className="mt-2.5 flex items-center justify-between text-xs">
          <span className="text-[11px] font-medium text-slate-500">
            {checklistCompleted} of {checklistTotal} packed / done
          </span>
          <span className="text-[11px] font-bold text-sky-700">{checklistPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
          <div
            className="h-full bg-sky-600 rounded-full transition-all duration-500"
            style={{ width: `${checklistPercent}%` }}
          />
        </div>

        {/* Top 3 Quick Items */}
        <div className="mt-3 space-y-1.5">
          {topPendingTasks.length === 0 ? (
            <p className="text-[11px] text-emerald-600 font-semibold py-1">
              ✨ All {checklistTotal} pre-trip items are ready!
            </p>
          ) : (
            topPendingTasks.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-left transition-colors cursor-pointer group"
              >
                <Circle className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 shrink-0" />
                <span className="text-xs font-medium text-slate-700 truncate flex-1 group-hover:text-sky-700">
                  {item.title}
                </span>
                {item.priority === 'high' && (
                  <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 py-0.2 rounded shrink-0">
                    Urgent
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Budget Breakdown Card */}
      <div
        id="right-budget-breakdown-card"
        className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 tracking-tight uppercase">Budget Allocation</h3>
          </div>
          <button
            onClick={() => setActivePage('Budget Tracker')}
            className="text-[10px] font-bold text-sky-700 hover:text-sky-800 hover:underline cursor-pointer"
          >
            Manage
          </button>
        </div>

        {/* Recharts Donut Chart */}
        <div className="relative h-36 w-full mt-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={56}
                paddingAngle={3}
                dataKey="value"
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`$${value}`, 'Budget']}
                contentStyle={{
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Total</span>
            <span className="text-sm font-extrabold text-slate-900">${totalBudget}</span>
          </div>
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 gap-1.5 mt-1 pt-2 border-t border-slate-100">
          {budgetData.map((item, idx) => (
            <div key={item.name} className="flex items-center justify-between text-xs py-0.5">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-slate-600 text-[10px] font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-slate-800 text-[10px]">${item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI Travel Tip Banner */}
      <div
        id="right-ai-travel-tips-card"
        className="bg-gradient-to-br from-sky-50 via-blue-50/60 to-indigo-50/40 rounded-2xl p-3.5 border border-sky-100 shadow-xs"
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <h3 className="text-xs font-bold text-sky-950 tracking-tight">AI Travel Insight</h3>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
          Best time to visit Bali is April to October with sunny skies and lower humidity.
        </p>
        <button
          onClick={() => setActivePage('AI Trip Planner')}
          className="w-full mt-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-[10px] font-bold py-1.5 rounded-lg shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
        >
          Explore Smart Suggestions
        </button>
      </div>

      {/* 4. Ask AI Travel Assistant Mini Card */}
      <div
        id="right-ask-ai-assistant-card"
        className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Bot className="w-3 h-3" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              AI Travel Assistant
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </div>
        </div>

        {/* Chat Mini Thread */}
        <div className="mt-2.5 max-h-36 overflow-y-auto space-y-1.5 text-xs scrollbar-thin pr-1">
          {quickMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white ml-5 shadow-xs'
                  : 'bg-slate-50 border border-slate-100 text-slate-700 mr-3'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-line text-[10px]">{msg.text}</p>
            </div>
          ))}

          {chatLoading && (
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 mr-3 flex items-center gap-1.5 text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin text-sky-600" />
              <span>Thinking...</span>
            </div>
          )}
        </div>

        {/* Quick prompt pills */}
        <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-slate-100">
          {['Hidden gems?', 'Cheaper stay?'].map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => handleSendMessage(pill)}
              className="text-[9px] font-bold bg-slate-50 hover:bg-sky-50 hover:text-sky-700 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200/60 transition-colors cursor-pointer"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-2.5 relative flex items-center"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask AI anything..."
            className="w-full text-[11px] py-1.5 pl-2.5 pr-8 bg-slate-50 rounded-lg border border-slate-200/80 outline-none focus:border-sky-500 focus:bg-white transition-colors placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || chatLoading}
            className="absolute right-1 p-1 rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 transition-colors cursor-pointer"
            aria-label="Send query"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </aside>
  );
};
