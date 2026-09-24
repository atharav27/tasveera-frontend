export type CategoryType = 'PRODUCT' | 'OCCASION' | 'COLLECTION' | 'PROMOTION';

export interface CategoryLinkedProduct {
  id: string;
  productId: string;
  title: string;
  type: string;
  isActive: boolean;
  featured: boolean;
  bestseller: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  linkedProducts: CategoryLinkedProduct[];
}

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat_001",
    name: "Frames & Decor",
    slug: "frames-decor",
    type: "PRODUCT",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date("2024-03-20").toISOString(),
    linkedProducts: [
      {
        id: "1",
        productId: "PRD-001",
        title: "Classic Wooden Frame",
        type: "FRAME",
        isActive: true,
        featured: true,
        bestseller: true,
      }
    ]
  },
  {
    id: "cat_002",
    name: "Valentine's Day Gifts",
    slug: "valentines-day-gifts",
    type: "OCCASION",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date("2024-02-01").toISOString(),
    linkedProducts: [
      {
        id: "2",
        productId: "PRD-002",
        title: "Birthday Gift Pack",
        type: "PACK",
        isActive: true,
        featured: false,
        bestseller: true,
      }
    ]
  },
  {
    id: "cat_003",
    name: "Summer Sale",
    slug: "summer-sale",
    type: "PROMOTION",
    sortOrder: 3,
    isActive: false,
    createdAt: new Date("2024-03-15").toISOString(),
    linkedProducts: []
  }
];
