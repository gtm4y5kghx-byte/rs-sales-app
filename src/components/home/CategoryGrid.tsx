import { Link } from 'react-router-dom';
import type { Category, ContentItem } from '@/types';
import CategoryIcon from './CategoryIcon';

interface CategoryGridProps {
	categories: Category[];
	items: ContentItem[];
}

const CategoryGrid = ({ categories, items }: CategoryGridProps) => {
	const getCategoryCount = (catId: number) =>
		items.filter((i) => i.categoryId === catId).length;

	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{categories.map((cat) => (
				<Link
					key={cat.id}
					to={`/category/${cat.id}`}
					className="group rounded-lg border bg-card p-4 transition hover:border-rs-blue hover:shadow-md"
				>
					<div className="mb-2">
						<CategoryIcon slug={cat.slug} className="h-8 w-8 text-rs-blue" />
					</div>
					<h3 className="text-sm font-medium group-hover:text-rs-blue">
						{cat.name}
					</h3>
					<p className="text-xs text-muted-foreground">
						{getCategoryCount(cat.id)} items
					</p>
				</Link>
			))}
		</div>
	);
};

export default CategoryGrid;
