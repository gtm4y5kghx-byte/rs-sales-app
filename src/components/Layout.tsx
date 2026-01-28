import { Link, Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import SyncStatus from '@/components/SyncStatus';
import rsLogo from '@/assets/rs_logo.png';

const Layout = () => {
	return (
		<TooltipProvider>
			<div className="min-h-screen p-6">
				<header className="mb-8 flex items-center justify-between">
					<Link to="/">
						<img src={rsLogo} alt="RS" className="h-16" />
					</Link>
					<SyncStatus />
				</header>
				<main>
					<Outlet />
				</main>
			</div>
		</TooltipProvider>
	);
};

export default Layout;
