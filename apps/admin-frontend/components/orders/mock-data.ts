export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  designInfo?: string;
  customizationNotes?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  courier?: string;
  awbNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  items: OrderItem[];
  images: {
    slot: string;
    url: string;
  }[];
  referenceImages: string[];
  hamperSelections: string[];
}

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Atharva Kulkarni',
    email: 'atharva@example.com',
    phone: '+91 98765 43210',
    address: {
      street: '123 Main St, Apartment 4B',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411001',
      country: 'India',
    },
    totalAmount: 2500,
    subtotal: 2350,
    shippingFee: 150,
    discount: 0,
    status: 'PENDING',
    paymentStatus: 'UNPAID',
    createdAt: '2024-04-18T10:30:00Z',
    items: [
      {
        id: 'i1',
        productName: 'Custom Portrait Frame',
        quantity: 1,
        price: 1500,
        designInfo: 'Classic Wooden Style',
        customizationNotes: 'Add "Happy Birthday" text at the bottom',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=200&auto=format&fit=crop',
      },
      {
        id: 'i2',
        productName: 'Handmade Greeting Card',
        quantity: 2,
        price: 425,
        image: 'https://images.unsplash.com/photo-1514339900736-ff45b982637a?q=80&w=200&auto=format&fit=crop',
      }
    ],
    images: [
      { slot: 'Front', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=400&auto=format&fit=crop' },
      { slot: 'Back', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=400&auto=format&fit=crop' }
    ],
    referenceImages: ['https://images.unsplash.com/photo-1514339900736-ff45b982637a?q=80&w=400&auto=format&fit=crop'],
    hamperSelections: ['Chocolate box', 'Flower bouquet']
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Jessica Smith',
    email: 'jessica@example.com',
    phone: '+44 7700 900077',
    address: {
      street: '45 Baker Street',
      city: 'London',
      state: 'Greater London',
      zipCode: 'NW1 6XE',
      country: 'UK',
    },
    totalAmount: 4800,
    subtotal: 4800,
    shippingFee: 0,
    discount: 0,
    status: 'PAID',
    paymentStatus: 'PAID',
    createdAt: '2024-04-19T14:45:00Z',
    items: [
      {
        id: 'i3',
        productName: 'Luxury Wedding Hamper',
        quantity: 1,
        price: 4800,
        customizationNotes: 'Please include a special note for the couple',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop',
      }
    ],
    images: [],
    referenceImages: [],
    hamperSelections: ['Premium Wine', 'Assorted Nuts', 'Gourmet Cheese']
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Rahul Verma',
    email: 'rahul@example.com',
    phone: '+91 99887 76655',
    address: {
      street: 'Sector 4, Rohini',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110085',
      country: 'India',
    },
    totalAmount: 1200,
    subtotal: 1050,
    shippingFee: 150,
    discount: 0,
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    courier: 'Delhivery',
    awbNumber: '1234567890',
    shippedAt: '2024-04-19T09:00:00Z',
    createdAt: '2024-04-17T11:20:00Z',
    items: [
      {
        id: 'i4',
        productName: 'Personalized Mug',
        quantity: 1,
        price: 1050,
        image: 'https://images.unsplash.com/photo-1544776126-7964ec55978b?q=80&w=200&auto=format&fit=crop',
      }
    ],
    images: [],
    referenceImages: [],
    hamperSelections: []
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '+1 123 456 7890',
    address: {
      street: '789 Sunset Blvd',
      city: 'Los Angeles',
      state: 'California',
      zipCode: '90001',
      country: 'USA',
    },
    totalAmount: 3200,
    subtotal: 3000,
    shippingFee: 200,
    discount: 0,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    courier: 'FedEx',
    awbNumber: 'FEDEX987654',
    shippedAt: '2024-04-15T10:00:00Z',
    deliveredAt: '2024-04-17T15:30:00Z',
    createdAt: '2024-04-14T08:15:00Z',
    items: [
      {
        id: 'i5',
        productName: 'Photo Canvas Art',
        quantity: 1,
        price: 3000,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=200&auto=format&fit=crop',
      }
    ],
    images: [],
    referenceImages: [],
    hamperSelections: []
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customerName: 'Sarita Devi',
    email: 'sarita@example.com',
    phone: '+91 91234 56789',
    address: {
      street: 'Park Avenue, HSR Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560102',
      country: 'India',
    },
    totalAmount: 500,
    subtotal: 500,
    shippingFee: 0,
    discount: 0,
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    createdAt: '2024-04-12T16:40:00Z',
    items: [
      {
        id: 'i6',
        productName: 'Small Photo Frame',
        quantity: 1,
        price: 500,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=200&auto=format&fit=crop',
      }
    ],
    images: [],
    referenceImages: [],
    hamperSelections: []
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    customerName: 'Michael Brown',
    email: 'michael@brown.com',
    phone: '+1 555 123 4567',
    address: {
      street: '12 Oak St',
      city: 'Chicago',
      state: 'Illinois',
      zipCode: '60601',
      country: 'USA',
    },
    totalAmount: 1850,
    subtotal: 1700,
    shippingFee: 150,
    discount: 0,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    createdAt: '2024-04-19T20:10:00Z',
    items: [
      {
        id: 'i7',
        productName: 'Customised Lamp',
        quantity: 1,
        price: 1700,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed043f9959?q=80&w=200&auto=format&fit=crop',
      }
    ],
    images: [],
    referenceImages: [],
    hamperSelections: []
  }
];

export const ORDER_STATS = {
  PENDING: 1,
  PAID: 1,
  PROCESSING: 1,
  SHIPPED: 1,
  DELIVERED: 1,
  CANCELLED: 1,
  TOTAL: 6
};
