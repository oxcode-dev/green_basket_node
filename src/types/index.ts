import express from 'express';

export type ProductType = {
    id: string;
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

interface RequestWithUser extends express.Request {
    user: {
        id: string;
    } | null;
}

export interface UserType  {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: 'ADMIN' | 'CUSTOMER';
    phone: string;
    avatar?: string | null;
}

export type CartItemsType = {
    productId: string;
    quantity: number;
    price: number;
}

export type CartType = {
    total: number | 0;
    items: CartItemsType[]
}

export type OrderType = {
    id: string;
    user_id: string;
    address_id: string;
    total_amount: number;
    delivery_cost: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    payment_method: 'cash' | 'bank transfer' | 'online payment' | 'none';
    payment_status: 'unpaid' | 'paid' | 'refunded';
}