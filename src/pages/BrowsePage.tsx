import { useContent } from '@/hooks/useContent';
import ContentSection from '@/components/ContentSection';
import { Button } from '@/components/ui/button';
import { ContentItem } from '@/types';

const mockTitles = [
	'Product Datasheet',
	'Installation Guide',
	'Safety Manual',
	'Quick Start Guide',
	'Technical Specifications',
	'Warranty Information',
	'Troubleshooting Guide',
	'User Manual',
	'Product Overview',
	'Maintenance Schedule',
	'Parts Catalog',
	'Training Materials',
	'Sales Brochure',
	'Case Study',
	'White Paper',
];

const mockItems: ContentItem[] = Array.from({ length: 100 }, (_, i) => ({
	id: i + 1,
	title: `${mockTitles[i % mockTitles.length]} ${Math.floor(i / mockTitles.length) + 1}`,
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

	return <ContentSection title="All Assets" items={displayItems} />;
};

export default BrowsePage;
