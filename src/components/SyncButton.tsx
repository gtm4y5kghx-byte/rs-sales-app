import { useSync } from '@/hooks/useSync';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useStorage } from '@/hooks/useStorage';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SyncButtonProps {
	className?: string;
	onSyncComplete?: () => void;
}

const SyncButton = ({ className, onSyncComplete }: SyncButtonProps) => {
	const { status, isSyncing, progress, sync } = useSync();
	const isOnline = useOnlineStatus();
	const { refresh: refreshStorage } = useStorage();

	const handleSync = async () => {
		const success = await sync();
		if (success) {
			toast.success('Content synced successfully');
			refreshStorage();
			onSyncComplete?.();
		} else {
			toast.error('Sync failed. Check your connection.');
		}
	};

	return (
		<Button
			onClick={handleSync}
			disabled={isSyncing || !isOnline}
			variant={status === 'error' ? 'destructive' : 'default'}
			className={cn('w-full', className)}
		>
			{isSyncing ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Syncing {progress?.completed}/{progress?.total}...
				</>
			) : status === 'error' ? (
				<>
					<RefreshCw className="mr-2 h-4 w-4" />
					Retry Sync
				</>
			) : (
				<>
					<RefreshCw className="mr-2 h-4 w-4" />
					Sync Now
				</>
			)}
		</Button>
	);
};

export default SyncButton;
