import type { ContentManifest, AppContent } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Derive base URL by stripping the endpoint path
const API_BASE = API_URL.replace(/\/content-manifest$/, '');

const fetchWithAuth = async (url: string): Promise<Response> => {
	const bustCache = `${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}`;
	const response = await fetch(bustCache, {
		headers: {
			'X-RS-API-Key': API_KEY,
		},
	});

	if (!response.ok) {
		throw new Error(`${response.status}: ${response.statusText}`);
	}

	return response;
};

export const fetchManifest = async (): Promise<ContentManifest> => {
	const response = await fetchWithAuth(API_URL);
	return response.json();
};

export const fetchAppContent = async (): Promise<AppContent> => {
	const response = await fetchWithAuth(`${API_BASE}/app-content`);
	return response.json();
};
