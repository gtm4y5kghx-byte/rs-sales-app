import { useEffect } from 'react';
import { useStore } from '@/store/store';
import { getContentItems, getCategories } from '@/services/db';

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

	useEffect(() => {
		const loadContent = async () => {
			const [items, categories] = await Promise.all([
				getContentItems(),
				getCategories(),
			]);
			setItems(items);
			setCategories(categories);
			setContentLoading(false);
		};

		loadContent();
	}, [setItems, setCategories, setContentLoading]);

	return {
		items,
		categories,
		filteredItems: getFilteredItems(),
		selectedCategoryId,
		setSelectedCategoryId,
		isLoading,
	};
};
