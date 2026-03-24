import { useContent } from '@/hooks/useContent';
import { useAppContent } from '@/hooks/useAppContent';
import { Loader2 } from 'lucide-react';
import SyncButton from '@/components/SyncButton';
import HeroSection from '@/components/home/HeroSection';
import CategoryPreviewSection from '@/components/home/CategoryPreviewSection';
import CategoryQuickLinks from '@/components/home/CategoryQuickLinks';
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

			<CategoryQuickLinks categories={categories} />

			{categories.map((category) => {
				const categoryItems = items.filter(
					(item) => item.categoryId === category.id
				);
				return (
					<CategoryPreviewSection
						key={category.id}
						category={category}
						items={categoryItems}
					/>
				);
			})}

		</div>
	);
};

export default HomePage;
