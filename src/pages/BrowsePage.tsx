import { useContent } from '@/hooks/useContent';

const BrowsePage = () => {
	const { items } = useContent();

	if (items.length === 0) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<p className="mb-4 text-gray-600">No content synced yet.</p>
					<button className="rounded bg-blue-600 px-4 py-2 text-white">
						Sync Now
					</button>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h1 className="mb-4 text-xl font-semibold">
				All Assets ({items.length})
			</h1>
			<p>Content grid will go here</p>
		</div>
	);
};

export default BrowsePage;
