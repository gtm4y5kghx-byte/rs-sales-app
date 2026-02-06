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
import {
	mockContentItem,
	mockAppContent,
	mockEmptyAppContent,
} from '@/test/fixtures';

const baseItem = mockContentItem;

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
		const mockFetchForUpdates = (
			manifest: ContentManifest,
			appContent: AppContent = mockEmptyAppContent,
		) => {
			global.fetch = vi.fn().mockImplementation((url: string) => {
				if (url.includes('app-content')) {
					return Promise.resolve({
						ok: true,
						json: () => Promise.resolve(appContent),
					});
				}
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(manifest),
				});
			});
		};

		beforeEach(async () => {
			const { clearDatabase } = await import('./db');
			await clearDatabase();
		});

		it('returns count of pending changes', async () => {
			const manifest: ContentManifest = {
				version: 'v1.0.0',
				categories: [{ id: 1, name: 'Docs', slug: 'docs' }],
				items: [baseItem, { ...baseItem, id: 2 }],
				totalSize: 2048,
			};

			mockFetchForUpdates(manifest);

			const count = await checkForUpdates();

			// 2 new items + 1 app content (no local version)
			expect(count).toBe(3);
		});

		it('returns 0 when local and remote match', async () => {
			const manifest: ContentManifest = {
				version: 'v1.0.0',
				categories: [],
				items: [],
				totalSize: 0,
			};

			// Save local app content so versions match
			const { saveAppContent } = await import('./db');
			await saveAppContent(mockEmptyAppContent);

			mockFetchForUpdates(manifest);

			const count = await checkForUpdates();

			expect(count).toBe(0);
		});

		it('counts updates and deletes in total', async () => {
			const manifest: ContentManifest = {
				version: 'v2.0.0',
				categories: [],
				items: [{ ...baseItem, checksum: 'changed' }],
				totalSize: 1024,
			};

			mockFetchForUpdates(manifest);

			const count = await checkForUpdates();

			expect(count).toBeGreaterThanOrEqual(1);
		});

		it('includes app content version change in count', async () => {
			const manifest: ContentManifest = {
				version: 'v1.0.0',
				categories: [],
				items: [],
				totalSize: 0,
			};

			const updatedAppContent: AppContent = {
				...mockEmptyAppContent,
				version: 'v2.0.0',
			};

			mockFetchForUpdates(manifest, updatedAppContent);

			const count = await checkForUpdates();

			expect(count).toBe(1);
		});

		it('combines item changes and app content changes', async () => {
			const manifest: ContentManifest = {
				version: 'v1.0.0',
				categories: [],
				items: [baseItem],
				totalSize: 1024,
			};

			const updatedAppContent: AppContent = {
				...mockEmptyAppContent,
				version: 'v2.0.0',
			};

			mockFetchForUpdates(manifest, updatedAppContent);

			const count = await checkForUpdates();

			expect(count).toBe(2);
		});
	});

	describe('collectAppContentImageUrls', () => {
		it('extracts hero image URLs', () => {
			const urls = collectAppContentImageUrls(mockAppContent);

			expect(urls).toContain('https://example.com/hero.jpg');
			expect(urls).toContain('https://example.com/hero-thumb.jpg');
		});

		it('extracts page hero and section image URLs', () => {
			const content: AppContent = {
				...mockAppContent,
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
				...mockAppContent,
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
