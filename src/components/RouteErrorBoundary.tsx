import React from 'react';

interface RouteErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

export default class RouteErrorBoundary extends React.Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Route Error Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0F141A] to-[#11161C] flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Terjadi Gangguan</h1>
              <p className="text-[#848E9C] mb-6">
                Terjadi kesalahan saat memuat halaman. Silakan coba lagi atau kembali ke beranda.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-xs text-red-400 cursor-pointer mb-2">Debug Info</summary>
                  <pre className="text-xs text-red-300 bg-red-500/10 p-2 rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReload}
                  className="px-6 py-2 bg-[#F0B90B] hover:bg-[#F8D56B] text-white font-semibold rounded-lg transition-colors"
                >
                  Muat Ulang
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="px-6 py-2 bg-[#2B3139] hover:bg-[#374151] text-white font-semibold rounded-lg transition-colors"
                >
                  Kembali ke Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
