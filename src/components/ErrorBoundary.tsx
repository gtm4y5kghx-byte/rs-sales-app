import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	handleReset = () => {
		this.setState({ hasError: false });
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex h-screen flex-col items-center justify-center gap-4 p-8 text-center">
					<AlertTriangle className="h-12 w-12 text-destructive" />
					<h1 className="text-xl font-semibold">Something went wrong</h1>
					<p className="text-muted-foreground">
						The app encountered an unexpected error.
					</p>
					<Button onClick={this.handleReset}>Refresh App</Button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
