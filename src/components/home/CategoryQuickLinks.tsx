import { Button } from '@/components/ui/button';
import type { Category } from '@/types';

interface CategoryQuickLinksProps {
	categories: Category[];
}

const CategoryQuickLinks = ({
	categories,
}: CategoryQuickLinksProps) => {
	const scrollTo = (id: string) => {
		const el = document.getElementById(id);
		if (!el) return;
		const header = document.querySelector('header');
		const offset = header ? header.getBoundingClientRect().height + 16 : 0;
		const top = el.getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({ top, behavior: 'smooth' });
	};

	return (
		<div className="flex flex-wrap gap-2">
			{categories.map((category) => (
				<Button
					key={category.id}
					variant="pill"
					onClick={() => scrollTo(`category-${category.slug}`)}
				>
					{category.name}
				</Button>
			))}
		</div>
	);
};

export default CategoryQuickLinks;
