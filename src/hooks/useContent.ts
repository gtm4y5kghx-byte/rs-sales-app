import { useEffect } from 'react';
import { useStore } from '@/store/store';
import { getContentItems, getCategories, getAppContent } from '@/services/db';

export const useContent = () => {
	const items = useStore((state) => state.items);
	const categories = useStore((state) => state.categories);
	const selectedCategoryId = useStore((state) => state.selectedCategoryId);
	const isLoading = useStore((state) => state.isContentLoading);
	const setItems = useStore((state) => state.setItems);
	const setCategories = useStore((state) => state.setCategories);
	const setSelectedCategoryId = useStore(
		(state) => state.setSelectedCategoryId,
	);
	const setContentLoading = useStore((state) => state.setContentLoading);
	const getFilteredItems = useStore((state) => state.getFilteredItems);
	const setAppContent = useStore((state) => state.setAppContent);
	const setAppContentLoading = useStore((state) => state.setAppContentLoading);

	useEffect(() => {
		const loadContent = async () => {
			const [items, categories, appContent] = await Promise.all([
				getContentItems(),
				getCategories(),
				getAppContent(),
			]);
			setItems(items);
			setCategories(categories);
			setAppContent(appContent);
			setContentLoading(false);
			setAppContentLoading(false);
		};

		loadContent();
	}, [setItems, setCategories, setContentLoading, setAppContent, setAppContentLoading]);

	return {
		items,
		categories,
		filteredItems: getFilteredItems(),
		selectedCategoryId,
		setSelectedCategoryId,
		isLoading,
	};
};
