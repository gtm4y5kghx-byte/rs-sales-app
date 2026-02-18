import type { Category } from '@/types';

interface CategoryQuickLinksProps {
	categories: Category[];
	hasFaqs: boolean;
}

const CategoryQuickLinks = ({
	categories,
	hasFaqs,
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
				<button
					key={category.id}
					onClick={() => scrollTo(`category-${category.slug}`)}
					className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
				>
					{category.name}
				</button>
			))}
			{hasFaqs && (
				<button
					onClick={() => scrollTo('faq')}
					className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
				>
					Frequently Asked Questions
				</button>
			)}
		</div>
	);
};

export default CategoryQuickLinks;
