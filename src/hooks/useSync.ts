import { useStore } from '@/store/store';
import { syncContent } from '@/services/sync';

export const useSync = () => {
	const status = useStore((state) => state.syncStatus);
	const progress = useStore((state) => state.syncProgress);
	const lastSynced = useStore((state) => state.lastSynced);
	const setSyncStatus = useStore((state) => state.setSyncStatus);
	const setSyncProgress = useStore((state) => state.setSyncProgress);
	const setLastSynced = useStore((state) => state.setLastSynced);

	const sync = async () => {
		setSyncStatus('downloading');

		try {
			await syncContent((progress) => {
				setSyncProgress(progress);
			});
			setLastSynced(new Date().toISOString());
			setSyncStatus('idle');
			return true;
		} catch {
			setSyncStatus('error');
			return false;
		} finally {
			setSyncProgress(null);
		}
	};

	return {
		status,
		progress,
		lastSynced,
		sync,
	};
};
