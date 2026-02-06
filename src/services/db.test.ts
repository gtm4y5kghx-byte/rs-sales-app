import { describe, it, expect, beforeEach } from 'vitest';
import type { SyncState } from '@/types';
import {
	saveContentItems,
	getContentItems,
	getContentItemsByCategory,
	saveCategories,
	getCategories,
	getSyncState,
	setSyncState,
	saveAppContent,
	getAppContent,
	clearDatabase,
} from './db';
import {
	mockContentItems,
	mockCategories,
	mockAppContent,
} from '@/test/fixtures';

describe('db service', () => {
	beforeEach(async () => {
		await clearDatabase();
	});

	describe('saveContentItems / getContentItems', () => {
		it('saves and retrieves content items', async () => {
			await saveContentItems(mockContentItems);
			const items = await getContentItems();
			expect(items).toHaveLength(2);
		});

		it('returns empty array when no items exist', async () => {
			const items = await getContentItems();
			expect(items).toEqual([]);
		});

		it('updates modified items when saving new manifest', async () => {
			await saveContentItems(mockContentItems);
			const updatedItem = { ...mockContentItems[0], title: 'Updated Title' };
			await saveContentItems([updatedItem, mockContentItems[1]]);
			const items = await getContentItems();
			expect(items).toHaveLength(2);
			const found = items.find((i) => i.id === 1);
			expect(found?.title).toBe('Updated Title');
		});

		it('removes deleted items when saving new manifest', async () => {
			await saveContentItems(mockContentItems);
			// Save only the second item - simulating first item was deleted
			await saveContentItems([mockContentItems[1]]);
			const items = await getContentItems();
			expect(items).toHaveLength(1);
			expect(items[0].id).toBe(2);
		});
	});

	describe('getContentItemsByCategory', () => {
		it('filters items by category id', async () => {
			await saveContentItems(mockContentItems);
			const items = await getContentItemsByCategory(1);
			expect(items).toHaveLength(1);
			expect(items[0].categoryId).toBe(1);
		});

		it('returns empty array for non-existent category', async () => {
			await saveContentItems(mockContentItems);
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

	describe('saveAppContent / getAppContent', () => {
		it('returns null when no app content exists', async () => {
			const content = await getAppContent();
			expect(content).toBeNull();
		});

		it('saves and retrieves app content', async () => {
			await saveAppContent(mockAppContent);
			const content = await getAppContent();
			expect(content).toEqual(mockAppContent);
		});

		it('overwrites existing app content on save', async () => {
			await saveAppContent(mockAppContent);

			const updatedContent: AppContent = {
				...mockAppContent,
				version: '2024-01-16T10:30:00Z',
				homepage: {
					...mockAppContent.homepage,
					hero: {
						...mockAppContent.homepage.hero,
						title: 'Updated Title',
					},
				},
			};
			await saveAppContent(updatedContent);

			const content = await getAppContent();
			expect(content?.version).toBe('2024-01-16T10:30:00Z');
			expect(content?.homepage.hero.title).toBe('Updated Title');
		});
	});
});
