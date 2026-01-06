import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';
import type { ContentItem } from '@/types';

const mockItems: ContentItem[] = [
	{
		id: 1,
		title: 'Product Datasheet',
		categoryId: 1,
		type: 'pdf',
		url: 'https://example.com/doc.pdf',
		thumbnail: 'https://example.com/thumb.jpg',
		fileSize: 245000,
		checksum: 'abc123',
		modified: '2024-01-10T08:00:00Z',
	},
	{
		id: 2,
		title: 'Installation Guide',
		categoryId: 2,
		type: 'pdf',
		url: 'https://example.com/guide.pdf',
		thumbnail: 'https://example.com/thumb2.jpg',
		fileSize: 512000,
		checksum: 'def456',
		modified: '2024-01-11T08:00:00Z',
	},
	{
		id: 3,
		title: 'Product Overview Video',
		categoryId: 1,
		type: 'video',
		url: 'https://example.com/video.mp4',
		thumbnail: 'https://example.com/thumb3.jpg',
		fileSize: 1024000,
		checksum: 'ghi789',
		modified: '2024-01-12T08:00:00Z',
	},
];

describe('useSearch', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns all items when query is empty', () => {
		const { result } = renderHook(() => useSearch(mockItems));

		expect(result.current.results).toHaveLength(3);
	});

	it('rebuilds index when items change', () => {
		const { result, rerender } = renderHook(({ items }) => useSearch(items), {
			initialProps: { items: mockItems },
		});

		expect(result.current.results).toHaveLength(3);

		const newItems = mockItems.slice(0, 1);
		rerender({ items: newItems });

		expect(result.current.results).toHaveLength(1);
	});

	it('filters results based on search query', () => {
		const { result } = renderHook(() => useSearch(mockItems));

		act(() => {
			result.current.setQuery('Installation');
		});

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(result.current.results).toHaveLength(1);
		expect(result.current.results[0].id).toBe(2);
	});

	it('debounces search input', () => {
		const { result } = renderHook(() => useSearch(mockItems));

		act(() => {
			result.current.setQuery('Prod');
		});

		// Before debounce completes - still shows all
		expect(result.current.results).toHaveLength(3);

		act(() => {
			vi.advanceTimersByTime(299);
		});

		// Still not triggered
		expect(result.current.results).toHaveLength(3);

		act(() => {
			vi.advanceTimersByTime(1);
		});

		// Now filtered
		expect(result.current.results).toHaveLength(2);
	});

	it('exposes current query value', () => {
		const { result } = renderHook(() => useSearch(mockItems));

		expect(result.current.query).toBe('');

		act(() => {
			result.current.setQuery('test');
		});

		expect(result.current.query).toBe('test');
	});
});
