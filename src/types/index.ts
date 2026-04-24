export type ProductType = {
    title: string;
    slug: string;
    summary: string;
    description: string;
    price: number;
    stock: number;
    is_active: boolean;
    image: string;
    category_id: string;
}

export type PaginationType = {
    page: number;
    limit: number;
    skip: number;
}