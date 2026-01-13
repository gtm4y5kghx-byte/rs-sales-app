import type { ContentItem, SyncProgress } from '@/types';
import { fetchManifest } from './api';
import { cacheAsset, deleteAsset } from './cache';
import {
	getContentItems,
	saveContentItems,
	saveCategories,
	setSyncState,
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
	return [...diff.toAdd, ...diff.toUpdate];
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
	const manifest = await fetchManifest();
	const localItems = await getContentItems();

	const diff = compareManifests(localItems, manifest.items);
	const queue = buildDownloadQueue(diff);

	if (queue.length > 0) {
		await processDownloadQueue(queue, onProgress);
	}

	for (const item of diff.toDelete) {
		await deleteAsset(item.url);
	}

	await saveContentItems(manifest.items);
	await saveCategories(manifest.categories);
	await setSyncState({
		lastSynced: new Date().toISOString(),
		manifestVersion: manifest.version,
		itemCount: manifest.items.length,
	});
};

export const checkForUpdates = async (): Promise<number> => {
	const manifest = await fetchManifest();
	const localItems = await getContentItems();
	const diff = compareManifests(localItems, manifest.items);
	return diff.toAdd.length + diff.toUpdate.length + diff.toDelete.length;
};
