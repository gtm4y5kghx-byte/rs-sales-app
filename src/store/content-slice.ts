import type { StateCreator } from 'zustand';
import type { ContentItem, Category } from '@/types';
import type { StoreState } from './store';

export interface ContentSlice {
	items: ContentItem[];
	categories: Category[];
	selectedCategoryId: number | null;
	isContentLoading: boolean;
	setItems: (items: ContentItem[]) => void;
	setCategories: (categories: Category[]) => void;
	setSelectedCategoryId: (id: number | null) => void;
	setContentLoading: (loading: boolean) => void;
	getFilteredItems: () => ContentItem[];
}

export const createContentSlice: StateCreator<
	StoreState,
	[],
	[],
	ContentSlice
> = (set, get) => ({
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
});
