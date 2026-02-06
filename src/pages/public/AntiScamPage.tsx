import { useParams } from 'react-router-dom';
import AntiScamPageShared from './AntiScamPage.shared';

export default function AntiScamPage() {
  const { lang = 'id' } = useParams<{ lang: string }>();
  
  // Strict lang validation: only "en" or "id" allowed
  const validLang = lang === 'en' ? 'en' : 'id';
  
  return <AntiScamPageShared lang={validLang} />;
}
