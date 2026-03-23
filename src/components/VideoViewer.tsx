import { useState, useEffect } from 'react';
import { getCachedAsset } from '@/services/cache';

interface VideoViewerProps {
	url: string;
	title: string;
}

const VideoViewer = ({ url, title }: VideoViewerProps) => {
	const [videoSrc, setVideoSrc] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let blobUrl: string | null = null;

		const loadVideo = async () => {
			console.log(`[video] loading: ${url}`);

			// Try cache first (bypasses service worker — required for iOS Safari)
			const cached = await getCachedAsset(url);
			if (cached) {
				console.log(`[video] found in cache: type=${cached.type} size=${cached.size}`);
				blobUrl = URL.createObjectURL(cached);
				setVideoSrc(blobUrl);
				return;
			}

			console.log(`[video] not in cache, using direct URL`);
			setVideoSrc(url);
		};

		loadVideo();

		return () => {
			if (blobUrl) {
				URL.revokeObjectURL(blobUrl);
			}
		};
	}, [url]);

	const handleLoadedData = () => {
		console.log(`[video] loaded successfully: ${url}`);
		setIsLoading(false);
		setError(null);
	};

	const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
		const videoEl = e.currentTarget;
		const mediaError = videoEl.error;
		console.error(`[video] error loading: ${url}`, {
			code: mediaError?.code,
			message: mediaError?.message,
			networkState: videoEl.networkState,
			readyState: videoEl.readyState,
		});
		setIsLoading(false);
		setError(
			`Failed to load video (code: ${mediaError?.code}, ${mediaError?.message || 'unknown'})`,
		);
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
				{videoSrc && (
					<video
						src={videoSrc}
						title={title}
						controls
						onLoadedData={handleLoadedData}
						onError={handleError}
						className="h-full w-full"
						style={{ opacity: isLoading ? 0 : 1 }}
					/>
				)}
			</div>
		</div>
	);
};

export default VideoViewer;
