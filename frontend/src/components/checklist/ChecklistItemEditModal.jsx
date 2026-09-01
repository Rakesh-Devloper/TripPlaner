import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, Tag, AlertCircle, Plus, Edit2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const CATEGORIES = [
  'Documents & ID',
  'Clothing & Apparel',
  'Electronics & Gadgets',
  'Toiletries & Care',
  'Health & Medication',
  'Pre-Trip Tasks',
  'Home & Pets',
  'Accessories & Gear',
];

export const ChecklistItemEditModal = ({
  isOpen,
  onClose,
  itemToEdit,
  defaultTripId,
}) => {
  const { addChecklistItem, updateChecklistItem, trips, activeTrip } = useApp();

  const [tripId, setTripId] = useState(defaultTripId || activeTrip.id);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Clothing & Apparel');
  const [type, setType] = useState('packing');
  const [priority, setPriority] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setTripId(itemToEdit.tripId);
      setTitle(itemToEdit.title);
      setCategory(itemToEdit.category);
      setType(itemToEdit.type);
      setPriority(itemToEdit.priority);
      setQuantity(itemToEdit.quantity || 1);
      setDueDate(itemToEdit.dueDate || '');
      setNotes(itemToEdit.notes || '');
    } else {
      setTripId(defaultTripId || activeTrip.id);
      setTitle('');
      setCategory('Clothing & Apparel');
      setType('packing');
      setPriority('medium');
      setQuantity(1);
      setDueDate('');
      setNotes('');
    }
  }, [itemToEdit, defaultTripId, activeTrip.id, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (itemToEdit) {
      updateChecklistItem(itemToEdit.id, {
        tripId,
        title: title.trim(),
        category,
        type,
        priority,
        quantity: type === 'packing' ? quantity : undefined,
        dueDate: dueDate.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      addChecklistItem({
        tripId,
        title: title.trim(),
        category,
        type,
        completed: false,
        priority,
        quantity: type === 'packing' ? quantity : undefined,
        dueDate: dueDate.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <div
      id="checklist-item-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="checklist-item-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-thin"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              {itemToEdit ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {itemToEdit ? 'Edit Checklist Item' : 'Add New Item / Task'}
              </h2>
              <p className="text-xs text-slate-500">
                {itemToEdit ? 'Update details, quantity, or due reminders' : 'Create a packing item or pre-travel task'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Target Trip Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Assigned Trip
            </label>
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.destination})
                </option>
              ))}
            </select>
          </div>

          {/* Item Type Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Item Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setType('packing');
                  if (category === 'Pre-Trip Tasks' || category === 'Home & Pets') {
                    setCategory('Clothing & Apparel');
                  }
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  type === 'packing'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎒 Luggage Packing Item
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('task');
                  setCategory('Pre-Trip Tasks');
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  type === 'task'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⏰ Pre-Trip Task / Reminder
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={type === 'packing' ? 'e.g. Universal Plug Adapter, Sunscreen SPF 50' : 'e.g. Check passport validity, Notify bank'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all"
              >
                <option value="high">🔴 High Priority (Crucial)</option>
                <option value="medium">🟡 Medium Priority (Recommended)</option>
                <option value="low">⚪ Low Priority (Optional)</option>
              </select>
            </div>
          </div>

          {/* Quantity & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {type === 'packing' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-center px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Due Reminder
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 days before, May 22"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Deadline / Notes
              </label>
              <input
                type="text"
                placeholder={type === 'packing' ? 'e.g. Carry-on bag only' : 'e.g. Online portal QR code'}
                value={dueDate && type === 'packing' ? dueDate : ''}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Additional Notes or Links
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Must carry original physical copy, check airline 100ml liquid limits"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:opacity-95 shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              {itemToEdit ? 'Save Changes' : 'Add to Checklist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
