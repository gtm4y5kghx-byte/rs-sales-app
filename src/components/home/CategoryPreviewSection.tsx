import { Link } from 'react-router';
import type { Category, ContentItem } from '@/types';
import ContentCard from '@/components/ContentCard';

interface CategoryPreviewSectionProps {
	category: Category;
	items: ContentItem[];
}

const CategoryPreviewSection = ({
	category,
	items,
}: CategoryPreviewSectionProps) => {
	if (items.length === 0) {
		return null;
	}

	const previewItems = items.slice(0, 4);

	return (
		<section id={`category-${category.slug}`}>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-bold uppercase tracking-wide">
					{category.name}
				</h2>
				<Link
					to={`/category/${category.id}`}
					className="text-sm font-medium text-rs-blue hover:text-rs-blue/80"
				>
					View All
				</Link>
			</div>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{previewItems.map((item) => (
					<ContentCard key={item.id} item={item} />
				))}
			</div>
		</section>
	);
};

export default CategoryPreviewSection;
