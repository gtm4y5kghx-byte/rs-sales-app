import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ContentItem } from '@/types';
import ContentCard from '@/components/ContentCard';

interface ContentCarouselProps {
	items: ContentItem[];
}

const ContentCarousel = ({ items }: ContentCarouselProps) => {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: 'left' | 'right') => {
		if (scrollRef.current) {
			const cardWidth = 224;
			scrollRef.current.scrollBy({
				left: direction === 'left' ? -cardWidth * 2 : cardWidth * 2,
				behavior: 'smooth',
			});
		}
	};

	return (
		<div className="group relative">
			{/* Left Arrow */}
			<button
				onClick={() => scroll('left')}
				className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-1.5 opacity-0 shadow-md transition group-hover:opacity-100"
				aria-label="Scroll left"
			>
				<ChevronLeft className="h-4 w-4" />
			</button>

			{/* Scrollable Container */}
			<div
				ref={scrollRef}
				className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth pb-2"
			>
				{items.map((item) => (
					<div key={item.id} className="w-56 flex-shrink-0">
						<ContentCard item={item} compact />
					</div>
				))}
			</div>

			{/* Right Arrow */}
			<button
				onClick={() => scroll('right')}
				className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-1.5 opacity-0 shadow-md transition group-hover:opacity-100"
				aria-label="Scroll right"
			>
				<ChevronRight className="h-4 w-4" />
			</button>
		</div>
	);
};

export default ContentCarousel;
