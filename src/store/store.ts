import { create } from 'zustand';
import { createContentSlice, type ContentSlice } from './content-slice';
import { createSyncSlice, type SyncSlice } from './sync-slice';
import {
	createAppContentSlice,
	type AppContentSlice,
} from './app-content-slice';

export type StoreState = ContentSlice & SyncSlice & AppContentSlice;

export const useStore = create<StoreState>((...a) => ({
	...createContentSlice(...a),
	...createSyncSlice(...a),
	...createAppContentSlice(...a),
}));
