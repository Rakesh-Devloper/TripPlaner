import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plane,
  Building,
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Plus,
  Compass,
  AlertCircle,
  Tag,
  Filter,
  Check,
  CalendarDays,
  ListTodo,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MonthlyTripCalendar = () => {
  const {
    trips,
    bookings,
    checklists,
    toggleChecklistItem,
    addChecklistItem,
    setActiveTrip,
    setActivePage,
    isDarkMode,
  } = useApp();

  // Helper date parsing
  const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    // Try parsing formats like "May 25, 2025", "2025-05-25", "May 25 – May 31, 2025"
    try {
      if (dateStr.includes('–') || dateStr.includes('-')) {
        const firstPart = dateStr.split(/[–-]/)[0].trim();
        const d = new Date(firstPart);
        if (!isNaN(d.getTime())) return d;
      }
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d;
    } catch (e) {
      return null;
    }
    return null;
  };

  // Find initial month from active/first trip or current year/month
  const initialDate = useMemo(() => {
    if (trips.length > 0) {
      // Find the earliest upcoming or confirmed trip
      const confirmed = trips.find((t) => t.status === 'Confirmed') || trips[0];
      const parsed = parseDateString(confirmed.startDate);
      if (parsed) return parsed;
    }
    return new Date(2025, 4, 1); // Default to May 2025 (matching seed trip dates)
  }, [trips]);

  const [currentMonthDate, setCurrentMonthDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default select the first day of the active trip (May 25, 2025)
    return new Date(2025, 4, 25);
  });
  const [selectedTripFilter, setSelectedTripFilter] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddQuickTask, setShowAddQuickTask] = useState(false);

  // Month navigation helpers
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const jumpToTrip = (trip) => {
    const d = parseDateString(trip.startDate);
    if (d) {
      setCurrentMonthDate(new Date(d.getFullYear(), d.getMonth(), 1));
      setSelectedDate(d);
      setSelectedTripFilter(trip.id);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate calendar grid days
  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const days = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: d,
        isCurrentMonth: false,
        dayNumber: d.getDate(),
        dateString: d.toISOString().split('T')[0],
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        isCurrentMonth: true,
        dayNumber: i,
        dateString: d.toISOString().split('T')[0],
      });
    }

    // Next month padding to make full 35 or 42 grid cells
    const remaining = 42 - days.length;
    if (remaining > 0 && remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({
          date: d,
          isCurrentMonth: false,
          dayNumber: i,
          dateString: d.toISOString().split('T')[0],
        });
      }
    } else if (days.length <= 35) {
      const fillTo35 = 35 - days.length;
      for (let i = 1; i <= fillTo35; i++) {
        const d = new Date(year, month + 1, i);
        days.push({
          date: d,
          isCurrentMonth: false,
          dayNumber: i,
          dateString: d.toISOString().split('T')[0],
        });
      }
    }

    return days;
  }, [year, month]);

  // Check if a date falls within a trip range
  const getTripsForDate = (date) => {
    return trips
      .filter((t) => selectedTripFilter === 'all' || t.id === selectedTripFilter)
      .map((trip) => {
        const start = parseDateString(trip.startDate);
        const end = parseDateString(trip.endDate);
        if (!start) return null;

        // Strip times for precise date comparison
        const checkTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
        const endTime = end
          ? new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime()
          : startTime + (trip.days - 1) * 86400000;

        if (checkTime >= startTime && checkTime <= endTime) {
          const diffDays = Math.round((checkTime - startTime) / 86400000);
          const dayNumber = diffDays + 1;
          const dayItinerary = trip.daysItinerary?.find((d) => d.dayNumber === dayNumber);
          return {
            trip,
            dayIndex: dayNumber,
            isStart: checkTime === startTime,
            isEnd: checkTime === endTime,
            dayItinerary,
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  // Check bookings for a date
  const getBookingsForDate = (date) => {
    return bookings.filter((b) => {
      if (!b.date) return false;
      const bDate = parseDateString(b.date);
      if (!bDate) return false;
      return (
        bDate.getFullYear() === date.getFullYear() &&
        bDate.getMonth() === date.getMonth() &&
        bDate.getDate() === date.getDate()
      );
    });
  };

  // Check tasks for a date (or pre-trip checklist items associated with trips on/before this date)
  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const tripsOnDate = getTripsForDate(date);
    const tripIds = new Set(tripsOnDate.map((t) => t.trip.id));

    return checklists.filter((item) => {
      // Direct due date match
      if (item.dueDate === dateStr) return true;
      // Or if due date has "May 25", etc.
      if (item.dueDate && item.dueDate.includes(monthNames[date.getMonth()].substring(0, 3))) {
        const itemDate = parseDateString(item.dueDate);
        if (itemDate && itemDate.getDate() === date.getDate()) return true;
      }
      // If associated with a trip starting on or around this day
      if (tripIds.has(item.tripId) && item.type === 'task') {
        const tr = trips.find((t) => t.id === item.tripId);
        if (tr) {
          const st = parseDateString(tr.startDate);
          if (st && Math.abs(date.getTime() - st.getTime()) <= 86400000 * 2) {
            return true;
          }
        }
      }
      return false;
    });
  };

  // Selected Day Data
  const selectedDayTrips = useMemo(() => getTripsForDate(selectedDate), [selectedDate, trips, selectedTripFilter]);
  const selectedDayBookings = useMemo(() => getBookingsForDate(selectedDate), [selectedDate, bookings]);
  const selectedDayTasks = useMemo(() => getTasksForDate(selectedDate), [selectedDate, checklists]);

  const handleAddQuickTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const currentTripId = selectedDayTrips.length > 0 ? selectedDayTrips[0].trip.id : trips[0]?.id || 'trip_bali_1';

    addChecklistItem({
      tripId: currentTripId,
      title: newTaskTitle.trim(),
      category: 'Pre-Trip Tasks',
      type: 'task',
      completed: false,
      priority: 'high',
      dueDate: selectedDate.toISOString().split('T')[0],
      notes: `Scheduled for ${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`,
    });

    setNewTaskTitle('');
    setShowAddQuickTask(false);
  };

  const isToday = (d) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (d) => {
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div
      id="dashboard-monthly-calendar-widget"
      className={`rounded-3xl border transition-all duration-300 ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 shadow-[0_0_30px_rgba(14,165,233,0.12)] text-slate-100'
          : 'bg-white border-slate-200/80 shadow-sm text-slate-900'
      } p-5 sm:p-6`}
    >
      {/* Calendar Header with Controls & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isDarkMode
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                : 'bg-sky-50 text-sky-600 border border-sky-100 shadow-xs'
            }`}
          >
            <CalendarDays className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Monthly Travel & Task Calendar
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isDarkMode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any date to inspect daily itineraries, flights, and pre-trip checklists.
            </p>
          </div>
        </div>

        {/* Month Navigation & Trip Jump Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Trip Selector Filter */}
          <select
            value={selectedTripFilter}
            onChange={(e) => {
              setSelectedTripFilter(e.target.value);
              if (e.target.value !== 'all') {
                const tr = trips.find((t) => t.id === e.target.value);
                if (tr) jumpToTrip(tr);
              }
            }}
            aria-label="Filter trips by destination"
            className={`text-xs font-bold px-3 py-2 rounded-xl border transition-colors outline-hidden cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-sky-500/50 focus:border-sky-400'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <option value="all">All Scheduled Trips ({trips.length})</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.title} ({trip.startDate.split(',')[0]})
              </option>
            ))}
          </select>

          {/* Month Navigation Buttons */}
          <div
            className={`flex items-center rounded-xl border p-0.5 ${
              isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200/80'
            }`}
          >
            <button
              type="button"
              onClick={prevMonth}
              className={`p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors cursor-pointer`}
              title="Previous Month"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 text-xs font-black tracking-wide min-w-[110px] text-center">
              {monthNames[month]} {year}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className={`p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors cursor-pointer`}
              title="Next Month"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Jump to Active Trip (Bali May 2025 or current) */}
          {trips.length > 0 && (
            <button
              type="button"
              onClick={() => jumpToTrip(trips[0])}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isDarkMode
                  ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40 hover:bg-sky-600/50 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                  : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Jump to {trips[0].title}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid + Inspector Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-5">
        {/* Left / Top Area: Monthly Calendar Grid (7 Cols on xl) */}
        <div className="xl:col-span-7 flex flex-col space-y-3">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 uppercase tracking-wider py-1">
            {daysOfWeek.map((day, idx) => (
              <div
                key={day}
                className={idx === 0 || idx === 6 ? 'text-amber-500/80 dark:text-amber-400/70' : ''}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarGrid.map(({ date, isCurrentMonth, dayNumber, dateString }) => {
              const tripsOnDay = getTripsForDate(date);
              const bookingsOnDay = getBookingsForDate(date);
              const tasksOnDay = getTasksForDate(date);
              const hasTrip = tripsOnDay.length > 0;
              const hasFlight = bookingsOnDay.some((b) => b.type === 'flight');
              const hasHotel = bookingsOnDay.some((b) => b.type === 'hotel');
              const hasTask = tasksOnDay.length > 0;
              const isSelectedDay = isSelected(date);
              const isTodayDay = isToday(date);

              // Trip color styling
              const primaryTrip = tripsOnDay[0]?.trip;
              const isStart = tripsOnDay[0]?.isStart;
              const isEnd = tripsOnDay[0]?.isEnd;

              return (
                <button
                  type="button"
                  key={dateString}
                  onClick={() => setSelectedDate(date)}
                  className={`relative min-h-[74px] sm:min-h-[86px] p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between transition-all duration-200 text-left cursor-pointer group ${
                    isSelectedDay
                      ? isDarkMode
                        ? 'bg-sky-950/80 border-2 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-[1.02] z-10'
                        : 'bg-sky-50 border-2 border-sky-500 shadow-md scale-[1.02] z-10'
                      : isCurrentMonth
                      ? isDarkMode
                        ? 'bg-slate-800/50 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 hover:shadow-md'
                        : 'bg-slate-50/70 border border-slate-200/60 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                      : isDarkMode
                      ? 'bg-slate-900/30 border border-transparent opacity-40 hover:opacity-75'
                      : 'bg-slate-100/40 border border-transparent opacity-40 hover:opacity-75'
                  }`}
                >
                  {/* Top row: Day Number + Status Dots */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-extrabold w-6 h-6 rounded-full flex items-center justify-center ${
                        isTodayDay
                          ? isDarkMode
                            ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                            : 'bg-amber-500 text-white font-black'
                          : isSelectedDay
                          ? isDarkMode
                            ? 'bg-sky-500 text-slate-950 font-black shadow-[0_0_10px_rgba(14,165,233,0.6)]'
                            : 'bg-sky-600 text-white font-black'
                          : isCurrentMonth
                          ? isDarkMode
                            ? 'text-slate-200'
                            : 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {dayNumber}
                    </span>

                    {/* Indicator mini dots */}
                    <div className="flex items-center gap-1">
                      {hasFlight && (
                        <Plane
                          className={`w-3 h-3 ${
                            isDarkMode ? 'text-cyan-400 animate-pulse' : 'text-sky-600'
                          }`}
                        />
                      )}
                      {hasHotel && (
                        <Building
                          className={`w-3 h-3 ${
                            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                          }`}
                        />
                      )}
                      {hasTask && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            tasksOnDay.every((t) => t.completed)
                              ? 'bg-emerald-500'
                              : 'bg-amber-500 animate-ping'
                          }`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Trip Banner if active on this day */}
                  {hasTrip ? (
                    <div className="mt-1 space-y-1">
                      <div
                        className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-lg truncate border flex items-center gap-1 ${
                          primaryTrip?.status === 'Confirmed'
                            ? isDarkMode
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : isDarkMode
                            ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 shadow-[0_0_8px_rgba(14,165,233,0.2)]'
                            : 'bg-sky-50 border-sky-200 text-sky-800'
                        }`}
                        title={`${primaryTrip?.title} (Day ${tripsOnDay[0].dayIndex})`}
                      >
                        <span className="shrink-0">
                          {isStart ? '🚀' : isEnd ? '🏁' : '📍'}
                        </span>
                        <span className="truncate">
                          {isStart ? `Depart ${primaryTrip?.destination.split(',')[0]}` : `Day ${tripsOnDay[0].dayIndex}: ${primaryTrip?.destination.split(',')[0]}`}
                        </span>
                      </div>
                    </div>
                  ) : hasTask ? (
                    <div
                      className={`text-[9px] px-1 py-0.5 rounded-md truncate font-semibold ${
                        isDarkMode ? 'bg-slate-800/80 text-amber-300' : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      📋 {tasksOnDay.length} task{tasksOnDay.length > 1 ? 's' : ''}
                    </div>
                  ) : (
                    <div className="h-4" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Color Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Confirmed Trip</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Planning / Curated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-cyan-400" />
                <span>Flight Departure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Pre-Trip Task Due</span>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-slate-400">
              Showing {monthNames[month]} {year}
            </span>
          </div>
        </div>

        {/* Right Area: Selected Day Inspector & Quick Tasks (5 Cols on xl) */}
        <div
          id="calendar-day-inspector-card"
          className={`xl:col-span-5 rounded-2xl p-4 sm:p-5 border flex flex-col justify-between space-y-4 ${
            isDarkMode
              ? 'bg-slate-800/60 border-slate-700/80 shadow-[0_0_25px_rgba(0,0,0,0.4)]'
              : 'bg-slate-50/80 border-slate-200 shadow-xs'
          }`}
        >
          <div className="space-y-4">
            {/* Selected Date Title Banner */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-500 dark:text-sky-400">
                  Daily Inspector & Agenda
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>
                    {daysOfWeek[selectedDate.getDay()]}, {monthNames[selectedDate.getMonth()]}{' '}
                    {selectedDate.getDate()}, {selectedDate.getFullYear()}
                  </span>
                  {isToday(selectedDate) && (
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded-full shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                      TODAY
                    </span>
                  )}
                </h4>
              </div>

              {/* Quick Add Task Button */}
              <button
                type="button"
                onClick={() => setShowAddQuickTask((prev) => !prev)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  showAddQuickTask
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : isDarkMode
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30 shadow-[0_0_12px_rgba(14,165,233,0.25)]'
                    : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                }`}
                title="Add Task for this day"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>

            {/* Quick Add Task Input Form */}
            {showAddQuickTask && (
              <form
                onSubmit={handleAddQuickTask}
                className={`p-3 rounded-xl border space-y-2.5 animate-fadeIn ${
                  isDarkMode ? 'bg-slate-900/90 border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.2)]' : 'bg-white border-sky-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <ListTodo className="w-3.5 h-3.5" />
                    <span>New Task for {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddQuickTask(false)}
                    className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Check exchange rate, pack power bank..."
                    className={`flex-1 px-3 py-1.5 text-xs rounded-lg border outline-hidden transition-colors ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-sky-400'
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-sky-500'
                    }`}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!newTaskTitle.trim()}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      isDarkMode
                        ? 'bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-50 shadow-[0_0_10px_rgba(14,165,233,0.4)]'
                        : 'bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50'
                    }`}
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* Active Trips Details */}
            {selectedDayTrips.length > 0 ? (
              <div className="space-y-3">
                {selectedDayTrips.map(({ trip, dayIndex, dayItinerary }) => (
                  <div
                    key={trip.id}
                    className={`rounded-xl p-3.5 border transition-all ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-700/80 hover:border-sky-500/40 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={trip.image}
                          alt={trip.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                trip.status === 'Confirmed'
                                  ? isDarkMode
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-emerald-100 text-emerald-800'
                                  : isDarkMode
                                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              Day {dayIndex} of {trip.days}
                            </span>
                            <span className="text-xs font-bold text-slate-400">{trip.destination}</span>
                          </div>
                          <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                            {trip.title}
                          </h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {dayItinerary ? dayItinerary.subtitle : `${trip.tripType}`}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTrip(trip);
                          setActivePage('Itineraries');
                        }}
                        className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isDarkMode
                            ? 'bg-slate-800 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-slate-700'
                            : 'bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600'
                        }`}
                        title="Open Full Itinerary"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Day Activities if available */}
                    {dayItinerary?.activities && dayItinerary.activities.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          Scheduled Day Activities ({dayItinerary.activities.length})
                        </span>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                          {dayItinerary.activities.map((act) => (
                            <div
                              key={act.id}
                              className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                                isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-500 dark:text-sky-400 shrink-0">
                                  {act.time}
                                </span>
                                <span className="font-semibold truncate text-slate-800 dark:text-slate-200">
                                  {act.title}
                                </span>
                              </div>
                              <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-2">
                                ${act.cost}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`p-4 rounded-xl border text-center space-y-2 ${
                  isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200/60'
                }`}
              >
                <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <Compass className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                  No Trips Active on this Date
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Ready to go somewhere? Generate an AI itinerary or schedule tasks for this day.
                </p>
                <button
                  type="button"
                  onClick={() => setActivePage('AI Trip Planner')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30'
                      : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan Trip with AI</span>
                </button>
              </div>
            )}

            {/* Flight / Hotel Bookings on this Day */}
            {selectedDayBookings.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Flights & Accommodations ({selectedDayBookings.length})</span>
                </span>
                <div className="space-y-1.5">
                  {selectedDayBookings.map((b) => (
                    <div
                      key={b.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        isDarkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            b.type === 'flight'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-indigo-500/20 text-indigo-400'
                          }`}
                        >
                          {b.type === 'flight' ? <Plane className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{b.title}</p>
                          <p className="text-[10px] text-slate-400">{b.provider} • Code: {b.bookingCode}</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-900 dark:text-slate-100">${b.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pre-Trip Checklist Tasks Due on this Day */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <ListTodo className="w-3.5 h-3.5 text-amber-400" />
                  <span>Associated Pre-Trip Tasks ({selectedDayTasks.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActivePage('Pre-Trip Checklist')}
                  className="text-[11px] font-bold text-sky-500 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  View Checklist
                </button>
              </div>

              {selectedDayTasks.length > 0 ? (
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                  {selectedDayTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleChecklistItem(task.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                        task.completed
                          ? isDarkMode
                            ? 'bg-slate-900/30 border-slate-800 opacity-60'
                            : 'bg-slate-100 border-slate-200 opacity-60'
                          : isDarkMode
                          ? 'bg-slate-900/80 border-slate-700/80 hover:border-amber-500/40'
                          : 'bg-white border-slate-200 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 hover:text-amber-500 shrink-0" />
                        )}
                        <span
                          className={`truncate font-medium ${
                            task.completed ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                          task.priority === 'high'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-1">
                  No specific tasks due for this day. Click "+ Add Task" to set a reminder.
                </p>
              )}
            </div>
          </div>

          {/* Quick Footer Action */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400">
              {trips.length} active scheduled trips
            </span>
            <button
              type="button"
              onClick={() => setActivePage('Trips')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <span>Manage All Trips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
