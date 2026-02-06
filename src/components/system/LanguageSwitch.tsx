import { useNavigate, useLocation } from 'react-router-dom';
import { usePublicPath } from '@/lib/publicPath';
import { useEffect, useState } from 'react';

type LanguageSwitchProps = {
  className?: string;
  showLabel?: boolean;
};

type Lang = 'en' | 'id';

/**
 * Public Language Switch - Premium UX for language switching
 * 
 * - Visible ONLY on public pages
 * - Preserves current page when switching
 * - Uses canonical path building
 * - No hardcoded language prefixes
 */
export default function LanguageSwitch({ className, showLabel = true }: LanguageSwitchProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang: currentLang } = usePublicPath();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Extract raw path from current location
  const getRawPath = (pathname: string): string => {
    // Remove language prefix to get raw path
    const rawPath = pathname.replace(/^\/(en|id)(?=\/|$)/, '');
    return rawPath === '' ? '/' : rawPath;
  };

  const rawPath = getRawPath(location.pathname);

  const handleLanguageSwitch = (newLang: Lang) => {
    if (newLang === currentLang) return;

    // Build canonical path for new language
    const newPath = `/${newLang}${rawPath}`;
    
    // Navigate with replace to preserve history
    navigate(newPath, { replace: true });
  };

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-2 rounded-full border transition-all
      ${currentLang === 'en' 
        ? 'border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' 
        : 'border-[#F0B90B]/20 bg-[#F0B90B]/10 text-[#F0B90B] hover:bg-[#F0B90B]/20'
      } ${className || ''}`}>
      
      {showLabel && (
        <span className="text-xs font-medium">
          {currentLang === 'en' ? 'EN' : 'ID'}
        </span>
      )}
      
      <button
        onClick={() => handleLanguageSwitch(currentLang === 'en' ? 'id' : 'en')}
        className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        {currentLang === 'en' ? 'ID' : 'EN'}
      </button>
    </div>
  );
}
