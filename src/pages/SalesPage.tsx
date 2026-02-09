import { useParams } from 'react-router-dom';
import { useAppContent } from '@/hooks/useAppContent';
import { Loader2 } from 'lucide-react';
import PageHero from '@/components/sales/PageHero';
import ApplicationsSection from '@/components/sales/ApplicationsSection';
import VideoSection from '@/components/sales/VideoSection';
import FeaturesSection from '@/components/sales/FeaturesSection';
import CaseStudiesSection from '@/components/sales/CaseStudiesSection';

const SalesPage = () => {
	const { slug } = useParams<{ slug: string }>();
	const { page, isLoading } = useAppContent(slug);

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!page) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Page not found.</p>
			</div>
		);
	}

	return (
		<div className="space-y-12">
			<PageHero
				title={page.hero.title}
				description={page.hero.description}
				image={page.hero.image}
			/>
			<ApplicationsSection applications={page.applications} />
			<VideoSection video={page.video} />
			<FeaturesSection features={page.features} />
			<CaseStudiesSection caseStudies={page.caseStudies} />
		</div>
	);
};

export default SalesPage;
