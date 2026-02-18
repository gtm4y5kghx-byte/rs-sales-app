import { Link, Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppMenu from '@/components/AppMenu';
import { useStore } from '@/store/store';
import rsLogo from '@/assets/rs_logo.png';

const Layout = () => {
	const currentYear = new Date().getFullYear();
	const categories = useStore((s) => s.categories);

	return (
		<TooltipProvider>
			<div className="flex min-h-screen flex-col">
				<div className="flex-1">
					<header className="p-6">
						<div className="mx-auto flex max-w-5xl items-center justify-between">
							<Link to="/">
								<img src={rsLogo} alt="RS" className="h-16" />
							</Link>
							<AppMenu />
						</div>
					</header>
					<main className="p-6">
						<Outlet />
					</main>
				</div>
				<footer className="bg-rs-blue px-6 py-6 text-white">
					<div className="mx-auto max-w-5xl">
						<div className="flex items-start gap-12">
							<Link to="/">
								<img src={rsLogo} alt="RS" className="h-12 brightness-0 invert" />
							</Link>
							{categories.length > 0 && (
								<nav className="flex flex-col gap-1">
									{categories.map((cat) => (
										<Link
											key={cat.id}
											to={`/category/${cat.id}`}
											className="text-sm text-white/80 hover:text-white"
										>
											{cat.name}
										</Link>
									))}
								</nav>
							)}
						</div>
						<div className="mt-4 border-t border-white/20 pt-3">
							<p className="text-sm">
								© {currentYear} RS Technologies Inc. All rights reserved.
							</p>
							<p className="mt-1 text-xs text-white/50">Build: 2026-02-18b</p>
						</div>
					</div>
				</footer>
			</div>
		</TooltipProvider>
	);
};

export default Layout;
