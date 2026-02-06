import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAppContent } from './useAppContent';
import { useStore } from '@/store/store';
import * as db from '@/services/db';
import { mockAppContent } from '@/test/fixtures';

vi.mock('@/services/db');

describe('useAppContent', () => {
	beforeEach(() => {
		useStore.setState({
			items: [],
			categories: [],
			selectedCategoryId: null,
			isContentLoading: true,
			syncStatus: 'idle',
			syncProgress: null,
			lastSynced: null,
			appContent: null,
			isAppContentLoading: true,
		});
		vi.clearAllMocks();
	});

	it('loads app content from IndexedDB on mount', async () => {
		vi.mocked(db.getAppContent).mockResolvedValue(mockAppContent);

		renderHook(() => useAppContent());

		await waitFor(() => {
			expect(useStore.getState().appContent).toEqual(mockAppContent);
		});
	});

	it('sets isAppContentLoading to false after content loads', async () => {
		vi.mocked(db.getAppContent).mockResolvedValue(mockAppContent);

		expect(useStore.getState().isAppContentLoading).toBe(true);

		renderHook(() => useAppContent());

		await waitFor(() => {
			expect(useStore.getState().isAppContentLoading).toBe(false);
		});
	});

	it('returns homepage and pages from app content', async () => {
		vi.mocked(db.getAppContent).mockResolvedValue(mockAppContent);

		const { result } = renderHook(() => useAppContent());

		await waitFor(() => {
			expect(result.current.homepage).toEqual(mockAppContent.homepage);
			expect(result.current.pages).toEqual(mockAppContent.pages);
		});
	});

	it('returns null for homepage and empty pages when no app content', async () => {
		vi.mocked(db.getAppContent).mockResolvedValue(null);

		const { result } = renderHook(() => useAppContent());

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.homepage).toBeNull();
		expect(result.current.pages).toEqual([]);
	});
});
