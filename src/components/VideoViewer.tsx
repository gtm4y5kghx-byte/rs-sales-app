import { useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

interface VideoViewerProps {
	url: string;
	title: string;
}

const VideoViewer = ({ url, title }: VideoViewerProps) => {
	const isOnline = useOnlineStatus();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handleLoadedData = () => {
		setIsLoading(false);
		setError(null);
	};

	const handleError = () => {
		setIsLoading(false);
		setError('Failed to load video');
	};

	if (!isOnline) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
				<WifiOff className="h-12 w-12" />
				<p>Video requires internet connection</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-destructive">{error}</p>
			</div>
		);
	}

	return (
		<div className="flex h-full items-center justify-center bg-black">
			{isLoading && (
				<p className="absolute text-white/60">Loading video...</p>
			)}
			<video
				src={url}
				title={title}
				controls
				onLoadedData={handleLoadedData}
				onError={handleError}
				className="max-h-full max-w-full"
				style={{ opacity: isLoading ? 0 : 1 }}
			/>
		</div>
	);
};

export default VideoViewer;
