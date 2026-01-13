import { useContent } from '@/hooks/useContent';
import ContentSection from '@/components/ContentSection';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const BrowsePage = () => {
	const { items, isLoading } = useContent();

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

	return <ContentSection title="All Assets" items={items} />;
};

export default BrowsePage;
