import ContentCard from '@/components/ContentCard';
import type { ContentItem } from '@/types';

interface ContentGridProps {
	items: ContentItem[];
}

const ContentGrid = ({ items }: ContentGridProps) => {
	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{items.map((item) => (
				<ContentCard key={item.id} item={item} />
			))}
		</div>
	);
};

export default ContentGrid;
