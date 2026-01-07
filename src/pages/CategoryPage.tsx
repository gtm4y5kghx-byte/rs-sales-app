import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import ContentSection from '@/components/ContentSection';

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
		return <p className="text-muted-foreground">No assets in this category.</p>;
	}

	return (
		<ContentSection
			title={category?.name ?? 'Category'}
			items={filteredItems}
		/>
	);
};

export default CategoryPage;
