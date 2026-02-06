import { useNavigate, useLocation } from 'react-router-dom';

interface PublicLangSwitchProps {
  currentLang: 'id' | 'en';
}

export default function PublicLangSwitch({ currentLang }: PublicLangSwitchProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show switch on member/admin routes
  if (location.pathname.includes('/member') || location.pathname.includes('/admin')) {
    return null;
  }

  const handleSwitch = (lang: 'id' | 'en') => {
    // Preserve current path if possible
    const currentPath = location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(en|id)/, '');
    const newPath = `/${lang}${pathWithoutLang}`;
    navigate(newPath, { replace: true });
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 bg-background/80 backdrop-blur-sm rounded-lg border border-border p-1">
      <button
        onClick={() => handleSwitch('id')}
        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
          currentLang === 'id'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        ID
      </button>
      <button
        onClick={() => handleSwitch('en')}
        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
          currentLang === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        EN
      </button>
    </div>
  );
}
