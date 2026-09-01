import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Plus,
  PieChart as PieIcon,
  BarChart3,
  TrendingDown,
  ArrowUpRight,
  CheckCircle2,
  Trash2,
  X,
  Hotel,
  Plane,
  Utensils,
  Ticket,
  Car,
  ShoppingBag,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/BackButton';

// Category color mappings and icons
const CATEGORY_CONFIG = {
  Hotels: { label: 'Lodging & Hotels', color: '#2563eb', bg: 'bg-blue-50 text-blue-700', icon: Hotel },
  Flights: { label: 'Flights & Airfare', color: '#0284c7', bg: 'bg-sky-50 text-sky-700', icon: Plane },
  Activities: { label: 'Activities & Tours', color: '#f59e0b', bg: 'bg-amber-50 text-amber-700', icon: Ticket },
  Food: { label: 'Food & Dining', color: '#10b981', bg: 'bg-emerald-50 text-emerald-700', icon: Utensils },
  Transport: { label: 'Local Transport', color: '#8b5cf6', bg: 'bg-purple-50 text-purple-700', icon: Car },
  Shopping: { label: 'Shopping & Misc', color: '#ec4899', bg: 'bg-pink-50 text-pink-700', icon: ShoppingBag },
  Other: { label: 'Other Expenses', color: '#64748b', bg: 'bg-slate-50 text-slate-700', icon: DollarSign },
};

