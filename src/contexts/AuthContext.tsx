import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { isAdminUserId } from '@/config/admin';
import { ensureProfile } from "@/lib/ensureProfile";
import { isProfileComplete } from '@/lib/profileValidation';

// Logging hygiene
const DEV = import.meta.env.DEV;
const log = (...args: any[]) => DEV && console.log(...args);
const warn = (...args: any[]) => DEV && console.warn(...args);

interface Profile {
  user_id: string;
  email_initial: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  nama_lengkap?: string | null;
  email?: string | null;
  no_wa?: string | null;
  kota?: string | null;
  tpc_wallet_address?: string | null;
  sponsor_code?: string | null;
  referred_by?: string | null;
  is_active?: boolean | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  sessionInitialized: boolean;
  isAdmin: boolean;
  profileComplete: boolean;
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
  const profileComplete = isProfileComplete(profile);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id,email_initial,display_name,avatar_url,created_at,last_sign_in_at,nama_lengkap,email,no_wa,kota,tpc_wallet_address,sponsor_code,referred_by,is_active')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    if (!data || 'error' in data) {
      return null;
    }
    
    // Update email if missing in profile but exists in auth
    const profile = data as Profile;
    if (profile.email === null && user?.email) {
      await supabase
        .from('profiles')
        .update({ email_current: user.email })
        .eq('user_id', userId);
      profile.email = user.email;
    }
    
    return profile;
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

      // ✅ HANYA init saat user SIGNED_IN (login sukses)
      // ❌ JANGAN init saat INITIAL_SESSION atau TOKEN_REFRESHED
      const shouldInit = event === 'SIGNED_IN' || profileInitForUserRef.current !== uid;

      // Skip event seperti TOKEN_REFRESHED yang sering banget
      if (!shouldInit) {
        // tidak init ulang, tapi UI harus jalan
        return;
      }

      // ✅ cegah init paralel / berulang
      if (profileInitInFlightRef.current) return;
      if (profileInitForUserRef.current === uid && event === 'SIGNED_IN') {
        return;
      }

      profileInitInFlightRef.current = true;

      try {
        // ✅ HANYA panggil ensureProfile saat user SIGNED_IN
        if (event === 'SIGNED_IN') {
          await ensureProfile(uid);
        }

        let userProfile = await fetchProfile(uid);

        if (!userProfile && currentSession.user.email) {
          // ✅ Bootstrap tanpa invoice dependency
          userProfile = await createProfile(currentSession.user, null);
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
          log('[AUTH] Auth state changed:', event, session ? 'session exists' : 'no session');
          
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
    log('[AUTH] Getting initial session...');
    supabase.auth.getSession()
      .then(({ data: { session: initialSession } }) => {
        log('[AUTH] Initial session received:', initialSession ? 'exists' : 'null');
        if (!initialSession) {
          log('[AUTH] No initial session, setting isLoading to false');
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
        warn('[AUTH] SAFETY TIMEOUT - forcing loading to false');
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
        profileComplete,
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
