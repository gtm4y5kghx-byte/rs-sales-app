import { useContent } from '@/hooks/useContent';
import ContentGrid from '@/components/ContentGrid';
import { Button } from '@/components/ui/button';
import { ContentItem } from '@/types';

const mockItems: ContentItem[] = Array.from({ length: 100 }, (_, i) => ({
	id: i + 1,
	title: `Asset ${i + 1}`,
	type: i % 3 === 0 ? 'pdf' : 'image',
	url: `https://placehold.co/400x300?text=Asset+${i + 1}`,
	thumbnail: `https://placehold.co/400x300?text=Asset+${i + 1}`,
	checksum: `checksum-${i}`,
	categoryId: (i % 5) + 1,
	fileSize: 1024 * (i + 1),
	modified: '9111',
}));

const BrowsePage = () => {
	const { items } = useContent();

	const displayItems = items.length > 0 ? items : mockItems;

	if (displayItems.length === 0) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<p className="mb-4 text-muted-foreground">No content synced yet.</p>
					<Button>Sync Now</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			<h1 className="mb-4 text-xl font-semibold">
				All Assets ({displayItems.length})
			</h1>
			<ContentGrid items={displayItems} />
		</div>
	);
};

export default BrowsePage;
