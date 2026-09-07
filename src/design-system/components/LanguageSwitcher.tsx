import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 ${className}`}>
      <div className="flex items-center gap-1.5 px-2 text-slate-500">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          language === 'en'
            ? 'bg-[#1258D4] text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          language === 'hi'
            ? 'bg-[#1258D4] text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
};
