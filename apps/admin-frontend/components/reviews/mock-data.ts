export interface ProductSummary {
    id: string;
    title: string;
    slug: string;
}

export interface Review {
    id: string;
    reviewerName: string;
    rating: number; // 1-5
    comment: string;
    isApproved: boolean;
    createdAt: string;
    product: ProductSummary;
}

export const MOCK_REVIEWS: Review[] = [
    {
        id: "REV-1001",
        reviewerName: "Priya Sharma",
        rating: 5,
        comment: "Absolutely love the craftsmanship. The frame adds such a premium touch to my living room. Worth every penny!",
        isApproved: false, // Pending
        createdAt: new Date("2024-04-18T10:30:00Z").toISOString(),
        product: { id: "PRD-001", title: "Classic Mahogany Frame", slug: "classic-mahogany-frame" }
    },
    {
        id: "REV-1002",
        reviewerName: "Rahul Verma",
        rating: 4,
        comment: "Good quality print, but the shipping took a day longer than expected. Otherwise, the colors are very punchy.",
        isApproved: false, // Pending
        createdAt: new Date("2024-04-19T14:15:00Z").toISOString(),
        product: { id: "PRD-002", title: "Canvas Art Print", slug: "canvas-art-print" }
    },
    {
        id: "REV-1003",
        reviewerName: "Aarti Desai",
        rating: 1,
        comment: "The glass was shattered when it arrived. I need a replacement immediately!!",
        isApproved: false, // Pending
        createdAt: new Date("2024-04-20T09:45:00Z").toISOString(),
        product: { id: "PRD-003", title: "Modern Floating Frame", slug: "modern-floating-frame" }
    },
    {
        id: "REV-1004",
        reviewerName: "Vikram Singh",
        rating: 5,
        comment: "Excellent service and the personalization options were exactly what I was looking for as a gift.",
        isApproved: true, // Approved
        createdAt: new Date("2024-04-10T11:20:00Z").toISOString(),
        product: { id: "PRD-004", title: "Custom Engraved Plaque", slug: "custom-engraved-plaque" }
    },
    {
        id: "REV-1005",
        reviewerName: "Sneha Patel",
        rating: 3,
        comment: "It's okay. The wood color on the website looked slightly darker than what I received.",
        isApproved: true, // Approved
        createdAt: new Date("2024-04-05T16:00:00Z").toISOString(),
        product: { id: "PRD-001", title: "Classic Mahogany Frame", slug: "classic-mahogany-frame" }
    }
];
