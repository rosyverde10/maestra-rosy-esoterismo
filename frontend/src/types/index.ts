export interface Product {
  id: string;
  name: string;
  category: string;
  priceText: string;
  description: string;
  materials: string;
  dimensions: string;
  status: 'disponible' | 'agotado' | 'sobre_pedido';
  images: string[];
  featured: boolean;
  createdAt: string;
}

export interface SiteConfig {
  businessName: string;
  tagline: string;
  logoImage?: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaButton: string;
  heroWhatsappCta: string;
  heroFeature1Title: string;
  heroFeature1Subtitle: string;
  heroFeature2Title: string;
  heroFeature2Subtitle: string;
  heroFeature3Title: string;
  heroFeature3Subtitle: string;
  catalogTitle: string;
  catalogSubtitle: string;
  aboutBadge: string;
  aboutTitle: string;
  aboutText: string;
  traditionText: string;
  aboutImage?: string;
  announcementBanner: string;
  footerText: string;
}

export interface SocialConfig {
  whatsappNumber: string;
  whatsappMessage: string;
  phone: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  locationAddress: string;
  workingHours: string;
}

export interface SiteData {
  products: Product[];
  siteConfig: SiteConfig;
  socialConfig: SocialConfig;
  categories: string[];
  adminPinHash: string;
  adminEmail: string;
}
