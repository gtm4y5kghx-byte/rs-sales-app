import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAppUpdate } from '@/hooks/useAppUpdate';
import ScrollToTop from '@/components/ScrollToTop';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import CategoryPage from '@/pages/CategoryPage';
import AssetPage from '@/pages/AssetPage';
import SalesPage from '@/pages/SalesPage';

const App = () => {
	useAppUpdate();

	return (
		<>
			<BrowserRouter>
				<ScrollToTop />
				<Routes>
					<Route element={<Layout />}>
						<Route path="/" element={<HomePage />} />
						<Route path="/resource/:slug" element={<SalesPage />} />
						<Route path="/category/:id" element={<CategoryPage />} />
						<Route path="/asset/:id" element={<AssetPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
			<Toaster
				position="top-center"
				toastOptions={{
					style: { width: 'auto' },
				}}
			/>
		</>
	);
};

export default App;
