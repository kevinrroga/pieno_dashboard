'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  crashed: boolean;
  error: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { crashed: false, error: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { crashed: true, error: error.message };
  }

  render() {
    if (this.state.crashed) {
      return (
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-8 text-center space-y-3">
          <p className="text-base font-semibold text-red-700 dark:text-red-400">
            Something went wrong loading the schedule.
          </p>
          <p className="text-sm text-red-500 dark:text-red-500">
            Try refreshing the page. If the problem persists, contact support.
          </p>
          <button
            onClick={() => this.setState({ crashed: false, error: '' })}
            className="text-sm px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            Try again
          </button>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-red-400 dark:text-red-600 font-mono mt-2">
              {this.state.error}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
