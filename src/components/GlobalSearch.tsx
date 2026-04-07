import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
} from '@/components/ui/command';
import { useSearch } from '@/hooks/useSearch';
import { useStore } from '@/store/store';

const typeIcons = {
	pdf: FileText,
	image: Image,
	video: Video,
} as const;

const typeLabels = {
	pdf: 'PDF',
	image: 'Image',
	video: 'Video',
} as const;

const GlobalSearch = () => {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const items = useStore((s) => s.items);
	const { query, setQuery, results } = useSearch(items);

	const handleSelect = (id: number) => {
		setOpen(false);
		setQuery('');
		navigate(`/asset/${id}`);
	};

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			setQuery('');
		}
	};

	const grouped = {
		pdf: results.filter((item) => item.type === 'pdf'),
		image: results.filter((item) => item.type === 'image'),
		video: results.filter((item) => item.type === 'video'),
	};

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setOpen(true)}
				aria-label="Search"
			>
				<Search className="h-5 w-5" />
			</Button>

			<CommandDialog
				open={open}
				onOpenChange={handleOpenChange}
				title="Search"
				description="Search for assets by name"
				shouldFilter={false}
			>
				<div className="relative">
					<CommandInput
						placeholder="Search assets..."
						value={query}
						onValueChange={setQuery}
					/>
					{query && (
						<button
							onClick={() => setQuery('')}
							className="absolute top-1/2 right-10 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground uppercase font-semibold text-rs-blue"
						>
							Clear
						</button>
					)}
				</div>
				<CommandList>
					{!query && <CommandEmpty>Start typing to search...</CommandEmpty>}
					{query && results.length === 0 && (
						<CommandEmpty>No results found.</CommandEmpty>
					)}
					{query &&
						Object.entries(grouped).map(([type, items]) => {
							if (items.length === 0) return null;
							const Icon = typeIcons[type as keyof typeof typeIcons];
							return (
								<CommandGroup
									key={type}
									heading={typeLabels[type as keyof typeof typeLabels]}
								>
									{items.map((item) => (
										<CommandItem
											key={item.id}
											value={String(item.id)}
											onSelect={() => handleSelect(item.id)}
										>
											<Icon className="h-4 w-4" />
											<span className="flex-1 truncate">{item.title}</span>
											<Badge variant="secondary" className="text-xs">
												{typeLabels[item.type]}
											</Badge>
										</CommandItem>
									))}
								</CommandGroup>
							);
						})}
				</CommandList>
			</CommandDialog>
		</>
	);
};

export default GlobalSearch;
