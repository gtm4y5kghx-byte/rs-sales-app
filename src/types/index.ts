export interface ContentItem {
	id: number;
	title: string;
	categoryId: number;
	type: 'pdf' | 'image' | 'video';
	url: string;
	thumbnail: string;
	fileSize: number;
	checksum: string;
	modified: string;
}

export interface Category {
	id: number;
	name: string;
	slug: string;
}

export interface ContentManifest {
	version: string;
	categories: Category[];
	items: ContentItem[];
	totalSize: number;
}

export interface SyncState {
	lastSynced: string | null;
	manifestVersion: string | null;
	itemCount: number;
}

export type SyncStatus = 'idle' | 'checking' | 'downloading' | 'error';

export interface SyncProgress {
	total: number;
	completed: number;
	currentItem: string | null;
}
