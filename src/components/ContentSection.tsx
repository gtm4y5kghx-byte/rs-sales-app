import { useSearch } from '@/hooks/useSearch';
import SearchBar from '@/components/SearchBar';
import ContentGrid from '@/components/ContentGrid';
import type { ContentItem } from '@/types';

interface ContentSectionProps {
	title: string;
	items: ContentItem[];
}

const ContentSection = ({ title, items }: ContentSectionProps) => {
	const { query, setQuery, results } = useSearch(items);

	return (
		<div className="flex h-full flex-col">
			<h1 className="mb-4 text-xl font-semibold">
				{title} ({results.length})
			</h1>
			<SearchBar query={query} onChange={setQuery} />
			{results.length === 0 && query && (
				<p className="text-muted-foreground">No assets match "{query}".</p>
			)}
			{results.length > 0 && <ContentGrid items={results} />}
		</div>
	);
};

export default ContentSection;
