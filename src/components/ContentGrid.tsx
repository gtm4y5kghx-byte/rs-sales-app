/* eslint-disable react-hooks/incompatible-library */
import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import ContentCard from '@/components/ContentCard';
import type { ContentItem } from '@/types';

interface ContentGridProps {
	items: ContentItem[];
}

const COLUMNS = 4;
const GAP = 16;

const ContentGrid = ({ items }: ContentGridProps) => {
	const parentRef = useRef<HTMLDivElement>(null);
	const measureRef = useRef<HTMLDivElement>(null);
	const [rowHeight, setRowHeight] = useState<number | null>(null);

	const rowCount = Math.ceil(items.length / COLUMNS);

	// Measure actual card height after first paint
	useLayoutEffect(() => {
		if (measureRef.current && rowHeight === null) {
			setRowHeight(measureRef.current.getBoundingClientRect().height);
		}
	}, [rowHeight]);

	// Re-measure on resize
	useEffect(() => {
		const handleResize = () => setRowHeight(null);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const virtualizer = useVirtualizer({
		count: rowCount,
		getScrollElement: () => parentRef.current,
		estimateSize: () => (rowHeight ?? 300) + GAP,
		overscan: 2,
	});

	useLayoutEffect(() => {
		if (rowHeight !== null) {
			virtualizer.measure();
		}
	}, [rowHeight, virtualizer]);

	if (items.length === 0) return null;

	// Show first row normally to measure, then virtualize
	if (rowHeight === null) {
		return (
			<div ref={parentRef} className="h-full overflow-auto">
				<div ref={measureRef} className="grid grid-cols-4 gap-4">
					{items.slice(0, COLUMNS).map((item) => (
						<ContentCard key={item.id} item={item} />
					))}
				</div>
			</div>
		);
	}

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
							style={{ top: `${virtualRow.start}px` }}
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
