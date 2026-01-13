import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSync } from './useSync';
import { useStore } from '@/store/store';
import * as syncService from '@/services/sync';

vi.mock('@/services/sync');

describe('useSync', () => {
	beforeEach(() => {
		useStore.setState({
			items: [],
			categories: [],
			selectedCategoryId: null,
			syncStatus: 'idle',
			syncProgress: null,
			lastSynced: null,
		});
		vi.clearAllMocks();
	});

	it('returns current sync status from store', () => {
		useStore.setState({ syncStatus: 'downloading' });

		const { result } = renderHook(() => useSync());

		expect(result.current.status).toBe('downloading');
	});

	it('calls syncContent and updates store on sync()', async () => {
		vi.mocked(syncService.syncContent).mockResolvedValue(undefined);

		const { result } = renderHook(() => useSync());

		await act(async () => {
			await result.current.sync();
		});

		expect(syncService.syncContent).toHaveBeenCalled();
	});

	it('checkForUpdates fetches count and updates store', async () => {
		vi.mocked(syncService.checkForUpdates).mockResolvedValue(5);

		const { result } = renderHook(() => useSync());

		await act(async () => {
			await result.current.checkForUpdates();
		});

		expect(syncService.checkForUpdates).toHaveBeenCalled();
		expect(useStore.getState().pendingUpdates).toBe(5);
	});

	it('checkForUpdates sets pendingUpdates to 0 on error', async () => {
		vi.mocked(syncService.checkForUpdates).mockRejectedValue(
			new Error('Network error'),
		);

		const { result } = renderHook(() => useSync());

		await act(async () => {
			await result.current.checkForUpdates();
		});

		expect(useStore.getState().pendingUpdates).toBe(0);
	});
});
