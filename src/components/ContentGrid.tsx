/* eslint-disable react-hooks/incompatible-library */
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import ContentCard from '@/components/ContentCard';
import type { ContentItem } from '@/types';

interface ContentGridProps {
	items: ContentItem[];
}

const COLUMNS = 4;
const GAP = 16;
const CARD_HEIGHT = 200; // Approximate height including padding

const ContentGrid = ({ items }: ContentGridProps) => {
	const parentRef = useRef<HTMLDivElement>(null);

	const rowCount = Math.ceil(items.length / COLUMNS);

	const virtualizer = useVirtualizer({
		count: rowCount,
		getScrollElement: () => parentRef.current,
		estimateSize: () => CARD_HEIGHT + GAP,
		overscan: 2,
	});

	return (
		<div ref={parentRef} className="h-full overflow-auto">
			<div
				className="relative w-full"
				style={{ height: `${virtualizer.getTotalSize()}px` }}
			>
				{virtualizer.getVirtualItems().map((virtualRow) => {
					const startIndex = virtualRow.index * COLUMNS;
					const rowItems = items.slice(startIndex, startIndex + COLUMNS);

					return (
						<div
							key={virtualRow.key}
							className="absolute left-0 right-0 grid grid-cols-4 gap-4"
							style={{
								top: `${virtualRow.start}px`,
								height: `${virtualRow.size}px`,
							}}
						>
							{rowItems.map((item) => (
								<ContentCard key={item.id} item={item} />
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ContentGrid;
