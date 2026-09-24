export type PackType = 'POLAROID' | 'STRIP';
export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface PackOption {
    id: string;
    name: string;
    productId: string;
    packType: PackType;
    baseQuantity: number;
    requiredImages: number;
    price: number;
    extraPricePerUnit: number;
    discount?: number;
    discountType?: DiscountType;
    isActive: boolean;
    createdAt: string;
}

export const MOCK_PACK_OPTIONS: PackOption[] = [
    {
        id: 'PO-001',
        name: 'Standard Polaroid Pack',
        productId: 'PRD-001',
        packType: 'POLAROID',
        baseQuantity: 10,
        requiredImages: 10,
        price: 499,
        extraPricePerUnit: 40,
        discount: 10,
        discountType: 'PERCENTAGE',
        isActive: true,
        createdAt: new Date('2024-03-20').toISOString()
    },
    {
        id: 'PO-002',
        name: 'Mini Photo Strips',
        productId: 'PRD-002',
        packType: 'STRIP',
        baseQuantity: 5,
        requiredImages: 5,
        price: 299,
        extraPricePerUnit: 50,
        discount: 0,
        discountType: 'FIXED',
        isActive: true,
        createdAt: new Date('2024-03-18').toISOString()
    },
    {
        id: 'PO-003',
        name: 'Retro Strip Collection',
        productId: 'PRD-003',
        packType: 'STRIP',
        baseQuantity: 12,
        requiredImages: 12,
        price: 599,
        extraPricePerUnit: 35,
        isActive: false,
        createdAt: new Date('2024-03-15').toISOString()
    }
];
