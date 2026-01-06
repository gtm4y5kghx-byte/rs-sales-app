import { useContent } from '@/hooks/useContent';
import ContentGrid from '@/components/ContentGrid';
import { Button } from '@/components/ui/button';

const BrowsePage = () => {
	const { items } = useContent();

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

	return (
		<div>
			<h1 className="mb-4 text-xl font-semibold">
				All Assets ({items.length})
			</h1>
			<ContentGrid items={items} />
		</div>
	);
};

export default BrowsePage;
