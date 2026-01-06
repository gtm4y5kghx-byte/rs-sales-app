import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

const Layout = () => {
	return (
		<TooltipProvider>
			<div className="flex h-screen">
				<Sidebar />
				<main className="flex-1 overflow-hidden p-6">
					<Outlet />
				</main>
			</div>
		</TooltipProvider>
	);
};

export default Layout;
