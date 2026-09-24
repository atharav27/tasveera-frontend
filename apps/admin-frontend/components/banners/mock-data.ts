export type BannerPosition = 
  | 'HOMEPAGE_HERO' 
  | 'HOMEPAGE_SECONDARY' 
  | 'CATEGORY_PAGE' 
  | 'PRODUCT_PAGE' 
  | 'PROMOTIONAL';

export interface Banner {
    id: string;
    title: string;
    subtitle?: string;
    link: string;
    position: BannerPosition;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
}

export const MOCK_BANNERS: Banner[] = [
    {
        id: "bnr-001",
        title: "Summer Solstice Sale",
        subtitle: "Up to 50% off on all frames",
        link: "https://tasveera.in/sale",
        position: "HOMEPAGE_HERO",
        isActive: true,
        sortOrder: 1,
        createdAt: new Date("2024-04-01").toISOString()
    },
    {
        id: "bnr-002",
        title: "New Arrivals",
        subtitle: "Check out our latest minimal collections",
        link: "https://tasveera.in/new",
        position: "HOMEPAGE_HERO",
        isActive: true,
        sortOrder: 2,
        createdAt: new Date("2024-04-05").toISOString()
    },
    {
        id: "bnr-003",
        title: "Follow us on Instagram",
        subtitle: "@tasveera_india",
        link: "https://instagram.com/tasveera_india",
        position: "HOMEPAGE_SECONDARY",
        isActive: true,
        sortOrder: 1,
        createdAt: new Date("2024-03-15").toISOString()
    }
];

export const BANNER_POSITIONS: { value: BannerPosition; label: string }[] = [
    { value: 'HOMEPAGE_HERO', label: 'Homepage Hero' },
    { value: 'HOMEPAGE_SECONDARY', label: 'Homepage Secondary' },
    { value: 'CATEGORY_PAGE', label: 'Category Page' },
    { value: 'PRODUCT_PAGE', label: 'Product Page' },
    { value: 'PROMOTIONAL', label: 'Promotional' },
];
