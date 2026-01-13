import { useStore } from '@/store/store';
import {
	syncContent,
	checkForUpdates as checkForUpdatesService,
} from '@/services/sync';

export const useSync = () => {
	const status = useStore((state) => state.syncStatus);
	const progress = useStore((state) => state.syncProgress);
	const lastSynced = useStore((state) => state.lastSynced);
	const setSyncStatus = useStore((state) => state.setSyncStatus);
	const setSyncProgress = useStore((state) => state.setSyncProgress);
	const setLastSynced = useStore((state) => state.setLastSynced);
	const pendingUpdates = useStore((state) => state.pendingUpdates);
	const setPendingUpdates = useStore((state) => state.setPendingUpdates);

	const sync = async () => {
		setSyncStatus('downloading');

		try {
			await syncContent((progress) => {
				setSyncProgress(progress);
			});
			setLastSynced(new Date().toISOString());
			setSyncStatus('idle');
			setPendingUpdates(0);
			return true;
		} catch {
			setSyncStatus('error');
			return false;
		} finally {
			setSyncProgress(null);
		}
	};

	const checkForUpdates = async () => {
		try {
			const count = await checkForUpdatesService();
			setPendingUpdates(count);
			return count;
		} catch {
			setPendingUpdates(0);
			return 0;
		}
	};

	return {
		status,
		progress,
		lastSynced,
		pendingUpdates,
		sync,
		checkForUpdates,
	};
};
