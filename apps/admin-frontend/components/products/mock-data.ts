export type ProductType = 'FRAME' | 'PACK' | 'HAMPER' | 'SIMPLE' | 'CUSTOM';

export interface ProductMedia {
  id: string;
  type: 'PRODUCT_THUMBNAIL' | 'PRODUCT_GALLERY';
  url: string;
}

export interface Product {
  id: string;
  productId: string;
  title: string;
  subtitle?: string;
  description?: string;
  slug: string;
  type: ProductType;
  requiresImage: boolean;
  maxImages?: number;
  isFragile: boolean;
  featured: boolean;
  bestseller: boolean;
  isActive: boolean;
  media: ProductMedia[];
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  createdAt: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    productId: 'PRD-001',
    title: 'Classic Wooden Frame',
    subtitle: 'Elegant handcrafted wooden frame',
    description: 'A beautiful walnut wood frame for your memories.',
    slug: 'classic-wooden-frame',
    type: 'FRAME',
    requiresImage: true,
    maxImages: 1,
    isFragile: true,
    featured: true,
    bestseller: true,
    isActive: true,
    media: [
      { id: 'm1', type: 'PRODUCT_THUMBNAIL', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=200' }
    ],
    categories: [{ id: 'c1', name: 'Frames' }],
    tags: [{ id: 't1', name: 'Wooden' }],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    productId: 'PRD-002',
    title: 'Birthday Gift Pack',
    subtitle: 'Perfect for birthdays',
    description: 'A curated pack containing a frame and a card.',
    slug: 'birthday-gift-pack',
    type: 'PACK',
    requiresImage: true,
    maxImages: 2,
    isFragile: false,
    featured: false,
    bestseller: true,
    isActive: true,
    media: [
      { id: 'm2', type: 'PRODUCT_THUMBNAIL', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200' }
    ],
    categories: [{ id: 'c2', name: 'Gifts' }],
    tags: [{ id: 't2', name: 'Birthday' }],
    createdAt: new Date().toISOString()
  }
];

export const PRODUCT_STATS = {
  TOTAL: 2,
  ACTIVE: 2,
  FEATURED: 1,
  BESTSELLER: 2
};
