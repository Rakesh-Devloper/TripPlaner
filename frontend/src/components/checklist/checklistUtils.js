import {
  FileText,
  Shirt,
  Smartphone,
  Sparkles,
  HeartPulse,
  CalendarCheck,
  Home,
  Luggage,
} from 'lucide-react';

export const getCategoryIcon = (category) => {
  switch (category) {
    case 'Documents & ID':
      return FileText;
    case 'Clothing & Apparel':
      return Shirt;
    case 'Electronics & Gadgets':
      return Smartphone;
    case 'Toiletries & Care':
      return Sparkles;
    case 'Health & Medication':
      return HeartPulse;
    case 'Pre-Trip Tasks':
      return CalendarCheck;
    case 'Home & Pets':
      return Home;
    case 'Accessories & Gear':
    default:
      return Luggage;
  }
};

export const getCategoryColor = (category) => {
  switch (category) {
    case 'Documents & ID':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-600' };
    case 'Clothing & Apparel':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: 'text-purple-600' };
    case 'Electronics & Gadgets':
      return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', icon: 'text-cyan-600' };
    case 'Toiletries & Care':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: 'text-rose-600' };
    case 'Health & Medication':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'text-emerald-600' };
    case 'Pre-Trip Tasks':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-600' };
    case 'Home & Pets':
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: 'text-indigo-600' };
    case 'Accessories & Gear':
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: 'text-slate-600' };
  }
};
