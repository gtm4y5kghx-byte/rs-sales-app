import { useEffect } from 'react';
import { useStore } from '@/store/store';
import { useShallow } from 'zustand/react/shallow';
import { getContentItems, getCategories } from '@/services/db';

export const useContent = () => {
	const { items, categories, selectedCategoryId, isLoading, getFilteredItems } =
		useStore(
			useShallow((state) => ({
				items: state.items,
				categories: state.categories,
				selectedCategoryId: state.selectedCategoryId,
				isLoading: state.isContentLoading,
				getFilteredItems: state.getFilteredItems,
			})),
		);

	const setItems = useStore((state) => state.setItems);
	const setCategories = useStore((state) => state.setCategories);
	const setSelectedCategoryId = useStore(
		(state) => state.setSelectedCategoryId,
	);
	const setContentLoading = useStore((state) => state.setContentLoading);

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
