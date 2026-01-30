import { useEffect } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSync } from '@/hooks/useSync';
import { useStorage } from '@/hooks/useStorage';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import SyncButton from '@/components/SyncButton';
import { cn } from '@/lib/utils';
import { formatRelativeTime, formatFileSize } from '@/lib/formatters';
import { Menu, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AppMenu = () => {
	const isOnline = useOnlineStatus();
	const { lastSynced, pendingUpdates, checkForUpdates } = useSync();
	const { usage, quota, isClearing, clearCache } = useStorage();

	useEffect(() => {
		if (isOnline) {
			checkForUpdates();
		}
	}, [isOnline, checkForUpdates]);

	const handleClearCache = async () => {
		await clearCache();
		toast.success('Cache cleared');
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

						{pendingUpdates > 0 && (
							<p className="text-sm font-medium text-blue-600">
								{pendingUpdates} update{pendingUpdates !== 1 ? 's' : ''} available
							</p>
						)}

						<SyncButton />
					</section>

					<hr />

					{/* Storage Section */}
					<section className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground">
							Storage
						</h3>

						<div className="flex items-center justify-between text-sm">
							<span>Used</span>
							<span className="text-muted-foreground">
								{usage !== null ? formatFileSize(usage) : '--'}
								{quota !== null && ` of ~${formatFileSize(quota)}`}
							</span>
						</div>

						<Button
							variant="outline"
							className="w-full"
							onClick={handleClearCache}
							disabled={isClearing || usage === 0}
						>
							{isClearing ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Clearing...
								</>
							) : (
								<>
									<Trash2 className="mr-2 h-4 w-4" />
									Clear Cache
								</>
							)}
						</Button>
					</section>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default AppMenu;
