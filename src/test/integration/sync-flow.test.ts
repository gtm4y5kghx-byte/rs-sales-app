import { describe, it, expect, beforeEach, vi } from 'vitest';
import { syncContent } from '@/services/sync';
import {
	getContentItems,
	getCategories,
	getSyncState,
	clearDatabase,
} from '@/services/db';
import { getCachedAsset, clearCache } from '@/services/cache';
import type { ContentManifest, AppContent } from '@/types';

const mockManifest: ContentManifest = {
	version: 'v1.0.0',
	categories: [
		{ id: 1, name: 'Products', slug: 'products' },
		{ id: 2, name: 'Guides', slug: 'guides' },
	],
	items: [
		{
			id: 1,
			title: 'Product Sheet',
			categoryId: 1,
			type: 'pdf',
			url: 'https://example.com/product.pdf',
			thumbnail: 'https://example.com/product-thumb.jpg',
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
			thumbnail: 'https://example.com/guide-thumb.jpg',
			fileSize: 2048,
			checksum: 'def456',
			modified: '2024-01-02T00:00:00Z',
		},
	],
	totalSize: 3072,
};

const mockAppContent: AppContent = {
	version: 'v1.0.0',
	homepage: {
		hero: {
			title: 'Test Hero',
			description: '',
			image: null,
			linkText: '',
			linkSlug: null,
		},
		faqs: [],
		footerTagline: '',
	},
	pages: [],
};

const mockPdfBlob = new Blob(['%PDF-1.4 mock content'], {
	type: 'application/pdf',
});

describe('sync integration', () => {
	beforeEach(async () => {
		await clearDatabase();
		await clearCache();
		vi.clearAllMocks();
	});

	it('syncs content from API to IndexedDB and Cache', async () => {
		global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
			const url = typeof input === 'string' ? input : input.toString();
			if (url.includes('content-manifest')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockManifest),
				});
			}
			if (url.includes('app-content')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockAppContent),
				});
			}
			return Promise.resolve({
				ok: true,
				blob: () => Promise.resolve(mockPdfBlob),
			});
		});

		const onProgress = vi.fn();
		await syncContent(onProgress);

		const items = await getContentItems();
		expect(items).toHaveLength(2);
		expect(items[0].title).toBe('Product Sheet');

		const categories = await getCategories();
		expect(categories).toHaveLength(2);

		const syncState = await getSyncState();
		expect(syncState.manifestVersion).toBe('v1.0.0');
		expect(syncState.itemCount).toBe(2);

		const cachedAsset = await getCachedAsset('https://example.com/product.pdf');
		expect(cachedAsset).not.toBeNull();

		expect(onProgress).toHaveBeenCalled();
	});

	it('retrieves content offline after sync', async () => {
		global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
			const url = typeof input === 'string' ? input : input.toString();
			if (url.includes('content-manifest')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockManifest),
				});
			}
			if (url.includes('app-content')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockAppContent),
				});
			}
			return Promise.resolve({
				ok: true,
				blob: () => Promise.resolve(mockPdfBlob),
			});
		});

		await syncContent(vi.fn());

		vi.mocked(fetch).mockRejectedValue(new Error('Network unavailable'));

		const items = await getContentItems();
		expect(items).toHaveLength(2);

		const cachedAsset = await getCachedAsset('https://example.com/product.pdf');
		expect(cachedAsset).not.toBeNull();
	});

	it('only downloads changed items on incremental sync', async () => {
		// Initial sync
		global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
			const url = typeof input === 'string' ? input : input.toString();
			if (url.includes('content-manifest')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockManifest),
				});
			}
			if (url.includes('app-content')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockAppContent),
				});
			}
			return Promise.resolve({
				ok: true,
				blob: () => Promise.resolve(mockPdfBlob),
			});
		});

		await syncContent(vi.fn());

		// Clear mock call history
		vi.mocked(fetch).mockClear();

		// Second sync with updated manifest (one item changed)
		const updatedManifest = {
			...mockManifest,
			version: 'v1.0.1',
			items: [
				mockManifest.items[0], // unchanged
				{ ...mockManifest.items[1], checksum: 'updated789' }, // changed
			],
		};

		global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
			const url = typeof input === 'string' ? input : input.toString();
			if (url.includes('content-manifest')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(updatedManifest),
				});
			}
			if (url.includes('app-content')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockAppContent),
				});
			}
			return Promise.resolve({
				ok: true,
				blob: () => Promise.resolve(mockPdfBlob),
			});
		});

		await syncContent(vi.fn());

		// Should have fetched manifest + app-content + only the changed item (3 calls total)
		expect(fetch).toHaveBeenCalledTimes(3);
	});
});
