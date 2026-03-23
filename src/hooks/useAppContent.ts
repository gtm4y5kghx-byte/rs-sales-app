import { useEffect } from 'react';
import { useStore } from '@/store/store';
import { useShallow } from 'zustand/react/shallow';
import { getAppContent } from '@/services/db';

export const useAppContent = (slug?: string) => {
	const { appContent, isLoading } = useStore(
		useShallow((state) => ({
			appContent: state.appContent,
			isLoading: state.isAppContentLoading,
		})),
	);

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

	const homepage = appContent?.homepage ?? null;
	const pages = appContent?.pages ?? [];
	const page = slug ? pages.find((p) => p.slug === slug) ?? null : null;
	const hasFaqs = (homepage?.faqs?.length ?? 0) > 0;

	return {
		appContent,
		homepage,
		pages,
		page,
		hasFaqs,
		isLoading,
	};
};
