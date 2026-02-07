import { useNavigate, useParams } from 'react-router-dom';
import { publicPath } from '@/lib/publicPath';

interface LanguageSwitchProps {
  currentLang: 'en' | 'id';
}

export default function LanguageSwitch({ currentLang }: LanguageSwitchProps) {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'id' : 'en';
    
    // Get current path without language prefix
    const pathname = window.location.pathname;
    const pathWithoutLang = pathname.replace(/^\/(en|id)/, '') || '/';
    
    // Navigate to same path with new language
    const newPath = publicPath(newLang, pathWithoutLang);
    navigate(newPath, { replace: true });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium"
    >
      <span className={currentLang === 'en' ? 'text-yellow-400' : 'text-gray-400'}>
        EN
      </span>
      <span className="text-gray-500">|</span>
      <span className={currentLang === 'id' ? 'text-yellow-400' : 'text-gray-400'}>
        ID
      </span>
    </button>
  );
}
