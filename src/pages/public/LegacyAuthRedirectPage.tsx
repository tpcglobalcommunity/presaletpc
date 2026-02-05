import { useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';

/**
 * Legacy auth redirect page
 * Redirects /:lang/auth to /:lang/login to handle old links
 */
export default function LegacyAuthRedirectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  
  useEffect(() => {
    const lang = params.lang === 'en' ? 'en' : 'id';
    const returnTo = searchParams.get('returnTo') || `/${lang}/member/dashboard`;
    
    // Redirect to correct login URL
    const loginUrl = `/${lang}/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`;
    navigate(loginUrl, { replace: true });
  }, [navigate, params.lang, searchParams]);
  
  return (
    <div className="min-h-screen bg-[#0D0F1D] flex items-center justify-center">
      <div className="text-white">Mengarahkan ke halaman login...</div>
    </div>
  );
}
