import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { isAdminUserId } from '@/config/admin';
import { ensureProfile } from "@/lib/ensureProfile";

interface Profile {
  user_id: string;
  email_initial: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  sessionInitialized: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  safeSignOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  // ✅ guard yang benar - SEMUA ref di top-level
  const authListenerMountedRef = useRef(false);
  const profileInitForUserRef = useRef<string | null>(null);
  const profileInitInFlightRef = useRef(false);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingRef = useRef(true); // ✅ NEW: Ref untuk safety timeout

  // Helper functions untuk konsistensi
  const setLoadingSafe = (value: boolean) => {
    isLoadingRef.current = value;
    setIsLoading(value);
  };

  const markInitialized = () => {
    setLoadingSafe(false);
    setSessionInitialized(true);
  };

  const isAdmin = isAdminUserId(user?.id);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id,email_initial,display_name,avatar_url,created_at,last_sign_in_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    if (!data || 'error' in data) {
      return null;
    }
    
    return data as Profile | null;
  };

  const createProfile = async (user: User, referredBy?: string | null) => {
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
    
    if (!data) {
      return null;
    }
    
    return data as unknown as Profile;
  };

  const linkInvoicesToUser = async (userId: string, email: string) => {
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
    // Prevent multiple listener registrations (React strict mode / hot reload)
    if (authListenerMountedRef.current) return;
    authListenerMountedRef.current = true;

    const initProfileOnce = async (currentSession: Session, event: string) => {
      const uid = currentSession.user.id;

      // ✅ HANYA init pada event penting
      const shouldInit =
        event === 'INITIAL_SESSION' ||
        event === 'SIGNED_IN' ||
        profileInitForUserRef.current !== uid; // user berubah

      // Skip event seperti TOKEN_REFRESHED yang sering banget
      if (!shouldInit) {
        // tidak init ulang, tapi UI harus jalan
        return;
      }

      // ✅ cegah init paralel / berulang
      if (profileInitInFlightRef.current) return;
      if (profileInitForUserRef.current === uid && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN')) {
        return;
      }

      profileInitInFlightRef.current = true;

      try {
        await ensureProfile(uid);

        let userProfile = await fetchProfile(uid);

        if (!userProfile && currentSession.user.email) {
          const { data: firstInvoice } = await supabase
            .from('invoices')
            .select('referral_code')
            .eq('email', currentSession.user.email)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

          userProfile = await createProfile(currentSession.user, firstInvoice?.referral_code);
        }

        if (currentSession.user.email) {
          await linkInvoicesToUser(uid, currentSession.user.email);
        }

        setProfile(userProfile);
        profileInitForUserRef.current = uid; // ✅ tandai sudah init untuk user ini
      } catch (error) {
        console.error("[AUTH] Profile initialization failed:", error);
      } finally {
        profileInitInFlightRef.current = false;
      }
    };

    // 🔒 HARD LOCK — Bungkus seluruh callback dengan try/finally
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log('[AUTH] Auth state changed:', event, session ? 'session exists' : 'no session');
          
          setSession(session);
          setUser(session?.user ?? null);

          if (!session?.user) {
            setProfile(null);
            // ✅ UI READY segera (tidak menunggu profile init)
            markInitialized();
            return;
          }

          // ✅ UI READY segera (tidak menunggu profile init)
          markInitialized();

          // ✅ Background init - fire-and-forget
          initProfileOnce(session, event).catch((e) =>
            console.error("[AUTH] background initProfileOnce failed:", e)
          );
          return;

        } catch (err) {
          console.error('[AUTH] fatal:', err);
          // ✅ Force UI ready pada error
          markInitialized();
        }
      }
    );

    // Initial session - cukup untuk fallback, tidak panggil initProfileOnce manual
    console.log('[AUTH] Getting initial session...');
    supabase.auth.getSession()
      .then(({ data: { session: initialSession } }) => {
        console.log('[AUTH] Initial session received:', initialSession ? 'exists' : 'null');
        if (!initialSession) {
          console.log('[AUTH] No initial session, setting isLoading to false');
          markInitialized();
        }
        // ❌ HAPUS: Tidak panggil initProfileOnce manual
        // Biarkan onAuthStateChange yang handle init dengan non-blocking
      })
      .catch((error) => {
        console.error('[AUTH] getSession failed:', error);
        markInitialized();
      });

    // 🛡️ SAFETY NET - Gunakan ref yang sudah ada
    safetyTimeoutRef.current = setTimeout(() => {
      if (isLoadingRef.current) {
        console.warn('[AUTH] SAFETY TIMEOUT - forcing loading to false');
        markInitialized();
      }
    }, 3000);

    return () => {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
      subscription.unsubscribe();
      // ✅ JANGAN set authListenerMountedRef.current=false (hindari re-register listener)
      profileInitForUserRef.current = null;
      profileInitInFlightRef.current = false;
    };
  }, []);

  const signInWithGoogle = async () => {
    const callbackUrl = `${window.location.origin}/id/auth/callback`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
  };

  const safeSignOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.warn('[AUTH] Safe signOut failed:', error);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        sessionInitialized,
        isAdmin,
        signInWithGoogle,
        signOut,
        safeSignOut,
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
