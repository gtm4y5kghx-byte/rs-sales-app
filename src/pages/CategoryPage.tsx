import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';

const CategoryPage = () => {
	const { id } = useParams<{ id: string }>();
	const { filteredItems, categories, setSelectedCategoryId } = useContent();

	useEffect(() => {
		if (id) {
			setSelectedCategoryId(Number(id));
		}
		return () => setSelectedCategoryId(null);
	}, [id, setSelectedCategoryId]);

	const category = categories.find((c) => c.id === Number(id));

	if (filteredItems.length === 0) {
		return <p className="text-gray-600">No assets in this category.</p>;
	}

	return (
		<div>
			<h1 className="mb-4 text-xl font-semibold">
				{category?.name ?? 'Category'} ({filteredItems.length})
			</h1>
			<p>Content grid will go here</p>
		</div>
	);
};

export default CategoryPage;
