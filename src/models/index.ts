import { prisma } from "../lib/prisma.ts"

export const { 
    users: User,
    categories: Category,
    products: Product,
    orders: Order,
    order_items: OrderItem,
    reviews: Review,
    wishlists: Wishlist,
    addresses: Address,
    otp_codes: OtpCode,
} = prisma;