import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAppContent } from './useAppContent';
import { useStore } from '@/store/store';
import * as db from '@/services/db';
import type { AppContent } from '@/types';

vi.mock('@/services/db');

const mockAppContent: AppContent = {
	version: '2024-01-15T10:30:00Z',
	homepage: {
		hero: {
			title: 'Main Sales Deck',
			description: 'Your complete resource',
			image: null,
			linkText: 'View Resource',
			linkSlug: 'main-sales-deck',
		},
		faqs: [{ question: 'What is this?', answer: 'A sales app.' }],
		footerTagline: 'Built for your team',
	},
	pages: [
		{
			slug: 'main-sales-deck',
			title: 'Main Sales Deck',
			hero: { title: 'Sales Deck', description: 'Overview', image: null },
			applications: [],
			video: { url: '', title: '', description: '' },
			features: [],
			caseStudies: [],
		},
	],
};

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
