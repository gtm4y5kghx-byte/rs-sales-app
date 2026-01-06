import { Link, useLocation } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useContent } from '@/hooks/useContent';
import { cn } from '@/lib/utils';

const Sidebar = () => {
	const { categories } = useContent();
	const location = useLocation();

	const isActive = (path: string) => location.pathname === path;

	return (
		<aside className="flex w-64 flex-col border-r bg-sidebar">
			<div className="p-4">
				<h1 className="text-lg font-semibold">RS Sales</h1>
			</div>

			<ScrollArea className="flex-1 px-2">
				<nav className="space-y-1">
					<Button
						variant={isActive('/') ? 'secondary' : 'ghost'}
						className={cn('w-full justify-start')}
						asChild
					>
						<Link to="/">All Assets</Link>
					</Button>

					{categories.map((category) => (
						<Button
							key={category.id}
							variant={
								isActive(`/category/${category.id}`) ? 'secondary' : 'ghost'
							}
							className="w-full justify-start"
							asChild
						>
							<Link to={`/category/${category.id}`}>{category.name}</Link>
						</Button>
					))}
				</nav>
			</ScrollArea>
		</aside>
	);
};

export default Sidebar;
