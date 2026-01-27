import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { hasRecentlyUpdatedItems } from './content-utils';
import type { ContentItem } from '@/types';

const createItem = (
	overrides: Partial<ContentItem> = {},
): ContentItem => ({
	id: 1,
	title: 'Test Item',
	categoryId: 1,
	type: 'pdf',
	url: 'https://example.com/test.pdf',
	thumbnail: 'https://example.com/thumb.jpg',
	fileSize: 1000,
	checksum: 'abc123',
	modified: new Date().toISOString(),
	...overrides,
});

describe('hasRecentlyUpdatedItems', () => {
	beforeEach(() => {
		// Fix the date to a known value for consistent testing
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns true when category has item modified today', () => {
		const items = [
			createItem({ id: 1, categoryId: 1, modified: '2024-06-15T10:00:00Z' }),
		];

		expect(hasRecentlyUpdatedItems(items, 1)).toBe(true);
	});

	it('returns true when category has item modified 6 days ago', () => {
		const items = [
			createItem({ id: 1, categoryId: 1, modified: '2024-06-09T12:00:00Z' }),
		];

		expect(hasRecentlyUpdatedItems(items, 1)).toBe(true);
	});

	it('returns false when category has item modified exactly 7 days ago', () => {
		// 7 days ago at exactly the same time - should be false (not > cutoff)
		const items = [
			createItem({ id: 1, categoryId: 1, modified: '2024-06-08T12:00:00Z' }),
		];

		expect(hasRecentlyUpdatedItems(items, 1)).toBe(false);
	});

	it('returns false when category has item modified 8 days ago', () => {
		const items = [
			createItem({ id: 1, categoryId: 1, modified: '2024-06-07T10:00:00Z' }),
		];

		expect(hasRecentlyUpdatedItems(items, 1)).toBe(false);
	});

	it('returns false for different category', () => {
		const items = [
			createItem({ id: 1, categoryId: 2, modified: '2024-06-15T10:00:00Z' }),
		];

		expect(hasRecentlyUpdatedItems(items, 1)).toBe(false);
	});

	it('returns true when at least one item in category is recent', () => {
		const items = [
			createItem({ id: 1, categoryId: 1, modified: '2024-01-01T10:00:00Z' }), // Old
			createItem({ id: 2, categoryId: 1, modified: '2024-06-14T10:00:00Z' }), // Recent
		];

		expect(hasRecentlyUpdatedItems(items, 1)).toBe(true);
	});

	it('returns false for empty items array', () => {
		expect(hasRecentlyUpdatedItems([], 1)).toBe(false);
	});

	it('respects custom days parameter', () => {
		const items = [
			createItem({ id: 1, categoryId: 1, modified: '2024-06-12T10:00:00Z' }), // 3 days ago
		];

		// Within 5 days - should be true
		expect(hasRecentlyUpdatedItems(items, 1, 5)).toBe(true);

		// Within 2 days - should be false
		expect(hasRecentlyUpdatedItems(items, 1, 2)).toBe(false);
	});

	it('handles ISO date strings correctly', () => {
		const items = [
			createItem({ id: 1, categoryId: 1, modified: '2024-06-14' }), // Date only format
		];

		expect(hasRecentlyUpdatedItems(items, 1)).toBe(true);
	});

	it('handles timezone differences', () => {
		const items = [
			// Same moment in different timezone formats
			createItem({ id: 1, categoryId: 1, modified: '2024-06-15T00:00:00+10:00' }),
		];

		expect(hasRecentlyUpdatedItems(items, 1)).toBe(true);
	});
});
