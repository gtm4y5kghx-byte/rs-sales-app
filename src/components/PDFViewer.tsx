import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url,
).toString();

interface PDFViewerProps {
	url: string;
}

const PDFViewer = ({ url }: PDFViewerProps) => {
	const [numPages, setNumPages] = useState<number | null>(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [error, setError] = useState<string | null>(null);
	const [containerWidth, setContainerWidth] = useState<number | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setContainerWidth(entry.contentRect.width);
			}
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
		setNumPages(numPages);
		setError(null);
	};

	const onDocumentLoadError = (error: Error) => {
		setError(error.message);
	};

	const goToPrevPage = () => setPageNumber((p) => Math.max(1, p - 1));
	const goToNextPage = () =>
		setPageNumber((p) => Math.min(numPages ?? p, p + 1));

	if (error) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-destructive">Failed to load PDF: {error}</p>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-center gap-4 border-b p-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={goToPrevPage}
					disabled={pageNumber <= 1}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<span className="text-sm">
					Page {pageNumber} of {numPages ?? '...'}
				</span>
				<Button
					variant="ghost"
					size="icon"
					onClick={goToNextPage}
					disabled={pageNumber >= (numPages ?? 1)}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			<div ref={containerRef} className="flex-1 overflow-auto">
				<Document
					file={url}
					onLoadSuccess={onDocumentLoadSuccess}
					onLoadError={onDocumentLoadError}
					loading={
						<div className="flex h-full items-center justify-center">
							<p className="text-muted-foreground">Loading PDF...</p>
						</div>
					}
				>
					<Page
						pageNumber={pageNumber}
						width={containerWidth ?? undefined}
						renderTextLayer={true}
						renderAnnotationLayer={true}
					/>
				</Document>
			</div>
		</div>
	);
};

export default PDFViewer;
