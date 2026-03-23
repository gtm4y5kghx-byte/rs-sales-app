import { Link, Outlet } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
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
					<header className="sticky top-0 z-50 bg-white p-6">
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
								<img
									src={rsLogo}
									alt="RS"
									className="h-12 brightness-0 invert"
								/>
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
						<div className="mt-4 flex items-end justify-between border-t border-white/20 pt-3">
							<div>
								<p className="text-sm">
									© {currentYear} RS Technologies Inc. All rights reserved.
								</p>
								<p className="mt-1 text-xs text-white/50">Build: 2026-03-23c</p>
							</div>
							<button
								onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
								className="flex items-center gap-1 text-sm text-white/60 hover:text-white"
							>
								Back to top
								<ChevronUp className="h-3 w-3" />
							</button>
						</div>
					</div>
				</footer>
			</div>
		</TooltipProvider>
	);
};

export default Layout;
