import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { ContentItem } from '@/types';

interface ContentCardProps {
	item: ContentItem;
	compact?: boolean;
}

const ContentCard = ({ item, compact = false }: ContentCardProps) => {
	return (
		<Link to={`/asset/${item.id}`}>
			<Card className="overflow-hidden transition-shadow hover:shadow-md">
				<img
					src={item.thumbnail ?? 'https://placehold.co/400x300?text=No+Preview'}
					alt={item.title}
					className={cn(
						'w-full object-cover',
						compact ? 'aspect-square' : 'aspect-4/3',
					)}
				/>
				<CardContent className={cn('p-3', compact && 'p-2')}>
					{compact ? (
						<p className="line-clamp-1 text-xs font-medium">{item.title}</p>
					) : (
						<>
							<Tooltip>
								<TooltipTrigger asChild>
									<p className="line-clamp-2 text-sm font-medium">
										{item.title}
									</p>
								</TooltipTrigger>
								<TooltipContent>
									<p className="max-w-xs">{item.title}</p>
								</TooltipContent>
							</Tooltip>
							<Badge variant="secondary" className="mt-1 text-xs">
								{item.type.toUpperCase()}
							</Badge>
						</>
					)}
				</CardContent>
			</Card>
		</Link>
	);
};
export default ContentCard;
