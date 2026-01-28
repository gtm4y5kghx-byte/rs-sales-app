import { Link, Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import SyncStatus from '@/components/SyncStatus';
import rsLogo from '@/assets/rs_logo.png';

const Layout = () => {
	const currentYear = new Date().getFullYear();

	return (
		<TooltipProvider>
			<div className="flex min-h-screen flex-col">
				<div className="flex-1 p-6">
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
				<footer className="bg-rs-blue px-6 py-4 text-white">
					<p className="text-sm">
						© {currentYear} RS Technologies Inc. All rights reserved.
					</p>
				</footer>
			</div>
		</TooltipProvider>
	);
};

export default Layout;
