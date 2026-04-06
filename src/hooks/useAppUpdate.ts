import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export const useAppUpdate = () => {
	const {
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegisteredSW(_swUrl, registration) {
			if (!registration) return;

			// Re-check for updates when app returns to foreground
			document.addEventListener('visibilitychange', () => {
				if (document.visibilityState === 'visible') {
					registration.update();
				}
			});
		},
	});

	useEffect(() => {
		if (needRefresh) {
			toast('App update available', {
				id: 'app-update',
				duration: Infinity,
				action: {
					label: 'Reload',
					onClick: () => updateServiceWorker(true),
				},
			});
		}
	}, [needRefresh, updateServiceWorker]);
};
