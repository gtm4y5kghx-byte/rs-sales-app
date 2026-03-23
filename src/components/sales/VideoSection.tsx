import { useState, useEffect } from 'react';
import type { VideoContent } from '@/types';
import { getCachedAsset } from '@/services/cache';

interface VideoSectionProps {
	video: VideoContent;
}

const VideoSection = ({ video }: VideoSectionProps) => {
	const [videoSrc, setVideoSrc] = useState<string | null>(null);

	useEffect(() => {
		if (!video.url) return;

		let blobUrl: string | null = null;

		const loadVideo = async () => {
			const cached = await getCachedAsset(video.url);
			if (cached) {
				blobUrl = URL.createObjectURL(cached);
				setVideoSrc(blobUrl);
				return;
			}
			setVideoSrc(video.url);
		};

		loadVideo();

		return () => {
			if (blobUrl) {
				URL.revokeObjectURL(blobUrl);
			}
		};
	}, [video.url]);

	if (!video.url) {
		return null;
	}

	return (
		<section>
			{video.title && (
				<h2 className="mb-6 text-center text-xl font-bold uppercase tracking-wide">
					{video.title}
				</h2>
			)}
			<div className="overflow-hidden rounded-lg">
				{videoSrc && (
					<video
						src={videoSrc}
						poster={video.poster?.url}
						controls
						preload="none"
						className="h-auto w-full"
					/>
				)}
			</div>
		</section>
	);
};

export default VideoSection;
