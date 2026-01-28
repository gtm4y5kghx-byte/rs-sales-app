import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import type { Category, ContentItem } from '@/types';
import {
	hasRecentlyUpdatedItems,
	getItemCountByCategory,
} from '@/lib/content-utils';
import CategoryIcon from './CategoryIcon';

interface CategoryGridProps {
	categories: Category[];
	items: ContentItem[];
}

const CategoryGrid = ({ categories, items }: CategoryGridProps) => {
	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{categories.map((cat) => {
				const isRecentlyUpdated = hasRecentlyUpdatedItems(items, cat.id);
				return (
					<Link
						key={cat.id}
						to={`/category/${cat.id}`}
						className="group relative rounded-lg border bg-card p-4 transition hover:border-rs-blue hover:shadow-md"
					>
						{isRecentlyUpdated && (
							<span className="absolute right-2 top-2 text-amber-500">
								<Sparkles className="h-4 w-4" />
							</span>
						)}
						<div className="mb-2">
							<CategoryIcon slug={cat.slug} className="h-8 w-8 text-rs-blue" />
						</div>
						<h3 className="text-sm font-medium group-hover:text-rs-blue">
							{cat.name}
						</h3>
						<p className="text-xs text-muted-foreground">
							{getItemCountByCategory(items, cat.id)} items
						</p>
					</Link>
				);
			})}
		</div>
	);
};

export default CategoryGrid;
