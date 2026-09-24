export interface FrameDesignSize {
  id: string;
  label: string;
  width: number;
  height: number;
  price: number;
  discount: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  stock: number;
  isAvailable: boolean;
}

export interface FrameDesignFeature {
  id: string;
  name: string;
}

export interface FrameDesignMedia {
  id: string;
  url: string;
  type: string;
}

export interface FrameDesign {
  id: string;
  productId: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  features: FrameDesignFeature[];
  sizes: FrameDesignSize[];
  media: FrameDesignMedia[];
}

export const MOCK_FRAME_DESIGNS: FrameDesign[] = [
  {
    id: "fd-1",
    productId: "PRD-001",
    name: "Classic Walnut",
    slug: "classic-walnut",
    description: "A timeless walnut wood finish suitable for vintage and modern photos.",
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    features: [
      { id: "feat-1", name: "Premium Wood" },
      { id: "feat-2", name: "UV Glass" }
    ],
    sizes: [
      {
        id: "size-1",
        label: "8x10",
        width: 8,
        height: 10,
        price: 1500,
        discount: 10,
        discountType: "PERCENTAGE",
        stock: 45,
        isAvailable: true
      },
      {
        id: "size-2",
        label: "12x18",
        width: 12,
        height: 18,
        price: 2500,
        discount: 0,
        discountType: "FIXED",
        stock: 12,
        isAvailable: true
      }
    ],
    media: [
      { id: "m1", url: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=300", type: "PREVIEW" },
      { id: "m2", url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=300", type: "PREVIEW_ALT" }
    ]
  },
  {
    id: "fd-2",
    productId: "PRD-002",
    name: "Modern Matte Black",
    slug: "modern-matte-black",
    description: "Sleek and minimalistic black frame for a modern look.",
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    features: [
      { id: "feat-3", name: "Metal Core" }
    ],
    sizes: [
      {
        id: "size-3",
        label: "A4",
        width: 8.3,
        height: 11.7,
        price: 1200,
        discount: 200,
        discountType: "FIXED",
        stock: 5,
        isAvailable: true
      }
    ],
    media: []
  }
];

export const FRAME_DESIGN_STATS = {
  TOTAL: 2,
  ACTIVE: 2,
};
