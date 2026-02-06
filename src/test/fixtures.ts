import type { Category, ContentItem, ContentManifest, AppContent } from '@/types';

export const mockCategory: Category = {
	id: 1,
	name: 'Docs',
	slug: 'docs',
};

export const mockContentItem: ContentItem = {
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

export const mockContentItem2: ContentItem = {
	id: 2,
	title: 'Installation Guide',
	categoryId: 2,
	type: 'pdf',
	url: 'https://example.com/guide.pdf',
	thumbnail: 'https://example.com/guide-thumb.jpg',
	fileSize: 2048,
	checksum: 'def456',
	modified: '2024-01-02T00:00:00Z',
};

export const mockContentItems: ContentItem[] = [mockContentItem, mockContentItem2];

export const mockCategory2: Category = {
	id: 2,
	name: 'Guides',
	slug: 'guides',
};

export const mockCategories: Category[] = [mockCategory, mockCategory2];

export const mockManifest: ContentManifest = {
	version: 'v1.0.0',
	categories: [{ id: 1, name: 'Docs', slug: 'docs' }],
	items: [mockContentItem],
	totalSize: 1024,
};

export const mockAppContent: AppContent = {
	version: 'v1.0.0',
	homepage: {
		hero: {
			title: 'Main Sales Deck',
			description: 'Description text',
			image: {
				url: 'https://example.com/hero.jpg',
				thumbnail: 'https://example.com/hero-thumb.jpg',
				alt: 'Hero',
			},
			linkText: 'View Resource',
			linkSlug: 'main-sales-deck',
		},
		faqs: [
			{ question: 'What is this?', answer: 'A test FAQ.' },
		],
		footerTagline: 'Footer tagline',
	},
	pages: [],
};

export const mockEmptyAppContent: AppContent = {
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
