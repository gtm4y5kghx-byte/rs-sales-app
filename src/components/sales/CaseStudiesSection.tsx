import { Link } from 'react-router-dom';
import type { CaseStudy } from '@/types';

interface CaseStudiesSectionProps {
	caseStudies: CaseStudy[];
}

const CaseStudiesSection = ({ caseStudies }: CaseStudiesSectionProps) => {
	if (caseStudies.length === 0) {
		return null;
	}

	return (
		<section>
			<h2 className="mb-6 text-center text-xl font-bold uppercase tracking-wide">
				Case Studies
			</h2>
			<div className="grid gap-6 sm:grid-cols-3">
				{caseStudies.map((study) => (
					<div key={study.assetId} className="text-center">
						{study.thumbnail && (
							<div className="overflow-hidden rounded-lg">
								<img
									src={study.thumbnail}
									alt={study.title}
									className="h-48 w-full object-cover"
								/>
							</div>
						)}
						<h3 className="mt-3 text-sm font-medium">{study.title}</h3>
						{study.summary && (
							<p className="mt-1 text-xs text-muted-foreground">
								{study.summary}
							</p>
						)}
						<Link
							to={`/asset/${study.assetId}`}
							className="mt-1 inline-block text-xs font-semibold uppercase tracking-wide text-rs-blue hover:underline"
						>
							View Case Study
						</Link>
					</div>
				))}
			</div>
		</section>
	);
};

export default CaseStudiesSection;
