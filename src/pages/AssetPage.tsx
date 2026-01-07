import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PDFViewer from '@/components/PDFViewer';
import ImageViewer from '@/components/ImageViewer';

const AssetPage = () => {
	const { id } = useParams<{ id: string }>();
	const { items } = useContent();
	const navigate = useNavigate();

	console.info('Items:', items);
	const item = items.find((i) => i.id === Number(id));

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
		<div className="flex h-full flex-col">
			<header className="flex items-center gap-4 border-b p-4">
				<Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<h1 className="text-lg font-semibold">{item.title}</h1>
			</header>

			<div className="flex-1 overflow-hidden">
				{item.type === 'pdf' && <PDFViewer url={item.url} />}
				{item.type === 'image' && (
					<ImageViewer url={item.url} alt={item.title} />
				)}
				{item.type === 'video' && (
					<div className="flex h-full items-center justify-center">
						<p className="text-muted-foreground">
							Video viewer not implemented
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default AssetPage;
