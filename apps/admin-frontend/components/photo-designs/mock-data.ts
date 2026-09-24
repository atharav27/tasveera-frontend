export interface PhotoDesignMedia {
  id: string;
  type: string;
  url: string;
}

export interface SupportedSize {
  id: string;
  label: string;
  width: number;
  height: number;
  frameDesignName: string;
}

export interface PhotoDesign {
  id: string;
  title: string;
  slug: string;
  requiredImages: number;
  allowExtraImages: boolean;
  allowDesignerChoice: boolean;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  supportedSizes: SupportedSize[];
  media: PhotoDesignMedia[];
}

export const MOCK_PHOTO_DESIGNS: PhotoDesign[] = [
  {
    id: "pd-001",
    title: "Modern Grid Layout",
    slug: "modern-grid-layout",
    requiredImages: 9,
    allowExtraImages: false,
    allowDesignerChoice: true,
    description: "A perfect 3x3 grid for your instagram memories.",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date("2024-03-25").toISOString(),
    supportedSizes: [
      { id: "fs-1", label: "12x12", width: 12, height: 12, frameDesignName: "Modern Minimal" },
      { id: "fs-2", label: "18x18", width: 18, height: 18, frameDesignName: "Classic Wood" },
    ],
    media: [
      { id: "m-1", type: "PREVIEW", url: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=200" }
    ]
  },
  {
    id: "pd-002",
    title: "Classic Portrait Solo",
    slug: "classic-portrait-solo",
    requiredImages: 1,
    allowExtraImages: false,
    allowDesignerChoice: false,
    description: "Single large photo layout.",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date("2024-03-20").toISOString(),
    supportedSizes: [
      { id: "fs-3", label: "12x18", width: 12, height: 18, frameDesignName: "Classic Wood" },
    ],
    media: []
  },
  {
    id: "pd-003",
    title: "Mosaic Collage",
    slug: "mosaic-collage",
    requiredImages: 15,
    allowExtraImages: true,
    allowDesignerChoice: true,
    description: "A beautiful mosaic for large collections.",
    sortOrder: 3,
    isActive: false,
    createdAt: new Date("2024-03-15").toISOString(),
    supportedSizes: [],
    media: []
  }
];

export const MOCK_FRAME_SIZES: SupportedSize[] = [
  { id: "fs-1", label: "12x12", width: 12, height: 12, frameDesignName: "Modern Minimal" },
  { id: "fs-2", label: "18x18", width: 18, height: 18, frameDesignName: "Classic Wood" },
  { id: "fs-3", label: "12x18", width: 12, height: 18, frameDesignName: "Classic Wood" },
  { id: "fs-4", label: "24x36", width: 24, height: 36, frameDesignName: "Museum Black" },
];
