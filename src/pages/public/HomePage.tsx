import { useParams } from 'react-router-dom';
import HomePageShared from './HomePage.shared';

export default function HomePage() {
  const { lang = 'id' } = useParams<{ lang: string }>();
  
  // Strict lang validation: only "en" or "id" allowed
  const validLang = lang === 'en' ? 'en' : 'id';
  
  return <HomePageShared lang={validLang} />;
}
