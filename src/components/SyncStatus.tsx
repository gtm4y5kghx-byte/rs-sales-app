import { useEffect } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSync } from '@/hooks/useSync';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const SyncStatus = () => {
	const isOnline = useOnlineStatus();
	const { status, progress, sync, checkForUpdates } = useSync();

	useEffect(() => {
		if (isOnline) {
			checkForUpdates();
		}
	}, [isOnline, checkForUpdates]);

	const handleSync = async () => {
		const success = await sync();
		if (success) {
			toast.success('Content synced successfully');
		} else {
			toast.error('Sync failed. Check your connection.');
		}
	};

	const isSyncing = status === 'downloading';

	return (
		<div className="flex items-center gap-3">
			{/* Online/Offline indicator */}
			<div className="flex items-center gap-1.5 text-sm">
				<span
					className={cn(
						'h-2 w-2 rounded-full',
						isOnline ? 'bg-green-500' : 'bg-red-500',
					)}
				/>
				<span className="text-muted-foreground">
					{isOnline ? 'Online' : 'Offline'}
				</span>
			</div>

			{/* Sync button (icon only) */}
			<Button
				onClick={handleSync}
				disabled={isSyncing || !isOnline}
				variant={status === 'error' ? 'destructive' : 'ghost'}
				size="icon"
				className="h-8 w-8"
				title={isSyncing ? `Syncing ${progress?.completed}/${progress?.total}` : 'Sync now'}
			>
				{isSyncing ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<RefreshCw className="h-4 w-4" />
				)}
			</Button>
		</div>
	);
};

export default SyncStatus;
