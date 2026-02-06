import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';
import {
	mockContentItems,
	mockCategories,
	mockEmptyAppContent,
} from '@/test/fixtures';

describe('store', () => {
	beforeEach(() => {
		useStore.setState({
			items: [],
			categories: [],
			selectedCategoryId: null,
			syncStatus: 'idle',
			syncProgress: null,
			lastSynced: null,
			appContent: null,
			isAppContentLoading: true,
		});
	});

	describe('content slice', () => {
		it('sets and retrieves items', () => {
			useStore.getState().setItems(mockContentItems);
			expect(useStore.getState().items).toHaveLength(2);
		});

		it('sets and retrieves categories', () => {
			useStore.getState().setCategories(mockCategories);
			expect(useStore.getState().categories).toHaveLength(2);
		});

		it('filters items by selected category', () => {
			useStore.getState().setItems(mockContentItems);
			useStore.getState().setSelectedCategoryId(1);
			const filtered = useStore.getState().getFilteredItems();
			expect(filtered).toHaveLength(1);
			expect(filtered[0].categoryId).toBe(1);
		});

		it('returns all items when no category selected', () => {
			useStore.getState().setItems(mockContentItems);
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

	describe('app content slice', () => {
		it('defaults appContent to null', () => {
			expect(useStore.getState().appContent).toBeNull();
		});

		it('defaults isAppContentLoading to true', () => {
			expect(useStore.getState().isAppContentLoading).toBe(true);
		});

		it('sets app content', () => {
			useStore.getState().setAppContent(mockEmptyAppContent);
			expect(useStore.getState().appContent).toEqual(mockEmptyAppContent);
		});

		it('sets app content loading state', () => {
			useStore.getState().setAppContentLoading(false);
			expect(useStore.getState().isAppContentLoading).toBe(false);
		});
	});
});
