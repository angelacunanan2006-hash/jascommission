import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI ErrorBoundary caught:', error, info);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-brand-line bg-white p-6 text-center">
          <AlertCircle
            className="mx-auto h-7 w-7 text-brand-red"
            aria-hidden="true"
          />
          <p className="mt-2 font-display text-base font-bold text-brand-ink">
            {this.props.fallbackTitle ?? 'Something went wrong loading this section.'}
          </p>
          <p className="mt-1 text-sm text-brand-muted">
            Please refresh to try again.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-red px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-deep"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Try again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
