export interface LinkedFrameDesign {
  id: string;
  name: string;
  slug: string;
  productId: string;
}

export interface FrameFeature {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  linkedDesigns?: LinkedFrameDesign[];
}

export const MOCK_FRAME_FEATURES: FrameFeature[] = [
  {
    id: "ff-1",
    name: "Standard Glass",
    slug: "standard-glass",
    description: "Clear 2mm float glass for basic protection.",
    icon: "glass",
    sortOrder: 1,
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    linkedDesigns: [
      { id: "fd-1", name: "Classic Walnut", slug: "classic-walnut", productId: "PRD-001" },
      { id: "fd-2", name: "Modern Black", slug: "modern-black", productId: "PRD-001" },
    ]
  },
  {
    id: "ff-2",
    name: "Anti-Reflective Glass",
    slug: "anti-reflective-glass",
    description: "Special coating to reduce reflections and improve clarity.",
    icon: "monitor",
    sortOrder: 2,
    isActive: true,
    createdAt: "2024-01-12T11:30:00Z",
    linkedDesigns: [
      { id: "fd-3", name: "Premium Oak", slug: "premium-oak", productId: "PRD-002" },
    ]
  },
  {
    id: "ff-3",
    name: "Acid-Free Mount",
    slug: "acid-free-mount",
    description: "Protects artwork from yellowing over time.",
    icon: "layers",
    sortOrder: 3,
    isActive: true,
    createdAt: "2024-01-15T09:15:00Z",
    linkedDesigns: []
  },
  {
    id: "ff-4",
    name: "Dust Seal",
    slug: "dust-seal",
    description: "Prevents dust and insects from entering the frame.",
    icon: "shield-check",
    sortOrder: 4,
    isActive: false,
    createdAt: "2024-01-20T14:45:00Z",
    linkedDesigns: []
  }
];
