import { useParams } from 'react-router-dom';

const CategoryPage = () => {
	const { id } = useParams<{ id: string }>();
	return <div>Category Page - ID: {id}</div>;
};

export default CategoryPage;
