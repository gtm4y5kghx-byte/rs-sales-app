const CACHE_NAME = 'rs-sales-assets';

/**
 * Cache service for storing binary assets (PDFs, images) using the browser Cache API.
 *
 * Uses URL as the cache key, which aligns with how service workers
 * intercept and serve cached responses for offline access.
 *
 * @example
 * // Store an asset
 * await cacheAsset('https://example.com/doc.pdf', pdfBlob);
 *
 * // Retrieve an asset
 * const blob = await getCachedAsset('https://example.com/doc.pdf');
 */

export const cacheAsset = async (url: string, blob: Blob): Promise<void> => {
	const cache = await caches.open(CACHE_NAME);
	const response = new Response(blob, {
		headers: {
			'Content-Type': blob.type || 'application/octet-stream',
			'Content-Length': blob.size.toString(),
		},
	});
	await cache.put(url, response);
};

export const getCachedAsset = async (url: string): Promise<Blob | null> => {
	const cache = await caches.open(CACHE_NAME);
	const response = await cache.match(url);
	if (!response) return null;
	return response.blob();
};

export const clearCache = async (): Promise<void> => {
	await caches.delete(CACHE_NAME);
};

export const deleteAsset = async (url: string): Promise<boolean> => {
	const cache = await caches.open(CACHE_NAME);
	return cache.delete(url);
};

export const getCacheSize = async (): Promise<number> => {
	const cache = await caches.open(CACHE_NAME);
	const keys = await cache.keys();
	let totalSize = 0;

	for (const request of keys) {
		const response = await cache.match(request);
		if (response) {
			const blob = await response.blob();
			totalSize += blob.size;
		}
	}

	return totalSize;
};
