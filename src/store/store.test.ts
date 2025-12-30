import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';
import type { ContentItem, Category } from '@/types';

const mockItems: ContentItem[] = [
	{
		id: 1,
		title: 'Product Sheet',
		categoryId: 1,
		type: 'pdf',
		url: 'https://example.com/doc.pdf',
		thumbnail: 'https://example.com/thumb.jpg',
		fileSize: 1024,
		checksum: 'abc123',
		modified: '2024-01-01T00:00:00Z',
	},
	{
		id: 2,
		title: 'User Guide',
		categoryId: 2,
		type: 'pdf',
		url: 'https://example.com/guide.pdf',
		thumbnail: 'https://example.com/thumb2.jpg',
		fileSize: 2048,
		checksum: 'def456',
		modified: '2024-01-02T00:00:00Z',
	},
];

const mockCategories: Category[] = [
	{ id: 1, name: 'Products', slug: 'products' },
	{ id: 2, name: 'Guides', slug: 'guides' },
];

describe('store', () => {
	beforeEach(() => {
		useStore.setState({
			items: [],
			categories: [],
			selectedCategoryId: null,
			syncStatus: 'idle',
			syncProgress: null,
			lastSynced: null,
		});
	});

	describe('content slice', () => {
		it('sets and retrieves items', () => {
			useStore.getState().setItems(mockItems);
			expect(useStore.getState().items).toHaveLength(2);
		});

		it('sets and retrieves categories', () => {
			useStore.getState().setCategories(mockCategories);
			expect(useStore.getState().categories).toHaveLength(2);
		});

		it('filters items by selected category', () => {
			useStore.getState().setItems(mockItems);
			useStore.getState().setSelectedCategoryId(1);
			const filtered = useStore.getState().getFilteredItems();
			expect(filtered).toHaveLength(1);
			expect(filtered[0].categoryId).toBe(1);
		});

		it('returns all items when no category selected', () => {
			useStore.getState().setItems(mockItems);
			useStore.getState().setSelectedCategoryId(null);
			const filtered = useStore.getState().getFilteredItems();
			expect(filtered).toHaveLength(2);
		});
	});

	describe('sync slice', () => {
		it('sets sync status', () => {
			useStore.getState().setSyncStatus('downloading');
			expect(useStore.getState().syncStatus).toBe('downloading');
		});

		it('sets sync progress', () => {
			const progress = { completed: 5, total: 10, currentItem: 'doc.pdf' };
			useStore.getState().setSyncProgress(progress);
			expect(useStore.getState().syncProgress).toEqual(progress);
		});

		it('sets last synced timestamp', () => {
			const timestamp = '2024-01-15T10:30:00Z';
			useStore.getState().setLastSynced(timestamp);
			expect(useStore.getState().lastSynced).toBe(timestamp);
		});
	});
});
