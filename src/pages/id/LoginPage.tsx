import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function sanitizeReturnTo(raw: string | null) {
  if (!raw) return null;

  // 1) pastikan string
  let path = String(raw).trim();

  // 2) kalau full URL, ambil pathname+search+hash saja
  try {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      const u = new URL(path);
      path = `${u.pathname}${u.search}${u.hash}`;
    }
  } catch {
    // ignore
  }

  // 3) normalisasi leading slash: "///id/..." -> "/id/..."
  path = `/${path.replace(/^\/+/, '')}`;

  // 4) whitelist route yang boleh (anti open-redirect & anti route aneh)
  if (path.startsWith('/id/') || path === '/id') return path;
  if (path.startsWith('/en/') || path === '/en') return path;

  return null;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { signInWithGoogle, isLoading, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      const returnToRaw = sessionStorage.getItem('returnTo');
      const returnTo = sanitizeReturnTo(returnToRaw);

      // kita hapus supaya tidak nyangkut/loop
      sessionStorage.removeItem('returnTo');

      if (returnTo) {
        navigate(returnTo, { replace: true });
      } else {
        // ✅ FINAL member landing
        navigate('/id/member/dashboard', { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogin = async () => {
    try {
      // OPTIONAL: kalau kita mau pastikan returnTo selalu benar sebelum login
      // contoh: kalau user datang dari buytpc, set returnTo dulu
      // sessionStorage.setItem('returnTo', '/id/member/dashboard');

      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <img
              src="/tpc-logo.png"
              alt="TPC Logo"
              className="h-20 w-20 rounded-2xl object-contain drop-shadow-lg"
            />
          </div>
          <h1 className="text-title mb-2">Masuk ke Akun</h1>
          <p className="text-muted-foreground text-sm">
            Login untuk melihat dan mengelola invoice kita
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="btn-gold w-full text-lg py-5 mb-4"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Masuk dengan Google
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Dengan masuk, kita menyetujui{' '}
          <span className="text-primary">Syarat & Ketentuan</span> kami
        </p>
      </div>
    </div>
  );
}
