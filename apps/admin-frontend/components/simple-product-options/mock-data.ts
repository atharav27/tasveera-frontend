export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface SimpleProductOption {
    id: string;
    productId: string;
    name: string;
    description: string;
    price: number;
    discount?: number;
    discountType?: DiscountType;
    stock: number;
    isActive: boolean;
    createdAt: string;
}

export const MOCK_SIMPLE_OPTIONS: SimpleProductOption[] = [
    {
        id: "SPO-001",
        productId: "PRD-201",
        name: "Premium Gloss Finish",
        description: "High quality glossy laminate for photos.",
        price: 99,
        stock: 500,
        isActive: true,
        createdAt: new Date("2024-03-20").toISOString()
    },
    {
        id: "SPO-002",
        productId: "PRD-201",
        name: "Matte Elegance",
        description: "Soft touch matte finish, non-reflective.",
        price: 129,
        discount: 10,
        discountType: "FIXED",
        stock: 0,
        isActive: true,
        createdAt: new Date("2024-03-18").toISOString()
    },
    {
        id: "SPO-003",
        productId: "PRD-202",
        name: "Textured Canvas",
        description: "Artistic canvas texture for a painting-like feel.",
        price: 249,
        discount: 5,
        discountType: "PERCENTAGE",
        stock: 120,
        isActive: false,
        createdAt: new Date("2024-03-15").toISOString()
    }
];
