import React, { useState } from 'react';
import { X, Sparkles, Check, Palmtree, Mountain, Building2, Laptop, Users, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChecklistTemplateModal = ({
  isOpen,
  onClose,
  selectedTripId,
}) => {
  const { checklistTemplates, applyChecklistTemplate, trips, activeTrip } = useApp();
  const [selectedTemplateId, setSelectedTemplateId] = useState(checklistTemplates[0]?.id || '');
  const [isApplying, setIsApplying] = useState(false);

  if (!isOpen) return null;

  const currentTemplate = checklistTemplates.find((t) => t.id === selectedTemplateId) || checklistTemplates[0];
  const targetTrip = trips.find((t) => t.id === selectedTripId) || activeTrip;

  const getTemplateIcon = (iconName) => {
    switch (iconName) {
      case 'Palmtree':
        return <Palmtree className="w-6 h-6 text-emerald-600" />;
      case 'Mountain':
        return <Mountain className="w-6 h-6 text-amber-600" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-indigo-600" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-cyan-600" />;
      case 'Users':
      default:
        return <Users className="w-6 h-6 text-purple-600" />;
    }
  };

  const handleApply = () => {
    if (!currentTemplate) return;
    setIsApplying(true);
    applyChecklistTemplate(currentTemplate.id, targetTrip.id);
    setTimeout(() => {
      setIsApplying(false);
      onClose();
    }, 400);
  };

  return (
    <div
      id="checklist-template-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="checklist-template-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pre-Trip Checklist Templates</h2>
              <p className="text-xs text-slate-500">
                Choose a curated travel pack to load into <span className="font-semibold text-indigo-600">{targetTrip.title}</span>
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

        {/* Template Selector Grid */}
        <div className="py-4 overflow-y-auto space-y-4 flex-1 pr-1 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklistTemplates.map((tpl) => {
              const isSelected = selectedTemplateId === tpl.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-xs">
                      {getTemplateIcon(tpl.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">{tpl.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{tpl.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100/80 text-[11px] text-slate-500 font-medium">
                    <span>{tpl.items.length} items</span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                      {tpl.recommendedDuration}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Template Items Preview */}
          {currentTemplate && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Included Items in {currentTemplate.name} ({currentTemplate.items.length})
                </h4>
                <span className="text-[11px] text-indigo-600 font-semibold">{currentTemplate.tripType}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {currentTemplate.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100 text-xs text-slate-700"
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        item.type === 'task' ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                    />
                    <span className="truncate flex-1 font-medium">{item.title}</span>
                    {item.quantity && item.quantity > 1 && (
                      <span className="text-[10px] text-slate-400 font-semibold px-1.5 py-0.5 bg-slate-50 rounded">
                        x{item.quantity}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isApplying || !currentTemplate}
            onClick={handleApply}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:opacity-95 shadow-md shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            {isApplying ? 'Applying Template...' : `Import ${currentTemplate?.items.length || 0} Items to Trip`}
          </button>
        </div>
      </div>
    </div>
  );
};
