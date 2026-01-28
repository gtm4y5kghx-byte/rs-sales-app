import { useState, useEffect, useCallback } from 'react';
import { clearDatabase } from '@/services/db';

interface StorageEstimate {
	usage: number | null;
	quota: number | null;
}

export const useStorage = () => {
	const [estimate, setEstimate] = useState<StorageEstimate>({
		usage: null,
		quota: null,
	});
	const [isClearing, setIsClearing] = useState(false);

	const refresh = useCallback(async () => {
		if (navigator.storage?.estimate) {
			const est = await navigator.storage.estimate();
			setEstimate({
				usage: est.usage ?? null,
				quota: est.quota ?? null,
			});
		}
	}, []);

	const clearCache = useCallback(async () => {
		setIsClearing(true);
		try {
			await clearDatabase();
			await refresh();
		} finally {
			setIsClearing(false);
		}
	}, [refresh]);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return {
		usage: estimate.usage,
		quota: estimate.quota,
		isClearing,
		refresh,
		clearCache,
	};
};
