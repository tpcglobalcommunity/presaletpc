import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageLoader from '@/components/PageLoader';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/id/login');
          return;
        }

        if (data.session) {
          // Refresh profile data
          await refreshProfile();
          // Redirect to dashboard
          navigate('/id/dashboard');
        } else {
          // No session, redirect to login
          navigate('/id/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/id/login');
      }
    };

    handleAuthCallback();
  }, [navigate, refreshProfile]);

  return <PageLoader />;
};

export default AuthCallbackPage;
