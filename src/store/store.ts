import { create } from 'zustand';
import type { ContentItem, Category, SyncStatus, SyncProgress } from '@/types';

interface StoreState {
	items: ContentItem[];
	categories: Category[];
	selectedCategoryId: number | null;
	isContentLoading: boolean;
	setItems: (items: ContentItem[]) => void;
	setCategories: (categories: Category[]) => void;
	setSelectedCategoryId: (id: number | null) => void;
	setContentLoading: (loading: boolean) => void;
	getFilteredItems: () => ContentItem[];

	syncStatus: SyncStatus;
	syncProgress: SyncProgress | null;
	lastSynced: string | null;
	pendingUpdates: number;
	setSyncStatus: (status: SyncStatus) => void;
	setSyncProgress: (progress: SyncProgress | null) => void;
	setLastSynced: (timestamp: string | null) => void;
	setPendingUpdates: (count: number) => void;
}

export const useStore = create<StoreState>((set, get) => ({
	items: [],
	categories: [],
	selectedCategoryId: null,
	isContentLoading: true,
	setItems: (items) => set({ items }),
	setCategories: (categories) => set({ categories }),
	setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
	setContentLoading: (loading) => set({ isContentLoading: loading }),
	getFilteredItems: () => {
		const { items, selectedCategoryId } = get();
		if (selectedCategoryId === null) return items;
		return items.filter((item) => item.categoryId === selectedCategoryId);
	},

	syncStatus: 'idle',
	syncProgress: null,
	lastSynced: null,
	pendingUpdates: 0,
	setSyncStatus: (status) => set({ syncStatus: status }),
	setSyncProgress: (progress) => set({ syncProgress: progress }),
	setLastSynced: (timestamp) => set({ lastSynced: timestamp }),
	setPendingUpdates: (count) => set({ pendingUpdates: count }),
}));
