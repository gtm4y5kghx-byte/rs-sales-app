export interface ContentItem {
	id: number;
	title: string;
	categoryId: number;
	type: 'pdf' | 'image' | 'video';
	url: string;
	thumbnail: string;
	fileSize: number;
	checksum: string;
	modified: string;
}

export interface Category {
	id: number;
	name: string;
	slug: string;
}

export interface ContentManifest {
	version: string;
	categories: Category[];
	items: ContentItem[];
	totalSize: number;
}

export interface SyncState {
	lastSynced: string | null;
	manifestVersion: string | null;
	itemCount: number;
}

export type SyncStatus = 'idle' | 'checking' | 'downloading' | 'error';

export interface SyncProgress {
	total: number;
	completed: number;
	currentItem: string | null;
}

// App Content types (editorial/layout content from /app-content endpoint)

export interface AppContentImage {
	url: string;
	thumbnail: string;
	alt: string;
}

export interface HeroContent {
	title: string;
	description: string;
	image: AppContentImage | null;
	linkText: string;
	linkSlug: string | null;
}

export interface FAQ {
	question: string;
	answer: string;
}

export interface HomepageContent {
	hero: HeroContent;
	faqs: FAQ[];
	footerTagline: string;
}

export interface ApplicationCard {
	title: string;
	description: string;
	image: AppContentImage | null;
}

export interface VideoContent {
	url: string;
	title: string;
	description: string;
}

export interface FeatureSpecs {
	poleLength: string;
	poleStrength: string;
	voltageLevel: string;
	applications: string;
}

export interface FeatureBlock {
	title: string;
	description: string;
	image: AppContentImage | null;
	specs: FeatureSpecs;
}

export interface CaseStudy {
	assetId: number;
	title: string;
	summary: string;
	thumbnail: string | null;
}

export interface SalesPage {
	slug: string;
	title: string;
	hero: {
		title: string;
		description: string;
		image: AppContentImage | null;
	};
	applications: ApplicationCard[];
	video: VideoContent;
	features: FeatureBlock[];
	caseStudies: CaseStudy[];
}

export interface AppContent {
	version: string;
	homepage: HomepageContent;
	pages: SalesPage[];
}
