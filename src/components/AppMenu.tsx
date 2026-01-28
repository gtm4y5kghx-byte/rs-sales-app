import { useEffect } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSync } from '@/hooks/useSync';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/formatters';
import { Menu, Loader2, RefreshCw, HardDrive } from 'lucide-react';
import { toast } from 'sonner';

const AppMenu = () => {
	const isOnline = useOnlineStatus();
	const { status, isSyncing, progress, lastSynced, sync, checkForUpdates } =
		useSync();

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

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="h-10 w-10">
					<Menu className="h-5 w-5" />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Settings</SheetTitle>
				</SheetHeader>

				<div className="mt-6 space-y-6 px-4">
					{/* Sync Section */}
					<section className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground">Sync</h3>

						<div className="flex items-center gap-2">
							<span
								className={cn(
									'h-2 w-2 rounded-full',
									isOnline ? 'bg-green-500' : 'bg-red-500',
								)}
							/>
							<span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
						</div>

						{lastSynced && (
							<p className="text-sm text-muted-foreground">
								Last synced: {formatRelativeTime(lastSynced)}
							</p>
						)}

						<Button
							onClick={handleSync}
							disabled={isSyncing || !isOnline}
							variant={status === 'error' ? 'destructive' : 'default'}
							className="w-full"
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
					</section>

					<hr />

					{/* Storage Section (Stubbed) */}
					<section className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground">
							Storage
						</h3>

						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span>Used</span>
								<span className="text-muted-foreground">-- MB / -- MB</span>
							</div>
							<div className="h-2 rounded-full bg-muted">
								<div
									className="h-2 rounded-full bg-rs-blue"
									style={{ width: '0%' }}
								/>
							</div>
						</div>

						<Button variant="outline" className="w-full" disabled>
							<HardDrive className="mr-2 h-4 w-4" />
							Clear Cache
						</Button>
					</section>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default AppMenu;
