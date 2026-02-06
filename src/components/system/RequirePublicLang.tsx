import { Navigate, useParams, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function RequirePublicLang() {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();

  // Only allow "id" or "en"
  if (lang !== 'id' && lang !== 'en') {
    // Replace invalid lang with "id" and preserve the rest of the path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      pathSegments[0] = 'id'; // Replace first segment (invalid lang) with "id"
    }
    const newPath = '/' + pathSegments.join('/');
    return <Navigate to={newPath} replace />;
  }

  return <Outlet />;
}
