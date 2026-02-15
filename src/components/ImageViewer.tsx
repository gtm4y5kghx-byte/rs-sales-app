import { useState, useEffect } from 'react';
import { getCachedAsset } from '@/services/cache';

interface ImageViewerProps {
	url: string;
	alt: string;
}

const ImageViewer = ({ url, alt }: ImageViewerProps) => {
	const [src, setSrc] = useState<string | null>(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		let blobUrl: string | null = null;

		getCachedAsset(url).then((blob) => {
			if (blob) {
				blobUrl = URL.createObjectURL(blob);
				setSrc(blobUrl);
			} else {
				setError(true);
			}
		});

		return () => {
			if (blobUrl) URL.revokeObjectURL(blobUrl);
		};
	}, [url]);

	if (error) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-destructive">Failed to load image</p>
			</div>
		);
	}

	if (!src) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Loading image...</p>
			</div>
		);
	}

	return (
		<div className="flex h-full items-center justify-center overflow-auto">
			<img
				src={src}
				alt={alt}
				className="max-h-full max-w-full object-contain touch-pinch-zoom"
			/>
		</div>
	);
};

export default ImageViewer;
