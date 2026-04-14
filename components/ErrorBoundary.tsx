import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-mono">
          <div className="bg-rose-900/20 border border-rose-500/50 rounded-xl p-6 max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-rose-500 mb-4">SYSTEM FAILURE</h1>
            <p className="text-slate-300 mb-4">An unexpected error occurred in the application.</p>
            <div className="bg-black/50 p-4 rounded text-sm text-rose-300 overflow-auto max-h-64 mb-4">
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
            <button
              className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              FACTORY RESET & RELOAD
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
