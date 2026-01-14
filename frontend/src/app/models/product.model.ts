export interface ProductImage {
    id?: number;
    imageUrl: string;
    isThumbnail: boolean;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    slug: string;
    active: boolean;
    stockLevel?: number;
    images?: ProductImage[];
    currentIndex?: number;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}
