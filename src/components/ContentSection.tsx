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
			<div className="-mx-6 mb-6 bg-rs-blue px-6 py-14 text-center">
				<h1 className="text-3xl font-bold uppercase tracking-wide text-white">
					{title}
				</h1>
			</div>
			<SearchBar query={query} onChange={setQuery} />
			{results.length === 0 && query && (
				<p className="text-muted-foreground">No assets match "{query}".</p>
			)}
			{results.length > 0 && <ContentGrid items={results} />}
		</div>
	);
};

export default ContentSection;
