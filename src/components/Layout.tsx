import { Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';

const Layout = () => {
	return (
		<TooltipProvider>
			<main className="min-h-screen p-6">
				<Outlet />
			</main>
		</TooltipProvider>
	);
};

export default Layout;
