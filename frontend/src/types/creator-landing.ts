// Creator Landing Page Types

export type SectionType =
  | 'hero'
  | 'latest_post'
  | 'recent_posts'
  | 'popular_posts'
  | 'all_collections'
  | 'popular_products'
  | 'explore_posts'
  | 'about'
  | 'tiers'
  | 'gallery'
  | 'testimonials'
  | 'faq'
  | 'contact'
  | 'cta'
  | 'custom_text';

export interface LandingSection {
  id: string;
  type: SectionType;
  title: string;
  description: string;
  order: number;
  enabled: boolean;
  config: SectionConfig;
}

export interface SectionConfig {
  // Common
  title?: string;
  subtitle?: string;
  description?: string;
  alignment?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
  showTitle?: boolean;
  
  // Hero specific
  displayName?: string;
  tagline?: string;
  ctaText?: string;
  ctaLink?: string;
  showProfilePhoto?: boolean;
  showCoverImage?: boolean;
  
  // Content sections
  maxItems?: number;
  layout?: 'grid' | 'list' | 'carousel';
  showImages?: boolean;
  
  // About
  content?: string;
  
  // Tiers
  tiers?: TierDisplay[];
  
  // Gallery
  galleryItems?: GalleryItem[];
  
  // Testimonials
  testimonials?: Testimonial[];
  
  // FAQ
  faqs?: FAQ[];
  
  // Custom text
  customHtml?: string;
}

export interface TierDisplay {
  id: string;
  name: string;
  price: string;
  currency: string;
  benefits: string[];
  highlighted?: boolean;
  tierObjectId?: string; // Sui object ID
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  walrusId: string;
  caption?: string;
  thumbnail?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  content: string;
  rating?: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  useProfilePhotoColor: boolean; // Auto-extract color from profile photo
}

export interface HeaderConfig {
  pageName: string;
  profilePhotoWalrusId?: string;
  coverPhotoWalrusId?: string;
  displayName: string;
  tagline: string;
  showJoinButton: boolean;
  joinButtonText: string;
}

export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  youtube?: string;
  discord?: string;
  website?: string;
  custom?: { label: string; url: string }[];
}

export interface CreatorLandingPage {
  id: string;
  creatorAddress: string;
  
  // Header
  header: HeaderConfig;
  
  // Theme
  theme: ThemeConfig;
  
  // Sections
  sections: LandingSection[];
  
  // About
  about?: string;
  
  // Social links
  socialLinks: SocialLinks;
  
  // SEO
  customTitle?: string;
  customDescription?: string;
  customKeywords: string[];
  ogImageWalrusId?: string;
  
  // Settings
  visibility: 'public' | 'unlisted' | 'private';
  isPublished: boolean;
  showMembershipEarnings: boolean;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastPublishedAt?: string;
}

// Default sections for new landing pages
export const DEFAULT_SECTIONS: LandingSection[] = [
  {
    id: 'latest-post',
    type: 'latest_post',
    title: 'Latest post',
    description: 'Your most recent post',
    order: 0,
    enabled: true,
    config: {
      showTitle: true,
    },
  },
  {
    id: 'recent-posts',
    type: 'recent_posts',
    title: 'Recent posts',
    description: 'Your latest posts',
    order: 1,
    enabled: true,
    config: {
      showTitle: true,
      maxItems: 6,
      layout: 'grid',
    },
  },
  {
    id: 'popular-posts',
    type: 'popular_posts',
    title: 'Popular posts',
    description: 'Your most popular posts',
    order: 2,
    enabled: false,
    config: {
      showTitle: true,
      maxItems: 6,
      layout: 'grid',
    },
  },
  {
    id: 'all-collections',
    type: 'all_collections',
    title: 'All collections',
    description: 'Your most recent posts',
    order: 3,
    enabled: false,
    config: {
      showTitle: true,
    },
  },
  {
    id: 'popular-products',
    type: 'popular_products',
    title: 'Popular products',
    description: 'Your most popular products',
    order: 4,
    enabled: false,
    config: {
      showTitle: true,
      maxItems: 6,
    },
  },
  {
    id: 'explore-posts',
    type: 'explore_posts',
    title: 'Explore more posts',
    description: 'More of your most popular posts',
    order: 5,
    enabled: false,
    config: {
      showTitle: true,
      maxItems: 6,
    },
  },
];

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#FF90E8',
  accentColor: '#3c3f44',
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff',
  fontFamily: 'Inter',
  useProfilePhotoColor: false,
};

export const DEFAULT_HEADER: HeaderConfig = {
  pageName: '',
  displayName: '',
  tagline: '',
  showJoinButton: true,
  joinButtonText: 'Join for free',
};

// Available section types for the "Add" menu
export const AVAILABLE_SECTIONS: { type: SectionType; label: string; description: string }[] = [
  { type: 'latest_post', label: 'Latest post', description: 'Your most recent post' },
  { type: 'recent_posts', label: 'Recent posts', description: 'Your latest posts' },
  { type: 'popular_posts', label: 'Popular posts', description: 'Your most popular posts' },
  { type: 'all_collections', label: 'All collections', description: 'Your most recent posts' },
  { type: 'popular_products', label: 'Popular products', description: 'Your most popular products' },
  { type: 'explore_posts', label: 'Explore more posts', description: 'More of your most popular posts' },
  { type: 'about', label: 'About', description: 'Introduce yourself and your Patreon' },
  { type: 'tiers', label: 'Membership tiers', description: 'Showcase your subscription tiers' },
  { type: 'gallery', label: 'Gallery', description: 'Display your work' },
  { type: 'testimonials', label: 'Testimonials', description: 'Show supporter feedback' },
  { type: 'faq', label: 'FAQ', description: 'Answer common questions' },
  { type: 'custom_text', label: 'Custom text', description: 'Add custom content' },
];
