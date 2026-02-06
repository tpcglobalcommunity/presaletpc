import { useParams } from 'react-router-dom';
import HomePageShared from './HomePage.shared';

export default function HomePage() {
  const { lang = 'id' } = useParams<{ lang: string }>();
  
  // Validate lang parameter
  const validLang = lang === 'en' || lang === 'id' ? lang : 'id';
  
  return <HomePageShared lang={validLang} />;
}
