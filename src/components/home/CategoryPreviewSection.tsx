import { Link } from 'react-router';
import type { Category, ContentItem } from '@/types';
import ContentCard from '@/components/ContentCard';
import { Button } from '@/components/ui/button';

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
				<Button variant="pill" asChild className="border-none bg-rs-blue text-white hover:bg-rs-blue/80">
					<Link to={`/category/${category.id}`}>
						View All
					</Link>
				</Button>
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
