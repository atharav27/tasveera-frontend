export type MediaType = 
  | 'PRODUCT_THUMBNAIL' 
  | 'PRODUCT_GALLERY' 
  | 'FRAME_PREVIEW' 
  | 'FRAME_GALLERY' 
  | 'PHOTO_DESIGN_PREVIEW' 
  | 'PHOTO_TEMPLATE' 
  | 'BANNER_IMAGE' 
  | 'CATEGORY_IMAGE';

export interface MediaItem {
  id: string;
  url: string;
  type: MediaType;
  altText: string;
  sortOrder: number;
  productId?: string;
  frameDesignId?: string;
  photoDesignId?: string;
  bannerId?: string;
  categoryId?: string;
  createdAt: string;
}

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: "m-101",
    url: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=400",
    type: "PRODUCT_THUMBNAIL",
    altText: "Modern Grid Frame Preview",
    sortOrder: 1,
    productId: "PRD-001",
    createdAt: new Date("2024-03-25").toISOString()
  },
  {
    id: "m-102",
    url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=400",
    type: "PRODUCT_GALLERY",
    altText: "Interior View 1",
    sortOrder: 2,
    productId: "PRD-001",
    createdAt: new Date("2024-03-25").toISOString()
  },
  {
      id: "m-201",
      url: "https://images.unsplash.com/photo-1544207607-e95f643e9fd1?q=80&w=400",
      type: "FRAME_PREVIEW",
      altText: "Classic Wood Frame Texture",
      sortOrder: 1,
      frameDesignId: "FD-001",
      createdAt: new Date("2024-03-20").toISOString()
  },
  {
      id: "m-301",
      url: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400",
      type: "BANNER_IMAGE",
      altText: "Summer Sale Banner",
      sortOrder: 1,
      bannerId: "B-001",
      createdAt: new Date("2024-04-01").toISOString()
  }
];
