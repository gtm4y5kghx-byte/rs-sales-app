import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchManifest, fetchAppContent } from './api';
import { mockManifest, mockAppContent } from '@/test/fixtures';

describe('api service', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('fetchManifest', () => {
		it('fetches and returns the content manifest', async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockManifest),
			});

			const result = await fetchManifest();
			expect(result).toEqual(mockManifest);
		});

		it('throws error on network failure', async () => {
			global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

			await expect(fetchManifest()).rejects.toThrow('Network error');
		});

		it('throws error on non-ok response', async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 404,
				statusText: 'Not Found',
				json: () => Promise.resolve({}),
			});

			await expect(fetchManifest()).rejects.toThrow('404');
		});
	});

	describe('fetchAppContent', () => {
		it('fetches and returns app content', async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockAppContent),
			});

			const result = await fetchAppContent();
			expect(result).toEqual(mockAppContent);
		});

		it('sends API key header', async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockAppContent),
			});

			await fetchAppContent();

			expect(global.fetch).toHaveBeenCalledWith(
				expect.stringContaining('/app-content'),
				expect.objectContaining({
					headers: expect.objectContaining({
						'X-RS-API-Key': expect.any(String),
					}),
				}),
			);
		});

		it('throws error on non-ok response', async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				json: () => Promise.resolve({}),
			});

			await expect(fetchAppContent()).rejects.toThrow('401');
		});
	});
});
