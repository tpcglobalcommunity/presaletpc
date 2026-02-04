import React from 'react';

interface AppErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
  errorStack?: string;
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
    return {
      hasError: true,
      errorMessage: error.message,
      errorStack: error.stack
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[APP_ERROR_BOUNDARY] Caught error:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      }
    });
    
    // Save last error to window for debugging
    (window as any).__TPC_LAST_ERROR__ = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    };
  }

  handleReload = () => {
    window.location.reload();
  };

  truncateString(str: string, maxLength: number): string {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Error Title */}
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              Terjadi Kesalahan
            </h1>
            
            {/* Error Message */}
            {this.state.errorMessage && (
              <div className="mb-4">
                <p className="text-slate-300 text-sm mb-2">Error Message:</p>
                <div className="bg-slate-900 rounded p-3 border border-slate-700">
                  <code className="text-red-400 text-xs break-all">
                    {this.truncateString(this.state.errorMessage, 500)}
                  </code>
                </div>
              </div>
            )}
            
            {/* Stack Trace (truncated) */}
            {this.state.errorStack && (
              <div className="mb-6">
                <p className="text-slate-300 text-sm mb-2">Stack Trace:</p>
                <div className="bg-slate-900 rounded p-3 border border-slate-700 max-h-32 overflow-y-auto">
                  <pre className="text-slate-400 text-xs">
                    {this.truncateString(this.state.errorStack, 1000)}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Muat Ulang
              </button>
              
              <p className="text-slate-500 text-xs text-center">
                Jika masih terjadi, hubungi admin.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
