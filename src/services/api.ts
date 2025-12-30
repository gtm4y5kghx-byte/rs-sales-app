import type { ContentManifest } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchManifest = async (): Promise<ContentManifest> => {
	const response = await fetch(API_URL);

	if (!response.ok) {
		throw new Error(`${response.status}: ${response.statusText}`);
	}

	return response.json();
};
