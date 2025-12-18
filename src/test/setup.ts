import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
import { vi } from 'vitest';

const createMockCache = () => {
	const store = new Map<string, Response>();
	return {
		put: vi.fn(async (url: string, response: Response) => {
			store.set(url, response.clone());
		}),
		match: vi.fn(async (request: string | Request) => {
			const url = typeof request === 'string' ? request : request.url;
			const response = store.get(url);
			return response ? response.clone() : undefined;
		}),
		delete: vi.fn(async (url: string) => {
			return store.delete(url);
		}),
		keys: vi.fn(async () => {
			return Array.from(store.keys()).map((url) => new Request(url));
		}),
	};
};

const cacheStore = new Map<string, ReturnType<typeof createMockCache>>();

vi.stubGlobal('caches', {
	open: vi.fn(async (name: string) => {
		if (!cacheStore.has(name)) {
			cacheStore.set(name, createMockCache());
		}
		return cacheStore.get(name)!;
	}),
	delete: vi.fn(async (name: string) => {
		return cacheStore.delete(name);
	}),
});
