import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import PDFViewer from '@/components/PDFViewer';
import ImageViewer from '@/components/ImageViewer';
import VideoViewer from '@/components/VideoViewer';

const AssetPage = () => {
	const { id } = useParams<{ id: string }>();
	const { items, isLoading } = useContent();
	const navigate = useNavigate();

	const item = items.find((i) => i.id === Number(id));

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!item) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<p className="mb-4 text-muted-foreground">Asset not found</p>
					<Button variant="outline" onClick={() => navigate('/')}>
						Back to Browse
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex h-full max-w-5xl flex-col">
			<header className="flex items-center gap-1 border-b py-4">
				<Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<h1 className="text-lg font-semibold">{item.title}</h1>
			</header>

			{item.description && (
				<p className="py-3 text-sm text-muted-foreground">
					{item.description}
				</p>
			)}

			<div className="flex-1 overflow-hidden">
				{item.type === 'pdf' && <PDFViewer url={item.url} />}
				{item.type === 'image' && (
					<ImageViewer url={item.url} alt={item.title} />
				)}
				{item.type === 'video' && (
					<VideoViewer url={item.url} title={item.title} />
				)}
			</div>
		</div>
	);
};

export default AssetPage;
