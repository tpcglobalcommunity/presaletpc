import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      console.error('Login error:', error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Sign In</h1>
        <p className="text-gray-400">
          Access your TPC Global member dashboard
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <span className="text-xs text-gray-300">Secure login</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <span className="text-xs text-gray-300">Google authentication</span>
        </div>
      </div>

      {/* Login Form */}
      <div className="space-y-4">
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all"
        >
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
          <span className="text-lg font-semibold text-white">Sign in with Google</span>
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            By signing in, you agree to our{' '}
            <a href="/en/terms" className="text-yellow-400 hover:text-yellow-300">
              Terms & Conditions
            </a>
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Member Benefits</h2>
        
        <div className="space-y-3">
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-2">📊 Track Your Investments</h3>
            <p className="text-sm text-gray-400">
              Monitor your TPC tokens and transaction history
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-2">🎓 Access Premium Content</h3>
            <p className="text-sm text-gray-400">
              Unlock advanced courses and learning materials
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-2">👥 Join Community</h3>
            <p className="text-sm text-gray-400">
              Connect with other members and experts
            </p>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
        <h3 className="font-semibold text-blue-400 mb-2">Need Help?</h3>
        <p className="text-sm text-gray-300">
          If you're having trouble signing in, please contact our support team at{' '}
          <span className="text-yellow-400">support@tpcglobal.io</span>
        </p>
      </div>
    </div>
  );
}
