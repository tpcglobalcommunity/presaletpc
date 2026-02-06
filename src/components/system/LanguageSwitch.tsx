import React from 'react';
import { useParams } from 'react-router-dom';

type LanguageSwitchProps = {
  className?: string;
  showLabel?: boolean;
};

export default function LanguageSwitch({ className, showLabel = true }: LanguageSwitchProps) {
  const { lang } = useParams();
  
  // Determine current language from URL
  const currentLang = lang === 'en' ? 'en' : 'id';
  
  const handleSwitch = (targetLang: 'en' | 'id') => {
    // Get current pathname without language prefix
    const pathname = window.location.pathname;
    const withoutLangPrefix = pathname.replace(/^\/(en|id)\//, '');
    
    // Navigate to same path with new language
    const newPath = `/${targetLang}${withoutLangPrefix}`;
    
    // Use navigate with replace to avoid history stacking
    window.location.href = newPath;
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
      currentLang === 'en' 
        ? 'border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' 
        : 'border-[#F0B90B]/20 bg-[#F0B90B]/10 text-[#F0B90B] hover:bg-[#F0B90B]/20'
    } ${className || ''}`}>
      
      {showLabel && (
        <span className="text-xs font-medium">
          {currentLang === 'en' ? 'EN' : 'ID'}
        </span>
      )}
      
      <button
        onClick={() => handleSwitch(currentLang === 'en' ? 'id' : 'en')}
        className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        {currentLang === 'en' ? 'ID' : 'EN'}
      </button>
    </div>
  );
}
