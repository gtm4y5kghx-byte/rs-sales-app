import { useEffect } from 'react';
import { useStore } from '@/store/store';
import { getContentItems, getCategories } from '@/services/db';

export const useContent = () => {
	const items = useStore((state) => state.items);
	const categories = useStore((state) => state.categories);
	const selectedCategoryId = useStore((state) => state.selectedCategoryId);
	const setItems = useStore((state) => state.setItems);
	const setCategories = useStore((state) => state.setCategories);
	const setSelectedCategoryId = useStore(
		(state) => state.setSelectedCategoryId,
	);
	const getFilteredItems = useStore((state) => state.getFilteredItems);

	useEffect(() => {
		const loadContent = async () => {
			const [items, categories] = await Promise.all([
				getContentItems(),
				getCategories(),
			]);
			setItems(items);
			setCategories(categories);
		};

		loadContent();
	}, [setItems, setCategories]);

	return {
		items,
		categories,
		filteredItems: getFilteredItems(),
		selectedCategoryId,
		setSelectedCategoryId,
	};
};
