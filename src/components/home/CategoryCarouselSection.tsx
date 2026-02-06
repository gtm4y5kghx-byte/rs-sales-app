import { Link } from 'react-router';
import type { Category, ContentItem } from '@/types';
import ContentCarousel from './ContentCarousel';

interface CategoryCarouselSectionProps {
	category: Category;
	items: ContentItem[];
}

const CategoryCarouselSection = ({
	category,
	items,
}: CategoryCarouselSectionProps) => {
	if (items.length === 0) {
		return null;
	}

	return (
		<section id={`category-${category.slug}`}>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-bold uppercase tracking-wide">
					{category.name}
				</h2>
				<Link
					to={`/category/${category.id}`}
					className="text-sm text-muted-foreground hover:text-foreground"
				>
					View All
				</Link>
			</div>
			<ContentCarousel items={items} />
		</section>
	);
};

export default CategoryCarouselSection;
