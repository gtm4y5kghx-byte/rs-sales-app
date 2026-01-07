import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
	query: string;
	onChange: (query: string) => void;
	placeholder?: string;
}

const SearchBar = ({
	query,
	onChange,
	placeholder = 'Search assets...',
}: SearchBarProps) => {
	return (
		<div className="mb-4 flex items-center gap-2">
			<Input
				type="text"
				placeholder={placeholder}
				value={query}
				onChange={(e) => onChange(e.target.value)}
				className="flex-1"
			/>
			{query && (
				<Button variant="ghost" size="sm" onClick={() => onChange('')}>
					Clear
				</Button>
			)}
		</div>
	);
};

export default SearchBar;
