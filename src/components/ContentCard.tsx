import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ContentItem } from '@/types';

interface ContentCardProps {
	item: ContentItem;
}

const ContentCard = ({ item }: ContentCardProps) => {
	return (
		<Link to={`/asset/${item.id}`}>
			<Card className="overflow-hidden transition-shadow hover:shadow-md">
				<img
					src={item.thumbnail ?? 'https://placehold.co/400x300'}
					alt={item.title}
					className="aspect-4/3 w-full object-cover"
				/>
				<CardContent className="p-3">
					<p className="truncate text-sm font-medium">{item.title}</p>
					<Badge variant="secondary" className="mt-1 text-xs">
						{item.type.toUpperCase()}
					</Badge>
				</CardContent>
			</Card>
		</Link>
	);
};

export default ContentCard;
