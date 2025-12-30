import { describe, it, expect, vi } from 'vitest';
import {
	compareManifests,
	buildDownloadQueue,
	processDownloadQueue,
	syncContent,
	type ManifestDiff,
} from './sync';
import type { ContentItem, ContentManifest } from '@/types';

const baseItem: ContentItem = {
	id: 1,
	title: 'Product Sheet',
	categoryId: 1,
	type: 'pdf',
	url: 'https://example.com/doc.pdf',
	thumbnail: 'https://example.com/thumb.jpg',
	fileSize: 1024,
	checksum: 'abc123',
	modified: '2024-01-01T00:00:00Z',
};

describe('sync service', () => {
	describe('compareManifests', () => {
		it('identifies new items', () => {
			const local: ContentItem[] = [];
			const remote: ContentItem[] = [baseItem];

			const result = compareManifests(local, remote);

			expect(result.toAdd).toHaveLength(1);
			expect(result.toUpdate).toHaveLength(0);
			expect(result.toDelete).toHaveLength(0);
		});

		it('identifies deleted items', () => {
			const local: ContentItem[] = [baseItem];
			const remote: ContentItem[] = [];

			const result = compareManifests(local, remote);

			expect(result.toAdd).toHaveLength(0);
			expect(result.toUpdate).toHaveLength(0);
			expect(result.toDelete).toHaveLength(1);
		});

		it('identifies updated items by checksum', () => {
			const local: ContentItem[] = [baseItem];
			const updatedItem = { ...baseItem, checksum: 'xyz789' };
			const remote: ContentItem[] = [updatedItem];

			const result = compareManifests(local, remote);

			expect(result.toAdd).toHaveLength(0);
			expect(result.toUpdate).toHaveLength(1);
			expect(result.toDelete).toHaveLength(0);
		});

		it('returns empty arrays when manifests are identical', () => {
			const local: ContentItem[] = [baseItem];
			const remote: ContentItem[] = [baseItem];

			const result = compareManifests(local, remote);

			expect(result.toAdd).toHaveLength(0);
			expect(result.toUpdate).toHaveLength(0);
			expect(result.toDelete).toHaveLength(0);
		});
	});

	describe('buildDownloadQueue', () => {
		it('combines toAdd and toUpdate items', () => {
			const diff: ManifestDiff = {
				toAdd: [baseItem],
				toUpdate: [{ ...baseItem, id: 2, checksum: 'new123' }],
				toDelete: [{ ...baseItem, id: 3 }],
			};

			const queue = buildDownloadQueue(diff);

			expect(queue).toHaveLength(2);
			expect(queue.map((item) => item.id)).toEqual([1, 2]);
		});
	});

	describe('processDownloadQueue', () => {
		it('downloads and caches each item', async () => {
			const mockBlob = new Blob(['test'], { type: 'application/pdf' });
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				blob: () => Promise.resolve(mockBlob),
			});

			const queue: ContentItem[] = [baseItem];
			const onProgress = vi.fn();

			await processDownloadQueue(queue, onProgress);

			expect(fetch).toHaveBeenCalledWith(baseItem.url);
			expect(onProgress).toHaveBeenCalledWith({
				completed: 1,
				total: 1,
				currentItem: baseItem.title,
			});
		});
	});

	describe('syncContent', () => {
		it('orchestrates full sync flow', async () => {
			const mockManifest: ContentManifest = {
				version: 'v1.0.0',
				categories: [{ id: 1, name: 'Docs', slug: 'docs' }],
				items: [baseItem],
				totalSize: 1024,
			};

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockManifest),
				blob: () => Promise.resolve(new Blob(['test'])),
			});

			const onProgress = vi.fn();
			await syncContent(onProgress);

			expect(fetch).toHaveBeenCalledWith(baseItem.url);
			expect(onProgress).toHaveBeenCalled();
		});
	});
});
