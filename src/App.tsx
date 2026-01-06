import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import BrowsePage from '@/pages/BrowsePage';
import CategoryPage from '@/pages/CategoryPage';
import AssetPage from '@/pages/AssetPage';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<BrowsePage />} />
					<Route path="/category/:id" element={<CategoryPage />} />
					<Route path="/asset/:id" element={<AssetPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
