import React from 'react';

interface AppErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export default class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="text-center p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Terjadi Kesalahan</h1>
            <p className="text-slate-400 mb-6">Silakan refresh halaman.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded"
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
