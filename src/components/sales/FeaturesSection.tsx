import type { FeatureBlock } from '@/types';

interface FeaturesSectionProps {
	features: FeatureBlock[];
}

const FeaturesSection = ({ features }: FeaturesSectionProps) => {
	if (features.length === 0) {
		return null;
	}

	return (
		<section>
			<h2 className="mb-8 text-center text-xl font-bold uppercase tracking-wide">
				Built for Your Grid
			</h2>
			<div className="space-y-10">
				{features.map((feature, index) => {
					const imageFirst = index % 2 === 0;

					return (
						<div
							key={index}
							className="grid items-start gap-6 md:grid-cols-2"
						>
							{imageFirst && feature.image && (
								<div className="aspect-4/3 overflow-hidden rounded-lg">
									<img
										src={feature.image.url}
										alt={feature.image.alt}
										className="h-full w-full object-cover"
									/>
								</div>
							)}
							<div>
								<h3 className="text-lg font-bold uppercase">
									{feature.title}
								</h3>
								{feature.description && (
									<p className="mt-2 text-sm text-muted-foreground">
										{feature.description}
									</p>
								)}
								<dl className="mt-4 space-y-1 text-sm">
									{feature.specs.poleLength && (
										<div>
											<dt className="inline font-semibold">Pole Length: </dt>
											<dd className="inline">{feature.specs.poleLength}</dd>
										</div>
									)}
									{feature.specs.poleStrength && (
										<div>
											<dt className="inline font-semibold">Pole Strength: </dt>
											<dd className="inline">{feature.specs.poleStrength}</dd>
										</div>
									)}
									{feature.specs.voltageLevel && (
										<div>
											<dt className="inline font-semibold">Voltage Level: </dt>
											<dd className="inline">{feature.specs.voltageLevel}</dd>
										</div>
									)}
									{feature.specs.applications && (
										<div>
											<dt className="inline font-semibold">Applications: </dt>
											<dd className="inline">{feature.specs.applications}</dd>
										</div>
									)}
								</dl>
							</div>
							{!imageFirst && feature.image && (
								<div className="aspect-4/3 overflow-hidden rounded-lg">
									<img
										src={feature.image.url}
										alt={feature.image.alt}
										className="h-full w-full object-cover"
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default FeaturesSection;
