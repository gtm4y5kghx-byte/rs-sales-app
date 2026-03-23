import type { AppContentImage } from '@/types';

interface PageHeroProps {
	title: string;
	description: string;
	image: AppContentImage | null;
}

const PageHero = ({ title, description, image }: PageHeroProps) => {
	return (
		<section className="rounded-lg bg-rs-blue p-6 text-white md:p-8">
			<div className="grid gap-6 md:grid-cols-2 md:items-center">
				<div>
					<h1 className="text-2xl font-bold tracking-tight md:text-3xl">
						{title}
					</h1>
					{description && (
						<p className="mt-4 text-sm text-white/80 md:text-base">
							{description}
						</p>
					)}
				</div>
				{image && (
					<div className="overflow-hidden rounded-lg">
						<img
							src={image.url}
							alt={image.alt}
							className="h-auto w-full object-cover"
						/>
					</div>
				)}
			</div>
		</section>
	);
};

export default PageHero;
