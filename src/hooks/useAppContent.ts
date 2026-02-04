import { useEffect } from 'react';
import { useStore } from '@/store/store';
import { getAppContent } from '@/services/db';

export const useAppContent = () => {
	const appContent = useStore((state) => state.appContent);
	const isLoading = useStore((state) => state.isAppContentLoading);
	const setAppContent = useStore((state) => state.setAppContent);
	const setAppContentLoading = useStore((state) => state.setAppContentLoading);

	useEffect(() => {
		const loadAppContent = async () => {
			const content = await getAppContent();
			setAppContent(content);
			setAppContentLoading(false);
		};

		loadAppContent();
	}, [setAppContent, setAppContentLoading]);

	return {
		appContent,
		homepage: appContent?.homepage ?? null,
		pages: appContent?.pages ?? [],
		isLoading,
	};
};
