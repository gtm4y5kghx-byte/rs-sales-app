import MiniSearch from 'minisearch';
import type { ContentItem } from '@/types';

export type SearchIndex = {
	index: MiniSearch<ContentItem>;
	allIds: number[];
};

export const buildSearchIndex = (items: ContentItem[]): SearchIndex => {
	const index = new MiniSearch<ContentItem>({
		fields: ['title'],
		storeFields: ['id'],
		searchOptions: {
			prefix: true,
			fuzzy: false,
			combineWith: 'AND',
		},
	});

	index.addAll(items);
	return { index, allIds: items.map((item) => item.id) };
};

export const search = (searchIndex: SearchIndex, query: string): number[] => {
	if (!query.trim()) {
		return searchIndex.allIds;
	}

	const results = searchIndex.index.search(query);
	return results.map((result) => result.id as number);
};
