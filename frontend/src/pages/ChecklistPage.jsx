import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Sparkles,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Luggage,
  CalendarCheck,
  AlertTriangle,
  FileDown,
  RefreshCw,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronRight,
  Sun,
  CloudRain,
  ShieldCheck,
  Compass,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChecklistTemplateModal } from '../components/checklist/ChecklistTemplateModal';
import { ChecklistItemEditModal } from '../components/checklist/ChecklistItemEditModal';
import { getCategoryIcon, getCategoryColor } from '../components/checklist/checklistUtils';

export const ChecklistPage = () => {
  const {
    checklists,
    toggleChecklistItem,
    deleteChecklistItem,
    bulkToggleChecklist,
    clearCompletedChecklist,
    generateAIChecklist,
    trips,
    activeTrip,
    setActiveTrip,
    isDarkMode,
  } = useApp();

  // State management
  const [selectedTripId, setSelectedTripId] = useState(activeTrip?.id || (trips[0]?.id ?? 'all'));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeTab, setActiveTypeTab] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [collapsedCategories, setCollapsedCategories] = useState({});

  // Modals state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Determine current active trip
  const currentTrip = useMemo(() => {
    if (selectedTripId === 'all') return undefined;
    return trips.find((t) => t.id === selectedTripId) || activeTrip;
  }, [selectedTripId, trips, activeTrip]);

  // Filtered items based on trip, search, category, type, and status
  const filteredItems = useMemo(() => {
    return checklists.filter((item) => {
      // Trip filter
      if (selectedTripId !== 'all' && item.tripId !== selectedTripId) {
        return false;
      }
      // Type tab filter
      if (activeTypeTab !== 'all' && item.type !== activeTypeTab) {
        return false;
      }
      // Status filter
      if (statusFilter === 'pending' && item.completed) return false;
      if (statusFilter === 'completed' && !item.completed) return false;
      // Priority filter
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchTitle && !matchNotes && !matchCat) return false;
      }
      return true;
    });
  }, [checklists, selectedTripId, activeTypeTab, statusFilter, priorityFilter, selectedCategory, searchQuery]);

  // Group filtered items by Category
  const groupedItems = useMemo(() => {
    const map = new Map();
    filteredItems.forEach((item) => {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    });
    return map;
  }, [filteredItems]);

  // Overall Statistics for the selected scope
  const stats = useMemo(() => {
    const scopeItems = selectedTripId === 'all'
      ? checklists
      : checklists.filter((i) => i.tripId === selectedTripId);

    const total = scopeItems.length;
    const completed = scopeItems.filter((i) => i.completed).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const packingItems = scopeItems.filter((i) => i.type === 'packing');
    const packingCompleted = packingItems.filter((i) => i.completed).length;

    const taskItems = scopeItems.filter((i) => i.type === 'task');
    const taskCompleted = taskItems.filter((i) => i.completed).length;

    const urgentTasks = taskItems.filter((i) => !i.completed && i.priority === 'high');

    return {
      total,
      completed,
      pending,
      percent,
      packingTotal: packingItems.length,
      packingCompleted,
      taskTotal: taskItems.length,
      taskCompleted,
      urgentTasks,
    };
  }, [checklists, selectedTripId]);

  // Destination Climate advice
  const climateAdvice = useMemo(() => {
    if (!currentTrip) return null;
    const dest = currentTrip.destination.toLowerCase();
    const type = currentTrip.tripType.toLowerCase();

    if (dest.includes('bali') || type.includes('beach') || dest.includes('amalfi')) {
      return {
        climate: 'Tropical & Sunny',
        temp: '28°C - 31°C',
        tip: 'High UV exposure & occasional tropical showers. Pack reef-safe SPF 50+, breathable linen, and quick-dry swimwear.',
        icon: Sun,
        color: 'text-amber-500 bg-amber-50 border-amber-100',
      };
    } else if (dest.includes('swiss') || type.includes('mountain') || dest.includes('alps')) {
      return {
        climate: 'Alpine & Variable',
        temp: '8°C - 16°C',
        tip: 'Rapid weather fluctuations at high altitudes. Carry thermal base layers, windproof softshells, and sturdy waterproof boots.',
        icon: CloudRain,
        color: 'text-blue-500 bg-blue-50 border-blue-100',
      };
    } else {
      return {
        climate: 'Temperate Urban',
        temp: '18°C - 24°C',
        tip: 'Comfortable walking temperatures. Pack comfortable trainers, portable chargers, lightweight layering, and universal adapters.',
        icon: Compass,
        color: 'text-indigo-500 bg-indigo-50 border-indigo-100',
      };
    }
  }, [currentTrip]);

  const toggleCategoryCollapse = (cat) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleRunAIChecklist = async () => {
    const tripToUse = currentTrip?.id || activeTrip.id;
    setIsGeneratingAI(true);
    try {
      await generateAIChecklist(tripToUse);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleExportText = () => {
    const tripName = currentTrip ? currentTrip.title : 'All Trips';
    const lines = [`📋 Pre-Trip Checklist: ${tripName}`, `Generated on ${new Date().toLocaleDateString()}`, ''];

    groupedItems.forEach((items, cat) => {
      lines.push(`## ${cat}`);
      items.forEach((it) => {
        const mark = it.completed ? '[x]' : '[ ]';
        const qty = it.quantity && it.quantity > 1 ? ` (x${it.quantity})` : '';
        const priority = it.priority === 'high' ? ' [URGENT]' : '';
        const due = it.dueDate ? ` (Due: ${it.dueDate})` : '';
        lines.push(`- ${mark} ${it.title}${qty}${priority}${due}`);
      });
      lines.push('');
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div id="checklist-page" className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn select-none">
      {/* Top Header & Trip Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pre-Trip Checklist & Packing</h1>
              <p className="text-xs text-slate-500">
                Organize luggage packing lists, travel documentation, and reminder tasks before you depart.
              </p>
            </div>
          </div>
        </div>

        {/* Trip Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Trip Selector */}
          <div className="relative">
            <select
              id="checklist-trip-select"
              value={selectedTripId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedTripId(val);
                if (val !== 'all') {
                  const t = trips.find((item) => item.id === val);
                  if (t) setActiveTrip(t);
                }
              }}
              className="px-3.5 py-2 pr-9 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">🌐 All Trips Combined</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  ✈️ {t.title} ({t.destination})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* AI Generator Button */}
          <button
            id="ai-generate-checklist-btn"
            onClick={handleRunAIChecklist}
            disabled={isGeneratingAI}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            title="Generate custom packing & tasks using destination weather & activities"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'AI Scanning...' : 'AI Auto-Suggest'}</span>
          </button>

          {/* Template Modal Trigger */}
          <button
            id="checklist-templates-btn"
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <span>📋 Templates</span>
          </button>

          {/* Add Item Button */}
          <button
            id="add-checklist-item-btn"
            onClick={() => {
              setItemToEdit(null);
              setIsEditModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Progress & Travel Intelligence Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Readiness Ring Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-sky-600 transition-all duration-700 ease-out"
                strokeDasharray={`${stats.percent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-black text-slate-900">{stats.percent}%</span>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Travel Readiness</h3>
            <p className="text-base font-extrabold text-slate-900">
              {stats.completed} of {stats.total} Ready
            </p>
            <p className="text-[11px] text-slate-500">
              {stats.percent === 100
                ? '🎉 All packed & prepared!'
                : `${stats.pending} item${stats.pending === 1 ? '' : 's'} remaining`}
            </p>
          </div>
        </div>

        {/* Packing Metric */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <Luggage className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Luggage Packed</span>
            <p className="text-lg font-bold text-slate-900">
              {stats.packingCompleted}{' '}
              <span className="text-xs font-medium text-slate-400">/ {stats.packingTotal} items</span>
            </p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stats.packingTotal > 0 ? (stats.packingCompleted / stats.packingTotal) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Task Metric */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tasks Completed</span>
            <p className="text-lg font-bold text-slate-900">
              {stats.taskCompleted}{' '}
              <span className="text-xs font-medium text-slate-400">/ {stats.taskTotal} tasks</span>
            </p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stats.taskTotal > 0 ? (stats.taskCompleted / stats.taskTotal) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Destination Climate & Tip Card */}
        {climateAdvice && (
          <div className={`p-4 rounded-2xl border flex items-start gap-3 md:col-span-3 lg:col-span-1 ${climateAdvice.color}`}>
            <climateAdvice.icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <div className="flex items-center justify-between font-bold">
                <span>{climateAdvice.climate}</span>
                <span className="text-[11px] opacity-80">{climateAdvice.temp}</span>
              </div>
              <p className="opacity-90 mt-1 line-clamp-2 text-[11px]">{climateAdvice.tip}</p>
            </div>
          </div>
        )}
      </div>

      {/* Urgent Reminders Callout Banner (if any high priority pending items exist) */}
      {stats.urgentTasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                {stats.urgentTasks.length} Urgent Pre-Departure Reminder{stats.urgentTasks.length > 1 ? 's' : ''}
              </h4>
              <p className="text-xs text-rose-700 font-medium">
                {stats.urgentTasks[0].title}
                {stats.urgentTasks[0].dueDate ? ` — ${stats.urgentTasks[0].dueDate}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleChecklistItem(stats.urgentTasks[0].id)}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 font-semibold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            Mark Done
          </button>
        </div>
      )}

      {/* Interactive Controls & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        {/* Top filter row: Type tabs + Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Type Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTypeTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTypeTab === 'all'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Items ({stats.total})
            </button>
            <button
              onClick={() => setActiveTypeTab('packing')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTypeTab === 'packing'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Luggage className="w-3.5 h-3.5" />
              Packing ({stats.packingTotal})
            </button>
            <button
              onClick={() => setActiveTypeTab('task')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTypeTab === 'task'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Tasks & Reminders ({stats.taskTotal})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items, tags, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Bottom filter row: Category pills, priority filter, completion status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-semibold mr-1">Filter:</span>
            {/* Status pill toggles */}
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending Only ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Completed ({stats.completed})
            </button>

            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold outline-none hover:bg-slate-200 transition-colors"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">⚪ Low Priority</option>
            </select>
          </div>

          {/* Batch operations & Export */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportText}
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold transition-colors"
              title="Copy checklist as markdown text"
            >
              {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copySuccess ? 'Copied!' : 'Copy / Export'}</span>
            </button>

            {stats.completed > 0 && (
              <button
                onClick={() => clearCompletedChecklist(selectedTripId)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Done</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Checklist Category Sections */}
      {groupedItems.size === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <Luggage className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No items found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {searchQuery || priorityFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search query or filter options above.'
                : 'Your checklist is empty for this trip. Generate packing suggestions or apply a travel pack template to get started!'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRunAIChecklist}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md shadow-indigo-100 hover:opacity-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Auto-Suggest Items</span>
            </button>
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              <span>Browse Templates</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(groupedItems.entries()).map(([category, items]) => {
            const Icon = getCategoryIcon(category);
            const color = getCategoryColor(category);
            const isCollapsed = !!collapsedCategories[category];

            const catCompleted = items.filter((i) => i.completed).length;
            const catTotal = items.length;
            const isCatAllDone = catCompleted === catTotal && catTotal > 0;

            return (
              <div
                key={category}
                id={`category-section-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all"
              >
                {/* Category Accordion Header */}
                <div className="p-4 bg-slate-50/70 flex items-center justify-between gap-3 border-b border-slate-100">
                  <div
                    onClick={() => toggleCategoryCollapse(category)}
                    className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                  >
                    <button className="text-slate-400 hover:text-slate-600">
                      {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color.bg} ${color.icon}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{category}</h3>
                        <span className="text-[11px] font-semibold text-slate-500">
                          ({catCompleted}/{catTotal})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Batch category actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const targetStatus = !isCatAllDone;
                        bulkToggleChecklist(
                          items.map((i) => i.id),
                          targetStatus
                        );
                      }}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                        isCatAllDone
                          ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                      }`}
                    >
                      {isCatAllDone ? 'Uncheck All' : 'Mark All Done'}
                    </button>
                  </div>
                </div>

                {/* Items List */}
                {!isCollapsed && (
                  <div className="divide-y divide-slate-100">
                    {items.map((item) => {
                      const isHighPriority = item.priority === 'high';
                      const isTask = item.type === 'task';

                      return (
                        <div
                          key={item.id}
                          id={`checklist-item-${item.id}`}
                          className={`p-3.5 flex items-start justify-between gap-3 transition-colors ${
                            item.completed ? 'bg-slate-50/40 opacity-75' : 'hover:bg-slate-50/60 bg-white'
                          }`}
                        >
                          {/* Left: Checkbox + Title + Meta */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Checkbox Trigger */}
                            <button
                              onClick={() => toggleChecklistItem(item.id)}
                              className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0 cursor-pointer"
                              title={item.completed ? 'Mark pending' : 'Mark packed/completed'}
                            >
                              {item.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                              ) : (
                                <Circle className="w-5 h-5 hover:text-indigo-500" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center flex-wrap gap-2">
                                <span
                                  onClick={() => toggleChecklistItem(item.id)}
                                  className={`text-sm font-semibold cursor-pointer transition-all ${
                                    item.completed ? 'line-through text-slate-400' : 'text-slate-800 hover:text-indigo-600'
                                  }`}
                                >
                                  {item.title}
                                </span>

                                {/* Quantity Pill */}
                                {item.quantity && item.quantity > 1 && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                    x{item.quantity}
                                  </span>
                                )}

                                {/* Priority Badge */}
                                {isHighPriority && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100">
                                    Urgent
                                  </span>
                                )}

                                {/* Type Tag if viewing all */}
                                {activeTypeTab === 'all' && (
                                  <span
                                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                      isTask ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'
                                    }`}
                                  >
                                    {isTask ? 'Task' : 'Pack'}
                                  </span>
                                )}
                              </div>

                              {/* Due Date & Notes */}
                              <div className="flex items-center flex-wrap gap-3 text-[11px] text-slate-500">
                                {item.dueDate && (
                                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                                    <Clock className="w-3 h-3" />
                                    {item.dueDate}
                                  </span>
                                )}
                                {item.notes && <span className="text-slate-400 italic truncate max-w-md">{item.notes}</span>}
                              </div>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-1 opacity-80 hover:opacity-100 shrink-0">
                            <button
                              onClick={() => {
                                setItemToEdit(item);
                                setIsEditModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Edit item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteChecklistItem(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Template Modal */}
      <ChecklistTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        selectedTripId={selectedTripId}
      />

      {/* Add / Edit Item Modal */}
      <ChecklistItemEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setItemToEdit(null);
        }}
        itemToEdit={itemToEdit}
        defaultTripId={selectedTripId !== 'all' ? selectedTripId : activeTrip.id}
      />
    </div>
  );
};
