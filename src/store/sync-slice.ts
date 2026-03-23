import type { StateCreator } from 'zustand';
import type { SyncStatus, SyncProgress } from '@/types';
import type { StoreState } from './store';

export interface SyncSlice {
	syncStatus: SyncStatus;
	syncProgress: SyncProgress | null;
	lastSynced: string | null;
	pendingUpdates: number;
	setSyncStatus: (status: SyncStatus) => void;
	setSyncProgress: (progress: SyncProgress | null) => void;
	setLastSynced: (timestamp: string | null) => void;
	setPendingUpdates: (count: number) => void;
}

export const createSyncSlice: StateCreator<
	StoreState,
	[],
	[],
	SyncSlice
> = (set) => ({
	syncStatus: 'idle',
	syncProgress: null,
	lastSynced: null,
	pendingUpdates: 0,
	setSyncStatus: (status) => set({ syncStatus: status }),
	setSyncProgress: (progress) => set({ syncProgress: progress }),
	setLastSynced: (timestamp) => set({ lastSynced: timestamp }),
	setPendingUpdates: (count) => set({ pendingUpdates: count }),
});
