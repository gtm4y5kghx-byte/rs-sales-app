import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AssetTypeBadge from '@/components/AssetTypeBadge';
import type { ContentItem } from '@/types';

interface ContentCardProps {
	item: ContentItem;
}

const ContentCard = ({ item }: ContentCardProps) => {
	return (
		<Link to={`/asset/${item.id}`} className="block h-full">
			<Card className="flex h-full flex-col gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
				<img
					src={item.thumbnail ?? 'https://placehold.co/400x300?text=No+Preview'}
					alt={item.title}
					className="aspect-4/3 w-full object-cover"
				/>
				<CardContent className="flex flex-1 flex-col justify-between p-4">
					<p className="line-clamp-2 text-sm font-medium">
						{item.title}
					</p>
					<div className="mt-2 flex justify-end">
						<AssetTypeBadge type={item.type} />
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};
export default ContentCard;
