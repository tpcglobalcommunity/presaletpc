import { useParams } from 'react-router-dom';
import { getPublicCopySafe, validatePublicCopyShape } from './getPublicCopySafe';

type Lang = 'en' | 'id';

/**
 * Hook for public pages to get safe copy
 * - Always returns complete copy object
 * - Falls back to EN for missing ID keys
 * - Never crashes due to undefined keys
 */
export function usePublicCopy() {
  const params = useParams();
  const lang = ((params.lang as Lang) || 'en') as Lang;
  
  const copy = getPublicCopySafe(lang);
  
  // Development-only validation
  if (process.env.NODE_ENV === 'development') {
    validatePublicCopyShape(copy);
  }
  
  return {
    lang,
    copy
  };
}
