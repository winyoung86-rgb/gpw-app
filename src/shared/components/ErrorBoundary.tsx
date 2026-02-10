import { Component, type ErrorInfo, type ReactNode } from "react";
import { GlassCard, Button } from "./ui";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleStartOver = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-md mx-auto">
          <GlassCard className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange/20 flex items-center justify-center">
              <span className="text-3xl">😵</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-text-secondary mb-6">
              The app hit an unexpected error. Let's start fresh.
            </p>
            <Button onClick={this.handleStartOver} variant="primary">
              Start Over
            </Button>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
