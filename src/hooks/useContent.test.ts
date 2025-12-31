import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useContent } from './useContent';
import { useStore } from '@/store/store';
import * as db from '@/services/db';
import type { ContentItem, Category } from '@/types';

vi.mock('@/services/db');

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
];

const mockCategories: Category[] = [
	{ id: 1, name: 'Products', slug: 'products' },
];

describe('useContent', () => {
	beforeEach(() => {
		useStore.setState({
			items: [],
			categories: [],
			selectedCategoryId: null,
			syncStatus: 'idle',
			syncProgress: null,
			lastSynced: null,
		});
		vi.clearAllMocks();
	});

	it('loads items and categories from IndexedDB on mount', async () => {
		vi.mocked(db.getContentItems).mockResolvedValue(mockItems);
		vi.mocked(db.getCategories).mockResolvedValue(mockCategories);

		renderHook(() => useContent());

		await waitFor(() => {
			expect(useStore.getState().items).toHaveLength(1);
			expect(useStore.getState().categories).toHaveLength(1);
		});
	});
});
