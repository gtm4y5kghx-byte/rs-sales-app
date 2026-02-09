import type { ApplicationCard } from '@/types';

interface ApplicationsSectionProps {
	applications: ApplicationCard[];
}

const ApplicationsSection = ({ applications }: ApplicationsSectionProps) => {
	if (applications.length === 0) {
		return null;
	}

	return (
		<section>
			<h2 className="mb-6 text-center text-xl font-bold uppercase tracking-wide">
				Applications
			</h2>
			<div className="grid gap-6 sm:grid-cols-3">
				{applications.map((app, index) => (
					<div key={index} className="text-center">
						<div className="relative pb-4">
							<div className="overflow-hidden rounded-lg">
								{app.image && (
									<img
										src={app.image.url}
										alt={app.image.alt}
										className="h-48 w-full object-cover"
									/>
								)}
							</div>
							<span className="absolute bottom-0 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-[#1e3a5f] text-sm font-bold text-white">
								{index + 1}
							</span>
						</div>
						<p className="mt-2 text-sm font-medium">{app.title}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default ApplicationsSection;
