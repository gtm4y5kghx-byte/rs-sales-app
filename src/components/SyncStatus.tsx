import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSync } from '@/hooks/useSync';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const formatRelativeTime = (isoString: string): string => {
	const date = new Date(isoString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);

	if (diffMins < 1) return 'just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	const diffHours = Math.floor(diffMins / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	const diffDays = Math.floor(diffHours / 24);
	return `${diffDays}d ago`;
};

const SyncStatus = () => {
	const isOnline = useOnlineStatus();
	const { status, progress, lastSynced, sync } = useSync();

	const handleSync = async () => {
		const success = await sync();
		if (success) {
			toast.success('Content synced successfully');
		} else {
			toast.error('Sync failed. Check your connection.');
		}
	};

	return (
		<div className="border-t p-4 space-y-3">
			<div className="flex items-center gap-2 text-sm">
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

			{lastSynced && (
				<p className="text-xs text-muted-foreground">
					Last synced: {formatRelativeTime(lastSynced)}
				</p>
			)}

			<Button
				onClick={handleSync}
				disabled={status === 'downloading' || !isOnline}
				variant={status === 'error' ? 'destructive' : 'default'}
				className="w-full"
				size="sm"
			>
				{status === 'downloading' ? (
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
		</div>
	);
};

export default SyncStatus;
