import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ContentManifest } from '@/types';
import { fetchManifest } from './api';

const mockManifest: ContentManifest = {
	version: '2024-01-15T10:30:00Z',
	categories: [
		{ id: 1, name: 'Product Sheets', slug: 'product-sheets' },
		{ id: 2, name: 'Guides', slug: 'guides' },
	],
	items: [
		{
			id: 1,
			title: 'Widget Pro Datasheet',
			categoryId: 1,
			type: 'pdf',
			url: 'https://example.com/widget-pro.pdf',
			thumbnail: 'https://example.com/widget-pro-thumb.jpg',
			fileSize: 245000,
			checksum: 'abc123',
			modified: '2024-01-10T08:00:00Z',
		},
	],
	totalSize: 245000,
};

describe('api service', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('fetchManifest', () => {
		it('fetches and returns the content manifest', async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockManifest),
			});

			const result = await fetchManifest();
			expect(result).toEqual(mockManifest);
		});

		it('throws error on network failure', async () => {
			global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

			await expect(fetchManifest()).rejects.toThrow('Network error');
		});

		it('throws error on non-ok response', async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 404,
				statusText: 'Not Found',
				json: () => Promise.resolve({}),
			});

			await expect(fetchManifest()).rejects.toThrow('404');
		});
	});
});
