export type HamperItemType = 'FRAME' | 'POLAROID' | 'STRIP' | 'SIMPLE_PRODUCT';
export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface HamperItem {
    id: string;
    label: string;
    itemType: HamperItemType;
    quantity: number;
    sortOrder: number;
    // Linked entity IDs
    frameDesignId?: string;
    frameSizeId?: string;
    packOptionId?: string;
    simpleProductOptionId?: string;
    // UI helpers (would be joined in real API response)
    displayName: string;
}

export interface Hamper {
    id: string;
    productId: string;
    name: string;
    description: string;
    price: number;
    discount?: number;
    discountType?: DiscountType;
    isActive: boolean;
    createdAt: string;
    items: HamperItem[];
}

export const MOCK_HAMPERS: Hamper[] = [
    {
        id: 'HAMP-001',
        productId: 'PRD-101',
        name: 'The Anniversary Special',
        description: 'A romantic collection containing a large frame and mini strips.',
        price: 2499,
        discount: 10,
        discountType: 'PERCENTAGE',
        isActive: true,
        createdAt: new Date('2024-03-25').toISOString(),
        items: [
            {
                id: 'hi_1',
                label: 'Main Centerpiece',
                itemType: 'FRAME',
                quantity: 1,
                sortOrder: 1,
                frameDesignId: 'fd_1',
                frameSizeId: 'fs_1',
                displayName: 'Classic Walnut (12x18)'
            },
            {
                id: 'hi_2',
                label: 'Memories Pack',
                itemType: 'STRIP',
                quantity: 1,
                sortOrder: 2,
                packOptionId: 'po_1',
                displayName: 'Birthday Strips (5 units)'
            }
        ]
    },
    {
        id: 'HAMP-002',
        productId: 'PRD-102',
        name: 'Office Desk Setup',
        description: 'Perfect for workspace decoration.',
        price: 1299,
        isActive: false,
        createdAt: new Date('2024-03-20').toISOString(),
        items: []
    }
];
