import { useParams } from 'react-router-dom';

const AssetPage = () => {
	const { id } = useParams<{ id: string }>();
	return <div>Asset Page - ID: {id}</div>;
};

export default AssetPage;
