import { useParams } from 'react-router-dom';
import HomePage from '@/pages/public/en/HomePage';
import LoginPage from '@/pages/public/en/LoginPage';
import AntiScamPage from '@/pages/public/en/AntiScamPage';
import MarketPage from '@/pages/public/en/MarketPage';
import PresalePage from '@/pages/public/en/PresalePage';
import AcademyPage from '@/pages/public/en/AcademyPage';
import TermsPage from '@/pages/public/en/TermsPage';
import PrivacyPage from '@/pages/public/en/PrivacyPage';
import RiskDisclosurePage from '@/pages/public/en/RiskDisclosurePage';

interface PublicRouteProps {
  page: 'home' | 'login' | 'anti-scam' | 'market' | 'presale' | 'academy' | 'terms' | 'privacy' | 'risk';
}

export default function PublicRoute({ page }: PublicRouteProps) {
  const { lang = 'en' } = useParams<{ lang: string }>();

  // Map page prop to component
  const pageComponents = {
    home: HomePage,
    login: LoginPage,
    'anti-scam': AntiScamPage,
    market: MarketPage,
    presale: PresalePage,
    academy: AcademyPage,
    terms: TermsPage,
    privacy: PrivacyPage,
    risk: RiskDisclosurePage
  };

  // Get the component for the current page
  const PageComponent = pageComponents[page];

  // For now, use EN pages for both languages until ID pages are created
  return <PageComponent />;
}
