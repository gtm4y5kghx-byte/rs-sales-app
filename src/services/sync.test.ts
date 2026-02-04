import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	compareManifests,
	buildDownloadQueue,
	processDownloadQueue,
	syncContent,
	checkForUpdates,
	collectAppContentImageUrls,
	type ManifestDiff,
} from './sync';
import type { ContentItem, ContentManifest, AppContent } from '@/types';

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

			const mockAppContent: AppContent = {
				version: 'v1.0.0',
				homepage: {
					hero: {
						title: 'Test',
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

			global.fetch = vi.fn().mockImplementation((url: string) => {
				if (url.includes('app-content')) {
					return Promise.resolve({
						ok: true,
						json: () => Promise.resolve(mockAppContent),
					});
				}
				if (url.includes('content-manifest')) {
					return Promise.resolve({
						ok: true,
						json: () => Promise.resolve(mockManifest),
					});
				}
				return Promise.resolve({
					ok: true,
					blob: () => Promise.resolve(new Blob(['test'])),
				});
			});

			const onProgress = vi.fn();
			await syncContent(onProgress);

			expect(fetch).toHaveBeenCalledWith(baseItem.url);
			expect(onProgress).toHaveBeenCalled();
		});
	});

	describe('checkForUpdates', () => {
		beforeEach(async () => {
			const { clearDatabase } = await import('./db');
			await clearDatabase();
		});

		it('returns count of pending changes', async () => {
			const mockManifest: ContentManifest = {
				version: 'v1.0.0',
				categories: [{ id: 1, name: 'Docs', slug: 'docs' }],
				items: [baseItem, { ...baseItem, id: 2 }],
				totalSize: 2048,
			};

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockManifest),
			});

			const count = await checkForUpdates();

			expect(count).toBe(2);
		});

		it('returns 0 when local and remote match', async () => {
			const mockManifest: ContentManifest = {
				version: 'v1.0.0',
				categories: [],
				items: [],
				totalSize: 0,
			};

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockManifest),
			});

			const count = await checkForUpdates();

			expect(count).toBe(0);
		});

		it('counts updates and deletes in total', async () => {
			const mockManifest: ContentManifest = {
				version: 'v2.0.0',
				categories: [],
				items: [{ ...baseItem, checksum: 'changed' }], // 1 update
				totalSize: 1024,
			};

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockManifest),
			});

			const count = await checkForUpdates();

			expect(count).toBeGreaterThanOrEqual(1);
		});
	});

	describe('collectAppContentImageUrls', () => {
		const baseAppContent: AppContent = {
			version: '2024-01-15T10:30:00Z',
			homepage: {
				hero: {
					title: 'Main Sales Deck',
					description: 'Description',
					image: {
						url: 'https://example.com/hero.jpg',
						thumbnail: 'https://example.com/hero-thumb.jpg',
						alt: 'Hero',
					},
					linkText: 'View',
					linkSlug: 'main',
				},
				faqs: [],
				footerTagline: '',
			},
			pages: [],
		};

		it('extracts hero image URLs', () => {
			const urls = collectAppContentImageUrls(baseAppContent);

			expect(urls).toContain('https://example.com/hero.jpg');
			expect(urls).toContain('https://example.com/hero-thumb.jpg');
		});

		it('extracts page hero and section image URLs', () => {
			const content: AppContent = {
				...baseAppContent,
				pages: [
					{
						slug: 'test',
						title: 'Test Page',
						hero: {
							title: 'Page Hero',
							description: 'Desc',
							image: {
								url: 'https://example.com/page-hero.jpg',
								thumbnail: 'https://example.com/page-hero-thumb.jpg',
								alt: 'Page Hero',
							},
						},
						applications: [
							{
								title: 'App 1',
								description: 'Desc',
								image: {
									url: 'https://example.com/app1.jpg',
									thumbnail: 'https://example.com/app1-thumb.jpg',
									alt: 'App 1',
								},
							},
						],
						video: { url: '', title: '', description: '' },
						features: [
							{
								title: 'Feature 1',
								description: 'Desc',
								image: {
									url: 'https://example.com/feature1.jpg',
									thumbnail: 'https://example.com/feature1-thumb.jpg',
									alt: 'Feature 1',
								},
								specs: {
									poleLength: '',
									poleStrength: '',
									voltageLevel: '',
									applications: '',
								},
							},
						],
						caseStudies: [
							{
								assetId: 1,
								title: 'Case Study',
								summary: 'Summary',
								thumbnail: 'https://example.com/case-thumb.jpg',
							},
						],
					},
				],
			};

			const urls = collectAppContentImageUrls(content);

			expect(urls).toContain('https://example.com/page-hero.jpg');
			expect(urls).toContain('https://example.com/app1.jpg');
			expect(urls).toContain('https://example.com/feature1.jpg');
			expect(urls).toContain('https://example.com/case-thumb.jpg');
		});

		it('deduplicates URLs', () => {
			const content: AppContent = {
				...baseAppContent,
				pages: [
					{
						slug: 'test',
						title: 'Test',
						hero: {
							title: 'Hero',
							description: '',
							image: {
								url: 'https://example.com/hero.jpg', // Same as homepage hero
								thumbnail: 'https://example.com/hero-thumb.jpg',
								alt: 'Hero',
							},
						},
						applications: [],
						video: { url: '', title: '', description: '' },
						features: [],
						caseStudies: [],
					},
				],
			};

			const urls = collectAppContentImageUrls(content);
			const heroCount = urls.filter(
				(u: string) => u === 'https://example.com/hero.jpg',
			).length;

			expect(heroCount).toBe(1);
		});

		it('handles null images gracefully', () => {
			const content: AppContent = {
				version: '2024-01-15T10:30:00Z',
				homepage: {
					hero: {
						title: 'No Image Hero',
						description: '',
						image: null,
						linkText: '',
						linkSlug: null,
					},
					faqs: [],
					footerTagline: '',
				},
				pages: [
					{
						slug: 'test',
						title: 'Test',
						hero: { title: '', description: '', image: null },
						applications: [{ title: '', description: '', image: null }],
						video: { url: '', title: '', description: '' },
						features: [
							{
								title: '',
								description: '',
								image: null,
								specs: {
									poleLength: '',
									poleStrength: '',
									voltageLevel: '',
									applications: '',
								},
							},
						],
						caseStudies: [
							{ assetId: 1, title: '', summary: '', thumbnail: null },
						],
					},
				],
			};

			const urls = collectAppContentImageUrls(content);

			expect(urls).toEqual([]);
		});
	});
});
