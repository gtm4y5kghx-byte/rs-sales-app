import { describe, it, expect, beforeEach } from 'vitest';
import {
	cacheAsset,
	getCachedAsset,
	clearCache,
	deleteAsset,
	getCacheSize,
} from './cache';

const mockPdfBlob = new Blob(['fake pdf content'], { type: 'application/pdf' });
const mockImageBlob = new Blob(['fake image content'], { type: 'image/jpeg' });
const testUrl = 'https://example.com/doc.pdf';

describe('cache service', () => {
	beforeEach(async () => {
		await clearCache();
	});

	describe('cacheAsset / getCachedAsset', () => {
		it('caches and retrieves an asset', async () => {
			await cacheAsset(testUrl, mockPdfBlob);
			const result = await getCachedAsset(testUrl);
			expect(result).not.toBeNull();
		});

		it('returns null for non-existent asset', async () => {
			const result = await getCachedAsset('https://example.com/missing.pdf');
			expect(result).toBeNull();
		});
	});

	describe('deleteAsset', () => {
		it('removes a cached asset', async () => {
			await cacheAsset(testUrl, mockPdfBlob);
			await deleteAsset(testUrl);
			const result = await getCachedAsset(testUrl);
			expect(result).toBeNull();
		});
	});

	describe('getCacheSize', () => {
		it('returns total size of cached assets', async () => {
			await cacheAsset(testUrl, mockPdfBlob);
			await cacheAsset('https://example.com/image.jpg', mockImageBlob);
			const size = await getCacheSize();
			expect(size).toBeGreaterThan(0);
		});
	});
});
