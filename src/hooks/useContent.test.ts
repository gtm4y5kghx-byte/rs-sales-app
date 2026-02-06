import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useContent } from './useContent';
import { useStore } from '@/store/store';
import * as db from '@/services/db';
import { mockContentItems, mockCategories } from '@/test/fixtures';

vi.mock('@/services/db');

describe('useContent', () => {
	beforeEach(() => {
		useStore.setState({
			items: [],
			categories: [],
			selectedCategoryId: null,
			isContentLoading: true,
			syncStatus: 'idle',
			syncProgress: null,
			lastSynced: null,
		});
		vi.clearAllMocks();
	});

	it('loads items and categories from IndexedDB on mount', async () => {
		vi.mocked(db.getContentItems).mockResolvedValue(mockContentItems);
		vi.mocked(db.getCategories).mockResolvedValue(mockCategories);

		renderHook(() => useContent());

		await waitFor(() => {
			expect(useStore.getState().items).toHaveLength(2);
			expect(useStore.getState().categories).toHaveLength(2);
		});
	});

	it('sets isLoading to false after content loads', async () => {
		vi.mocked(db.getContentItems).mockResolvedValue(mockContentItems);
		vi.mocked(db.getCategories).mockResolvedValue(mockCategories);

		expect(useStore.getState().isContentLoading).toBe(true);

		renderHook(() => useContent());

		await waitFor(() => {
			expect(useStore.getState().isContentLoading).toBe(false);
		});
	});
});
