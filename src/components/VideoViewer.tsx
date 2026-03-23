import { useState } from 'react';

interface VideoViewerProps {
	url: string;
	title: string;
}

const VideoViewer = ({ url, title }: VideoViewerProps) => {
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

	if (error) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-destructive">{error}</p>
			</div>
		);
	}

	return (
		<div className="py-8">
			<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
				{isLoading && (
					<p className="absolute inset-0 flex items-center justify-center text-white/60">
						Loading video...
					</p>
				)}
				<video
					src={url}
					title={title}
					controls
					onLoadedData={handleLoadedData}
					onError={handleError}
					className="h-full w-full"
					style={{ opacity: isLoading ? 0 : 1 }}
				/>
			</div>
		</div>
	);
};

export default VideoViewer;
