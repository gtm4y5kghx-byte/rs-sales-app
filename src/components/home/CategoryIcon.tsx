import { FileText, Image, Video, Folder } from 'lucide-react';

interface CategoryIconProps {
	slug: string;
	className?: string;
}

const iconMap: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	'product-sheets': FileText,
	'datasheets': FileText,
	images: Image,
	photos: Image,
	videos: Video,
	guides: FileText,
	manuals: FileText,
	documents: FileText,
};

const CategoryIcon = ({ slug, className }: CategoryIconProps) => {
	const Icon = iconMap[slug] || Folder;
	return <Icon className={className} />;
};

export default CategoryIcon;