export const BudgetTrackerPage = () => {
  const { expenses, setExpenses, addNewExpense, activeTrip } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState('All');
  const [chartView, setChartView] = useState('both');
  const [activeIndex, setActiveIndex] = useState(null);

  // New Expense form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Food');
  const [newAmount, setNewAmount] = useState(45);
  const [newDate, setNewDate] = useState(
    new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  );

  const totalSpent = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);
  const plannedBudget = activeTrip.estimatedCost || 1149;
  const remainingBudget = Math.max(0, plannedBudget - totalSpent);
  const budgetSpentPercent = Math.min(100, Math.round((totalSpent / plannedBudget) * 100));

  // Calculate totals by category
  const categoryTotals = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      const cat = exp.category || 'Other';
      acc[cat] = (acc[cat] || 0) + exp.amount;
      return acc;
    }, {});
  }, [expenses]);

  // Categories present in expenses with values > 0
  const pieChartData = useMemo(() => {
    const rawData = [
      { name: 'Lodging & Hotels', rawCategory: 'Hotels', value: categoryTotals['Hotels'] || 0, color: '#2563eb' },
      { name: 'Flights & Airfare', rawCategory: 'Flights', value: categoryTotals['Flights'] || 0, color: '#0284c7' },
      { name: 'Activities & Tours', rawCategory: 'Activities', value: categoryTotals['Activities'] || 0, color: '#f59e0b' },
      { name: 'Food & Dining', rawCategory: 'Food', value: categoryTotals['Food'] || 0, color: '#10b981' },
      { name: 'Local Transport', rawCategory: 'Transport', value: categoryTotals['Transport'] || 0, color: '#8b5cf6' },
      { name: 'Shopping & Misc', rawCategory: 'Shopping', value: categoryTotals['Shopping'] || 0, color: '#ec4899' },
    ];

    // Filter out 0 value items if total > 0, otherwise show default preview
    const activeItems = rawData.filter((d) => d.value > 0);
    if (activeItems.length > 0) {
      return activeItems.map((item) => ({
        ...item,
        percentage: totalSpent > 0 ? Math.round((item.value / totalSpent) * 100) : 0,
      }));
    }

    return [
      { name: 'Lodging & Hotels', rawCategory: 'Hotels', value: 350, color: '#2563eb', percentage: 32 },
      { name: 'Flights & Airfare', rawCategory: 'Flights', value: 450, color: '#0284c7', percentage: 41 },
      { name: 'Activities & Tours', rawCategory: 'Activities', value: 155, color: '#f59e0b', percentage: 14 },
      { name: 'Food & Dining', rawCategory: 'Food', value: 100, color: '#10b981', percentage: 9 },
      { name: 'Local Transport', rawCategory: 'Transport', value: 49, color: '#8b5cf6', percentage: 4 },
    ];
  }, [categoryTotals, totalSpent]);

  // Bar chart data
  const barChartData = useMemo(() => {
    return [
      { name: 'Lodging', amount: categoryTotals['Hotels'] || 0, fill: '#2563eb' },
      { name: 'Flights', amount: categoryTotals['Flights'] || 0, fill: '#0284c7' },
      { name: 'Activities', amount: categoryTotals['Activities'] || 0, fill: '#f59e0b' },
      { name: 'Food', amount: categoryTotals['Food'] || 0, fill: '#10b981' },
      { name: 'Transport', amount: categoryTotals['Transport'] || 0, fill: '#8b5cf6' },
      { name: 'Shopping', amount: categoryTotals['Shopping'] || 0, fill: '#ec4899' },
    ];
  }, [categoryTotals]);

  // Filtered expense list
  const filteredExpenses = useMemo(() => {
    if (activeCategoryTab === 'All') return expenses;
    return expenses.filter((e) => e.category === activeCategoryTab);
  }, [expenses, activeCategoryTab]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    addNewExpense({
      tripId: activeTrip.id,
      category: newCategory,
      title: newTitle,
      amount: Number(newAmount),
      date: newDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isPlanned: false,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewAmount(45);
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div id="budget-tracker-page" className="space-y-6">
      {/* Top Breadcrumb / Back Button Bar */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Dashboard" fallbackPage="Dashboard" />
        <span className="text-xs font-semibold text-slate-400">Trip Budget & Expenses</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Travel Budget & Expense Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Active Trip: <span className="font-bold text-sky-700">{activeTrip.title}</span> • {activeTrip.destination}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Allocated Budget
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">${plannedBudget}</h3>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full" style={{ width: `${budgetSpentPercent}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 flex justify-between font-medium">
            <span>{budgetSpentPercent}% used</span>
            <span>Target: ${plannedBudget}</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Spent So Far
          </span>
          <h3 className="text-2xl font-extrabold text-sky-700 mt-1">${totalSpent}</h3>
          <p className="text-xs text-slate-500 mt-1">{expenses.length} logged transactions</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tracking on schedule</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Remaining Budget
          </span>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">${remainingBudget}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            ${Math.max(0, Math.round(remainingBudget / (activeTrip.days || 6)))}/day available
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2 font-medium">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>AI Budget Health: Excellent</span>
          </div>
        </div>
      </div>

      {/* Main Visualizer Section: Pie Chart + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recharts Pie Chart & Donut Analytics (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-sky-600" />
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Expense Breakdown by Category
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualizing lodging, airfare, activities, food & transport allocation
              </p>
            </div>

            {/* Visualizer Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl self-start sm:self-auto border border-slate-200/70">
              <button
                type="button"
                onClick={() => setChartView('pie')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  chartView === 'pie'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PieIcon className="w-3 h-3" />
                <span>Pie</span>
              </button>

              <button
                type="button"
                onClick={() => setChartView('bar')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  chartView === 'bar'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                <span>Bar</span>
              </button>

              <button
                type="button"
                onClick={() => setChartView('both')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  chartView === 'both'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Both</span>
              </button>
            </div>
          </div>

          {/* Chart Display Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Donut / Pie Chart */}
            {(chartView === 'pie' || chartView === 'both') && (
              <div className="relative h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={88}
                      paddingAngle={3}
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                      onMouseLeave={onPieLeave}
                      animationDuration={800}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`pie-cell-${index}`}
                          fill={entry.color}
                          stroke="#ffffff"
                          strokeWidth={activeIndex === index ? 3 : 1.5}
                          style={{
                            filter: activeIndex === index ? 'drop-shadow(0px 4px 8px rgba(0,0,0,0.15))' : 'none',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, item) => [
                        `$${value} (${item.payload.percentage || Math.round((Number(value) / totalSpent) * 100)}%)`,
                        item.payload.name,
                      ]}
                      contentStyle={{
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        padding: '8px 12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Donut Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Spent
                  </span>
                  <span className="text-xl font-black text-slate-900">${totalSpent}</span>
                  <span className="text-[9px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.2 rounded-md mt-0.5">
                    {expenses.length} items
                  </span>
                </div>
              </div>
            )}

            {/* Bar Chart (if 'bar' or 'both') */}
            {(chartView === 'bar' || chartView === 'both') && (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} barSize={chartView === 'both' ? 24 : 36}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      formatter={(val) => [`$${val}`, 'Spent']}
                      contentStyle={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px' }}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Interactive Category Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100">
            {pieChartData.map((item, idx) => {
              const isHovered = activeIndex === idx;
              const config = CATEGORY_CONFIG[item.rawCategory] || CATEGORY_CONFIG['Other'];

              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                    isHovered
                      ? 'bg-slate-50 border-slate-300 shadow-xs scale-102'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-md shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800 truncate">{item.name}</span>
                      <span className="font-extrabold text-slate-900">${item.value}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-0.5">
                      <span>{item.percentage}% of total</span>
                      <span className="text-sky-600 font-bold">
                        {expenses.filter((e) => e.category === item.rawCategory).length} items
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Expenses Ledger & Category Filters (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Expense Records
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {filteredExpenses.length} entries
              </span>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
              {['All', 'Hotels', 'Flights', 'Activities', 'Food', 'Transport', 'Shopping'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryTab(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategoryTab === cat
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'All' : cat}
                </button>
              ))}
            </div>

            {/* Expenses List */}
            <div className="space-y-2 max-h-[340px] overflow-y-auto scrollbar-thin pr-1 mt-2">
              {filteredExpenses.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No recorded expenses in this category.
                </div>
              ) : (
                filteredExpenses.map((exp) => {
                  const config = CATEGORY_CONFIG[exp.category] || CATEGORY_CONFIG['Other'];
                  const IconComp = config.icon;

                  return (
                    <div
                      key={exp.id}
                      className="group flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-800 truncate group-hover:text-sky-700 transition-colors">
                            {exp.title}
                          </h5>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                            <span className="font-semibold">{config.label}</span>
                            <span>•</span>
                            <span>{exp.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="font-black text-xs text-slate-900">${exp.amount}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50"
                          title="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200/80 hover:bg-sky-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Expense Entry</span>
          </button>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto my-auto animate-in zoom-in-95 duration-150 relative overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Add Trip Expense</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Expense Title / Description
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Traditional Balinese Dinner or Airport Taxi"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-all font-medium text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold text-slate-800"
                  >
                    <option value="Hotels">Lodging & Hotels</option>
                    <option value="Flights">Flights & Airfare</option>
                    <option value="Activities">Activities & Tours</option>
                    <option value="Food">Food & Dining</option>
                    <option value="Transport">Local Transport</option>
                    <option value="Shopping">Shopping & Misc</option>
                    <option value="Other">Other Expenses</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-all font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Date
                </label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. May 26, 2025"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
