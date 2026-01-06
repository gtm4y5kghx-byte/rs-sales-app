import { useState, useMemo, useEffect } from 'react';
import { buildSearchIndex, search } from '@/services/search';
import type { ContentItem } from '@/types';

const DEBOUNCE_MS = 300;

export const useSearch = (items: ContentItem[]) => {
	const [query, setQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');

	const searchIndex = useMemo(() => buildSearchIndex(items), [items]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query);
		}, DEBOUNCE_MS);

		return () => clearTimeout(timer);
	}, [query]);

	const results = useMemo(() => {
		const matchingIds = search(searchIndex, debouncedQuery);
		return items.filter((item) => matchingIds.includes(item.id));
	}, [searchIndex, debouncedQuery, items]);

	return {
		query,
		setQuery,
		results,
	};
};
