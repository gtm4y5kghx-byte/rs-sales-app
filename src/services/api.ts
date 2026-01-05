import type { ContentManifest } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const fetchManifest = async (): Promise<ContentManifest> => {
	const response = await fetch(API_URL, {
		headers: {
			'X-RS-API-Key': API_KEY,
		},
	});

	if (!response.ok) {
		throw new Error(`${response.status}: ${response.statusText}`);
	}

	return response.json();
};
