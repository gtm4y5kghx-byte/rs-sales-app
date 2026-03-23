import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import type { HeroContent } from '@/types';

interface HeroSectionProps {
	hero: HeroContent;
}

const HeroSection = ({ hero }: HeroSectionProps) => {
	return (
		<section className="rounded-lg bg-rs-blue p-6 text-white md:p-8">
			<div className="grid gap-6 md:grid-cols-2 md:items-center">
				<div>
					<h1 className="text-2xl font-bold tracking-tight md:text-3xl">
						{hero.title}
					</h1>
					<p className="mt-4 text-sm text-white/80 md:text-base">
						{hero.description}
					</p>
					{hero.linkSlug && (
						<Button
							asChild
							variant="outline"
							className="mt-6 border-white bg-transparent text-white hover:bg-white hover:text-rs-blue"
						>
							<Link to={`/resource/${hero.linkSlug}`}>{hero.linkText}</Link>
						</Button>
					)}
				</div>
				{hero.image && (
					<div className="overflow-hidden rounded-lg">
						<img
							src={hero.image.url}
							alt={hero.image.alt}
							className="h-auto w-full object-cover"
						/>
					</div>
				)}
			</div>
		</section>
	);
};

export default HeroSection;
