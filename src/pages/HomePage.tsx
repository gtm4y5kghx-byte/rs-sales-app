import { useContent } from '@/hooks/useContent';
import { useAppContent } from '@/hooks/useAppContent';
import { Loader2 } from 'lucide-react';
import SyncButton from '@/components/SyncButton';
import HeroSection from '@/components/home/HeroSection';
import CategoryCarouselSection from '@/components/home/CategoryCarouselSection';
import ContentCarousel from '@/components/home/ContentCarousel';

const HomePage = () => {
	const { items, categories, isLoading } = useContent();
	const { homepage, isLoading: isAppContentLoading } = useAppContent();

	if (isLoading || isAppContentLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<p className="mb-4 text-muted-foreground">No content synced yet.</p>
					<SyncButton className="w-auto" />
				</div>
			</div>
		);
	}

	const videoItems = items.filter((item) => item.type === 'video');

	return (
		<div className="space-y-8">
			{homepage?.hero && <HeroSection hero={homepage.hero} />}

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

			{videoItems.length > 0 && (
				<section id="video-resources">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-lg font-bold uppercase tracking-wide">
							Video Resources
						</h2>
						<span className="text-sm text-muted-foreground">View All</span>
					</div>
					<ContentCarousel items={videoItems} />
				</section>
			)}
		</div>
	);
};

export default HomePage;
