import { useContent } from '@/hooks/useContent';
import { useAppContent } from '@/hooks/useAppContent';
import { Loader2 } from 'lucide-react';
import SyncButton from '@/components/SyncButton';
import HeroSection from '@/components/home/HeroSection';
import ContentCarousel from '@/components/home/ContentCarousel';
import CategoryGrid from '@/components/home/CategoryGrid';
import { getRecentItems } from '@/lib/content-utils';

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

	const recentItems = getRecentItems(items, 5);

	return (
		<div className="space-y-8">
			{homepage?.hero && <HeroSection hero={homepage.hero} />}

			{recentItems.length > 0 && (
				<section>
					<h2 className="mb-4 text-lg font-semibold">Recently Added</h2>
					<ContentCarousel items={recentItems} />
				</section>
			)}

			{categories.length > 0 && (
				<section>
					<h2 className="mb-4 text-lg font-semibold">Browse by Category</h2>
					<CategoryGrid categories={categories} items={items} />
				</section>
			)}
		</div>
	);
};

export default HomePage;
