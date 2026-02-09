import type { VideoContent } from '@/types';

interface VideoSectionProps {
	video: VideoContent;
}

const VideoSection = ({ video }: VideoSectionProps) => {
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
				<video
					src={video.url}
					poster={video.poster?.url}
					controls
					preload="none"
					className="h-auto w-full"
				/>
			</div>
		</section>
	);
};

export default VideoSection;
