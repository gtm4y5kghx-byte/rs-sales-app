import { useState, useEffect } from 'react';
import { getCachedAsset } from '@/services/cache';

interface ImageViewerProps {
	url: string;
	alt: string;
}

const ImageViewer = ({ url, alt }: ImageViewerProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [src, setSrc] = useState<string | null>(null);

	useEffect(() => {
		let blobUrl: string | null = null;
		let cancelled = false;

		const resolveSource = async () => {
			const blob = await getCachedAsset(url);
			if (cancelled) return;

			if (blob) {
				blobUrl = URL.createObjectURL(blob);
				setSrc(blobUrl);
			} else {
				setSrc(url);
			}
		};

		resolveSource();

		return () => {
			cancelled = true;
			if (blobUrl) URL.revokeObjectURL(blobUrl);
		};
	}, [url]);

	const handleLoad = () => {
		setIsLoading(false);
		setError(null);
	};

	const handleError = () => {
		setIsLoading(false);
		setError('Failed to load image');
	};

	if (error) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-destructive">{error}</p>
			</div>
		);
	}

	return (
		<div className="flex h-full items-center justify-center overflow-auto">
			{(isLoading || !src) && (
				<p className="absolute text-muted-foreground">Loading image...</p>
			)}
			{src && (
				<img
					src={src}
					alt={alt}
					onLoad={handleLoad}
					onError={handleError}
					className="max-h-full max-w-full object-contain touch-pinch-zoom"
					style={{ opacity: isLoading ? 0 : 1 }}
				/>
			)}
		</div>
	);
};

export default ImageViewer;
