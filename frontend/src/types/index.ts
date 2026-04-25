export interface Product {
    id: number;
    name: string;
    slug: string;
    brand: string;
    description: string;
    short_description: string;
    price: number;
    compare_price: number;
    category_id: number | null;
    category_name?: string;
    category_slug?: string;
    images: string;
    ingredients: string;
    usage_instructions: string;
    stock: number;
    featured: number;
    created_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    banner_image: string;
    sort_order: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: number;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    address: string;
    status: string;
    total: number;
    notes: string;
    created_at: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
}

export const API_URL = import.meta.env.DEV ? 'http://localhost:3005' : (import.meta.env.VITE_API_URL || '');

export function getImageUrl(path: string): string {
    if (!path || path === '[]') return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
}

export function getProductImages(product: Product): string[] {
    try {
        const images = JSON.parse(product.images);
        return Array.isArray(images) ? images : [];
    } catch {
        return [];
    }
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0
    }).format(price);
}
