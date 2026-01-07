import { useState } from 'react';

interface ImageViewerProps {
	url: string;
	alt: string;
}

const ImageViewer = ({ url, alt }: ImageViewerProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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
			{isLoading && (
				<p className="absolute text-muted-foreground">Loading image...</p>
			)}
			<img
				src={url}
				alt={alt}
				onLoad={handleLoad}
				onError={handleError}
				className="max-h-full max-w-full object-contain touch-pinch-zoom"
				style={{ opacity: isLoading ? 0 : 1 }}
			/>
		</div>
	);
};

export default ImageViewer;
