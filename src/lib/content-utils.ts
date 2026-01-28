import type { ContentItem } from '@/types';

export const RECENTLY_UPDATED_DAYS = 7;

/**
 * Checks if a category has any items that were modified within the recent period.
 */
export function hasRecentlyUpdatedItems(
	items: ContentItem[],
	categoryId: number,
	days: number = RECENTLY_UPDATED_DAYS,
): boolean {
	const now = new Date();
	const cutoff = new Date(now);
	cutoff.setDate(cutoff.getDate() - days);

	return items.some(
		(item) =>
			item.categoryId === categoryId && new Date(item.modified) > cutoff,
	);
}

/**
 * Returns items sorted by modified date (newest first), limited to specified count.
 */
export function getRecentItems(
	items: ContentItem[],
	limit: number = 5,
): ContentItem[] {
	return [...items]
		.sort(
			(a, b) =>
				new Date(b.modified).getTime() - new Date(a.modified).getTime(),
		)
		.slice(0, limit);
}

/**
 * Counts the number of items in a specific category.
 */
export function getItemCountByCategory(
	items: ContentItem[],
	categoryId: number,
): number {
	return items.filter((item) => item.categoryId === categoryId).length;
}
