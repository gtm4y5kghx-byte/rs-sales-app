import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AssetTypeBadgeProps {
	type: string;
	className?: string;
}

const AssetTypeBadge = ({ type, className }: AssetTypeBadgeProps) => {
	return (
		<Badge
			variant="secondary"
			className={cn('w-fit text-xs', className)}
		>
			{type.toUpperCase()}
		</Badge>
	);
};

export default AssetTypeBadge;
