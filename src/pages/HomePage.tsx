import { useContent } from '@/hooks/useContent';
import { useAppContent } from '@/hooks/useAppContent';
import { Loader2 } from 'lucide-react';
import SyncButton from '@/components/SyncButton';
import HeroSection from '@/components/home/HeroSection';
import CategoryCarouselSection from '@/components/home/CategoryCarouselSection';
import CategoryQuickLinks from '@/components/home/CategoryQuickLinks';
import FAQAccordion from '@/components/home/FAQAccordion';

const HomePage = () => {
	const { items, categories, isLoading } = useContent();
	const { homepage, hasFaqs, isLoading: isAppContentLoading } = useAppContent();

	if (isLoading || isAppContentLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (items.length === 0 && !homepage) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<p className="mb-4 text-muted-foreground">No content synced yet.</p>
					<SyncButton className="w-auto" />
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-5xl space-y-8">
			{homepage?.hero && <HeroSection hero={homepage.hero} />}

			<CategoryQuickLinks categories={categories} hasFaqs={hasFaqs} />

			{categories.map((category) => {
				const categoryItems = items.filter(
					(item) => item.categoryId === category.id
				);
				return (
					<CategoryCarouselSection
						key={category.id}
						category={category}
						items={categoryItems}
					/>
				);
			})}

			{hasFaqs && <FAQAccordion faqs={homepage!.faqs} />}
		</div>
	);
};

export default HomePage;
