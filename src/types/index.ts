import express from 'express';

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