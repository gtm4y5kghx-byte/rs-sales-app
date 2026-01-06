import { Outlet } from 'react-router-dom';

const Layout = () => {
	return (
		<div className="flex h-screen">
			{/* Sidebar */}
			<aside className="w-64 border-r bg-gray-50 p-4">
				<h2 className="mb-4 font-semibold">Categories</h2>
				{/* Category list will go here */}
			</aside>

			{/* Main content */}
			<main className="flex-1 overflow-auto p-6">
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
