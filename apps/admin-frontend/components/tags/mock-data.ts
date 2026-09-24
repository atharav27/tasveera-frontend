export interface Tag {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
}

export const MOCK_TAGS: Tag[] = [
    { id: "TAG-001", name: "New Arrival", slug: "new-arrival", isActive: true },
    { id: "TAG-002", name: "Top Mirror", slug: "top-mirror", isActive: true },
    { id: "TAG-003", name: "Limited Edition", slug: "limited-edition", isActive: false },
    { id: "TAG-004", name: "Bestseller", slug: "bestseller", isActive: true },
    { id: "TAG-005", name: "Eco-Friendly", slug: "eco-friendly", isActive: true },
];
