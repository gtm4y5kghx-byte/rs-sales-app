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
