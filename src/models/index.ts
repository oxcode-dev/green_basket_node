import { prisma } from "../lib/prisma.ts"

export const User = prisma.users
export const Category = prisma.categories
export const Product = prisma.products
export const Order = prisma.orders
export const OrderItem = prisma.order_items
export const Review = prisma.reviews
export const Wishlist = prisma.wishlists
export const Address = prisma.addresses