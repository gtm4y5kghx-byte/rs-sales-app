import { openDB } from 'idb';
import type { AppContent, Category, ContentItem, SyncState } from '@/types';

const DB_NAME = 'rs-sales-app';
const DB_VERSION = 2;

const getDB = async () => {
	return openDB(DB_NAME, DB_VERSION, {
		upgrade(db, oldVersion) {
			// v1: contentItems, categories, syncState
			if (oldVersion < 1) {
				db.createObjectStore('contentItems', { keyPath: 'id' });
				db.createObjectStore('categories', { keyPath: 'id' });
				db.createObjectStore('syncState');
			}
			// v2: appContent
			if (oldVersion < 2) {
				db.createObjectStore('appContent');
			}
		},
	});
};

export const saveContentItems = async (items: ContentItem[]): Promise<void> => {
	const db = await getDB();
	const tx = db.transaction('contentItems', 'readwrite');
	await tx.store.clear();
	await Promise.all(items.map((item) => tx.store.put(item)));
	await tx.done;
};

export const getContentItems = async (): Promise<ContentItem[]> => {
	const db = await getDB();
	return db.getAll('contentItems');
};

export const clearDatabase = async (): Promise<void> => {
	const db = await getDB();
	await db.clear('contentItems');
	await db.clear('categories');
	await db.clear('syncState');
	await db.clear('appContent');
};

export const getContentItemsByCategory = async (
	categoryId: number,
): Promise<ContentItem[]> => {
	const db = await getDB();
	const allItems = await db.getAll('contentItems');
	return allItems.filter((item) => item.categoryId === categoryId);
};

export const saveCategories = async (categories: Category[]): Promise<void> => {
	const db = await getDB();
	const tx = db.transaction('categories', 'readwrite');
	await tx.store.clear();
	await Promise.all(categories.map((cat) => tx.store.put(cat)));
	await tx.done;
};

export const getCategories = async (): Promise<Category[]> => {
	const db = await getDB();
	return db.getAll('categories');
};

const DEFAULT_SYNC_STATE: SyncState = {
	lastSynced: null,
	manifestVersion: null,
	itemCount: 0,
};

export const getSyncState = async (): Promise<SyncState> => {
	const db = await getDB();
	const state = await db.get('syncState', 'current');
	return state ?? DEFAULT_SYNC_STATE;
};

export const setSyncState = async (state: SyncState): Promise<void> => {
	const db = await getDB();
	await db.put('syncState', state, 'current');
};

export const getAppContent = async (): Promise<AppContent | null> => {
	const db = await getDB();
	const content = await db.get('appContent', 'current');
	return content ?? null;
};

export const saveAppContent = async (content: AppContent): Promise<void> => {
	const db = await getDB();
	await db.put('appContent', content, 'current');
};
