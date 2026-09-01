import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BackButton = ({
  className = '',
  fallbackPage = 'Dashboard',
  label = 'Back',
  variant = 'default',
  onClick = undefined,
}) => {
  const { goBack, canGoBack, setActivePage, activePage } = useApp();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (canGoBack) {
      goBack();
    } else {
      setActivePage(fallbackPage);
    }
  };

  if (activePage === 'Dashboard' && !canGoBack && !onClick) {
    return null;
  }

  let variantStyle = 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 shadow-xs';
  if (variant === 'subtle') {
    variantStyle = 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-transparent';
  } else if (variant === 'pill') {
    variantStyle = 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200/60 shadow-xs';
  } else if (variant === 'white') {
    variantStyle = 'bg-white/90 hover:bg-white text-slate-800 border-white/80 shadow-sm backdrop-blur-md';
  }

  return (
    <button
      type="button"
      id="app-back-button"
      onClick={handleClick}
      aria-label={`Go back from ${activePage}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 hover:-translate-x-0.5 cursor-pointer group shrink-0 select-none ${variantStyle} ${className}`}
    >
      <ArrowLeft className="w-3.5 h-3.5 text-current transition-transform duration-200 group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </button>
  );
};
