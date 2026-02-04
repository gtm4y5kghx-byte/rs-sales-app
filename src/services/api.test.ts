import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ContentManifest, AppContent } from '@/types';
import { fetchManifest, fetchAppContent } from './api';

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

	describe('fetchAppContent', () => {
		const mockAppContent: AppContent = {
			version: '2024-01-15T10:30:00Z',
			homepage: {
				hero: {
					title: 'Main Sales Deck',
					description: 'Your complete resource',
					image: {
						url: 'https://example.com/hero.jpg',
						thumbnail: 'https://example.com/hero-thumb.jpg',
						alt: 'Hero image',
					},
					linkText: 'View Resource',
					linkSlug: 'main-sales-deck',
				},
				faqs: [
					{ question: 'What is this?', answer: 'A sales app.' },
				],
				footerTagline: 'Built for your team',
			},
			pages: [
				{
					slug: 'main-sales-deck',
					title: 'Main Sales Deck',
					hero: {
						title: 'Sales Deck',
						description: 'Complete overview',
						image: null,
					},
					applications: [],
					video: { url: '', title: '', description: '' },
					features: [],
					caseStudies: [],
				},
			],
		};

		it('fetches and returns app content', async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockAppContent),
			});

			const result = await fetchAppContent();
			expect(result).toEqual(mockAppContent);
		});

		it('sends API key header', async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockAppContent),
			});

			await fetchAppContent();

			expect(global.fetch).toHaveBeenCalledWith(
				expect.stringContaining('/app-content'),
				expect.objectContaining({
					headers: expect.objectContaining({
						'X-RS-API-Key': expect.any(String),
					}),
				}),
			);
		});

		it('throws error on non-ok response', async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				json: () => Promise.resolve({}),
			});

			await expect(fetchAppContent()).rejects.toThrow('401');
		});
	});
});
