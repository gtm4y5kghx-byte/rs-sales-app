import type { StateCreator } from 'zustand';
import type { AppContent } from '@/types';
import type { StoreState } from './store';

export interface AppContentSlice {
	appContent: AppContent | null;
	isAppContentLoading: boolean;
	setAppContent: (content: AppContent | null) => void;
	setAppContentLoading: (loading: boolean) => void;
}

export const createAppContentSlice: StateCreator<
	StoreState,
	[],
	[],
	AppContentSlice
> = (set) => ({
	appContent: null,
	isAppContentLoading: true,
	setAppContent: (content) => set({ appContent: content }),
	setAppContentLoading: (loading) => set({ isAppContentLoading: loading }),
});
