import { Link } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import WelcomeBanner from '@/components/home/WelcomeBanner';
import ContentCarousel from '@/components/home/ContentCarousel';
import CategoryGrid from '@/components/home/CategoryGrid';
import rsLogo from '@/assets/rs_logo.png';

const HomePage = () => {
	const { items, categories, isLoading } = useContent();

	if (isLoading) {
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
					<Button>Sync Now</Button>
				</div>
			</div>
		);
	}

	// Sort items by modified date for "Recently Added"
	const recentItems = [...items]
		.sort(
			(a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime(),
		)
		.slice(0, 5);

	return (
		<div className="space-y-8">
			<header>
				<Link to="/">
					<img src={rsLogo} alt="RS" className="h-16" />
				</Link>
			</header>

			<WelcomeBanner />

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
