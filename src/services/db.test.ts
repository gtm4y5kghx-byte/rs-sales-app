import { describe, it, expect, beforeEach } from 'vitest';
import type { ContentItem, Category, SyncState } from '@/types';

import {
	saveContentItems,
	getContentItems,
	getContentItemsByCategory,
	saveCategories,
	getCategories,
	getSyncState,
	setSyncState,
	clearDatabase,
} from './db';

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
];

const mockCategories: Category[] = [
	{ id: 1, name: 'Product Sheets', slug: 'product-sheets' },
	{ id: 2, name: 'Guides', slug: 'guides' },
];

describe('db service', () => {
	beforeEach(async () => {
		await clearDatabase();
	});

	describe('saveContentItems / getContentItems', () => {
		it('saves and retrieves content items', async () => {
			await saveContentItems(mockItems);
			const items = await getContentItems();
			expect(items).toHaveLength(2);
		});

		it('returns empty array when no items exist', async () => {
			const items = await getContentItems();
			expect(items).toEqual([]);
		});

		it('updates modified items when saving new manifest', async () => {
			await saveContentItems(mockItems);
			const updatedItem = { ...mockItems[0], title: 'Updated Title' };
			await saveContentItems([updatedItem, mockItems[1]]);
			const items = await getContentItems();
			expect(items).toHaveLength(2);
			const found = items.find((i) => i.id === 1);
			expect(found?.title).toBe('Updated Title');
		});

		it('removes deleted items when saving new manifest', async () => {
			await saveContentItems(mockItems);
			// Save only the second item - simulating first item was deleted
			await saveContentItems([mockItems[1]]);
			const items = await getContentItems();
			expect(items).toHaveLength(1);
			expect(items[0].id).toBe(2);
		});
	});

	describe('getContentItemsByCategory', () => {
		it('filters items by category id', async () => {
			await saveContentItems(mockItems);
			const items = await getContentItemsByCategory(1);
			expect(items).toHaveLength(1);
			expect(items[0].categoryId).toBe(1);
		});

		it('returns empty array for non-existent category', async () => {
			await saveContentItems(mockItems);
			const items = await getContentItemsByCategory(999);
			expect(items).toEqual([]);
		});
	});

	describe('saveCategories / getCategories', () => {
		it('saves and retrieves categories', async () => {
			await saveCategories(mockCategories);
			const categories = await getCategories();
			expect(categories).toHaveLength(2);
		});

		it('returns empty array when no categories exist', async () => {
			const categories = await getCategories();
			expect(categories).toEqual([]);
		});

		it('removes deleted categories when saving new manifest', async () => {
			await saveCategories(mockCategories);
			// Save only the second category - simulating first category was deleted
			await saveCategories([mockCategories[1]]);
			const categories = await getCategories();
			expect(categories).toHaveLength(1);
			expect(categories[0].id).toBe(2);
		});
	});

	describe('getSyncState / setSyncState', () => {
		it('returns default state when not set', async () => {
			const state = await getSyncState();
			expect(state).toEqual({
				lastSynced: null,
				manifestVersion: null,
				itemCount: 0,
			});
		});

		it('saves and retrieves sync state', async () => {
			const newState: SyncState = {
				lastSynced: '2024-01-15T10:30:00Z',
				manifestVersion: 'v1.0.0',
				itemCount: 50,
			};
			await setSyncState(newState);
			const state = await getSyncState();
			expect(state).toEqual(newState);
		});
	});
});
