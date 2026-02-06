import type { AppContent, ContentItem, SyncProgress } from '@/types';
import { fetchManifest, fetchAppContent } from './api';
import { cacheAsset, deleteAsset } from './cache';
import {
	getContentItems,
	getAppContent,
	saveContentItems,
	saveCategories,
	setSyncState,
	saveAppContent,
} from './db';

export interface ManifestDiff {
	toAdd: ContentItem[];
	toUpdate: ContentItem[];
	toDelete: ContentItem[];
}

export const compareManifests = (
	local: ContentItem[],
	remote: ContentItem[],
): ManifestDiff => {
	const localMap = new Map(local.map((item) => [item.id, item]));
	const remoteIds = new Set(remote.map((item) => item.id));

	const toAdd: ContentItem[] = [];
	const toUpdate: ContentItem[] = [];

	for (const remoteItem of remote) {
		const localItem = localMap.get(remoteItem.id);
		if (!localItem) {
			toAdd.push(remoteItem);
		} else if (localItem.checksum !== remoteItem.checksum) {
			toUpdate.push(remoteItem);
		}
	}

	const toDelete = local.filter((item) => !remoteIds.has(item.id));

	return { toAdd, toUpdate, toDelete };
};

export const buildDownloadQueue = (diff: ManifestDiff): ContentItem[] => {
	// Skip videos - they stream only, not cached for offline use
	return [...diff.toAdd, ...diff.toUpdate].filter(
		(item) => item.type !== 'video',
	);
};

export const processDownloadQueue = async (
	queue: ContentItem[],
	onProgress: (progress: SyncProgress) => void,
): Promise<void> => {
	for (let i = 0; i < queue.length; i++) {
		const item = queue[i];
		const response = await fetch(item.url);
		const blob = await response.blob();
		try {
			await cacheAsset(item.url, blob);
		} catch (error) {
			if (
				error instanceof DOMException &&
				error.name === 'QuotaExceededError'
			) {
				throw new Error('Storage full. Clear some space and try again.');
			}
			throw error;
		}

		onProgress({
			completed: i + 1,
			total: queue.length,
			currentItem: item.title,
		});
	}
};

export const syncContent = async (
	onProgress: (progress: SyncProgress) => void,
): Promise<void> => {
	// Fetch manifest and app content in parallel
	const [manifest, appContent] = await Promise.all([
		fetchManifest(),
		fetchAppContent(),
	]);

	const localItems = await getContentItems();

	const diff = compareManifests(localItems, manifest.items);
	const queue = buildDownloadQueue(diff);

	if (queue.length > 0) {
		await processDownloadQueue(queue, onProgress);
	}

	for (const item of diff.toDelete) {
		await deleteAsset(item.url);
	}

	// Cache app content images
	const appContentImageUrls = collectAppContentImageUrls(appContent);
	for (const url of appContentImageUrls) {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			await cacheAsset(url, blob);
		} catch {
			// Non-fatal — app content images are not critical for offline use
		}
	}

	await saveContentItems(manifest.items);
	await saveCategories(manifest.categories);
	await saveAppContent(appContent);
	await setSyncState({
		lastSynced: new Date().toISOString(),
		manifestVersion: manifest.version,
		itemCount: manifest.items.length,
	});
};

export const checkForUpdates = async (): Promise<number> => {
	const [manifest, remoteAppContent] = await Promise.all([
		fetchManifest(),
		fetchAppContent(),
	]);

	const [localItems, localAppContent] = await Promise.all([
		getContentItems(),
		getAppContent(),
	]);

	const diff = compareManifests(localItems, manifest.items);
	const itemChanges = diff.toAdd.length + diff.toUpdate.length + diff.toDelete.length;

	const appContentChanged = localAppContent?.version !== remoteAppContent.version ? 1 : 0;

	return itemChanges + appContentChanged;
};

export const collectAppContentImageUrls = (content: AppContent): string[] => {
	const urls: string[] = [];

	// Homepage hero
	if (content.homepage?.hero?.image) {
		urls.push(content.homepage.hero.image.url);
		urls.push(content.homepage.hero.image.thumbnail);
	}

	// Pages
	for (const page of content.pages ?? []) {
		if (page.hero.image) {
			urls.push(page.hero.image.url);
			urls.push(page.hero.image.thumbnail);
		}

		for (const app of page.applications) {
			if (app.image) {
				urls.push(app.image.url);
				urls.push(app.image.thumbnail);
			}
		}

		for (const feature of page.features) {
			if (feature.image) {
				urls.push(feature.image.url);
				urls.push(feature.image.thumbnail);
			}
		}

		for (const study of page.caseStudies) {
			if (study.thumbnail) {
				urls.push(study.thumbnail);
			}
		}
	}

	// Deduplicate
	return [...new Set(urls)];
};
