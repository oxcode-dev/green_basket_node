import { prisma } from "../lib/prisma.ts"

export default {
    User: prisma.users,
    Category: prisma.categories,
    Product: prisma.products,
    Order: prisma.orders,
    OrderItem: prisma.order_items,
    Review: prisma.reviews,
    Wishlist: prisma.wishlists,
    Address: prisma.addresses,
};