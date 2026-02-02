import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { isAdminUserId } from '@/config/admin';
import { getAuthCallbackUrl } from '@/lib/auth-urls';

interface Profile {
  id: string;
  user_id: string;
  email_initial: string;
  email_current: string;
  member_code: string;
  referred_by: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = isAdminUserId(user?.id);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile | null;
  };

  const createProfile = async (user: User, referredBy?: string | null) => {
    // Generate member code
    const { data: memberCode } = await supabase.rpc('generate_member_code');
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        email_initial: user.email!,
        email_current: user.email!,
        member_code: memberCode || `M-${Date.now().toString(36).toUpperCase()}`,
        referred_by: referredBy,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }
    return data as Profile;
  };

  const linkInvoicesToUser = async (userId: string, email: string) => {
    // Find invoices by email and link them to user
    const { error } = await supabase
      .from('invoices')
      .update({ user_id: userId })
      .eq('email', email)
      .is('user_id', null);

    if (error) {
      console.error('Error linking invoices:', error);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    const newProfile = await fetchProfile(user.id);
    setProfile(newProfile);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Defer profile operations to avoid blocking
          setTimeout(async () => {
            let userProfile = await fetchProfile(currentSession.user.id);
            
            if (!userProfile && currentSession.user.email) {
              // Get referral from first invoice if exists
              const { data: firstInvoice } = await supabase
                .from('invoices')
                .select('referral_code')
                .eq('email', currentSession.user.email)
                .order('created_at', { ascending: true })
                .limit(1)
                .maybeSingle();

              userProfile = await createProfile(
                currentSession.user,
                firstInvoice?.referral_code
              );
            }

            // Link invoices to user
            if (currentSession.user.email) {
              await linkInvoicesToUser(currentSession.user.id, currentSession.user.email);
            }

            setProfile(userProfile);
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!initialSession) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAuthCallbackUrl('id'),
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isAdmin,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
