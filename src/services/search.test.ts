import { describe, it, expect } from 'vitest';
import type { ContentItem } from '@/types';
import { buildSearchIndex, search } from './search';

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

describe('search service', () => {
	describe('buildSearchIndex', () => {
		it('creates a search index from items', () => {
			const index = buildSearchIndex(mockItems);
			expect(index).toBeDefined();
		});

		it('handles empty items array', () => {
			const index = buildSearchIndex([]);
			expect(index).toBeDefined();
		});
	});

	describe('search', () => {
		it('returns matching item IDs for exact match', () => {
			const index = buildSearchIndex(mockItems);
			const results = search(index, 'Installation');
			expect(results).toContain(2);
		});

		it('supports prefix matching', () => {
			const index = buildSearchIndex(mockItems);
			const results = search(index, 'Prod');
			expect(results).toContain(1);
			expect(results).toContain(3);
		});

		it('returns empty array for no matches', () => {
			const index = buildSearchIndex(mockItems);
			const results = search(index, 'xyznonexistent');
			expect(results).toEqual([]);
		});

		it('returns all IDs for empty query', () => {
			const index = buildSearchIndex(mockItems);
			const results = search(index, '');
			expect(results).toHaveLength(3);
		});

		it('is case insensitive', () => {
			const index = buildSearchIndex(mockItems);
			const results = search(index, 'product');
			expect(results).toContain(1);
			expect(results).toContain(3);
		});
	});
});
