import { prisma } from "../lib/prisma.ts"
import type { OrderItemsType, OrderType } from "../types/index.ts";

export const fetchAllOrders = async () => {
    return await prisma.orders.findMany();
}

export const fetchOrder = async (id: string) => {
    return await prisma.orders.findFirst({
        where: { 
            id: String(Array.isArray(id) ? id[0] : id)
        },
        include: { order_items: true }
    });
}

// export const fetchOrderByKey = async (key: string, value: string) => {
//     return await prisma.orders.findFirst({
//         where: { 
//             `${key}`: value,
//         },
//         include: { order_items: true }
//     });
// }

export const fetchOrdersWithPagination = async(skip: number, limit: number) => {
    return await prisma.orders.findMany({
        skip: skip,
        take: limit,
        include: { order_items: true },
        orderBy: { created_at: 'desc' }
    });
}

export const fetchCustomerOrdersWithPagination = async(user_id: string, skip: number, limit: number) => {
    return await prisma.orders.findMany({
        skip: skip,
        take: limit,
        include: { order_items: true },
        orderBy: { created_at: 'desc' },
        where: { user_id: user_id }
    });
}

export const countAllCustomerOrders = async (user_id: string) => {
    return await prisma.orders.count({
        where: { user_id: user_id }
    });
}

export const countAllOrders = async () => {
    return await prisma.orders.count();
}

export const storeOrder = async (orderData: Omit<OrderType, "id">) => {
    const order = await prisma.orders.create({
        data: orderData,
    })

    return order;
} 

export const updateOrder = async (id: string, orderData: Partial<OrderType>) => {
    const order = await prisma.orders.update({
        where: { id: id },
        data: orderData,
    })

    return order;
} 

export const destroyOrder = async(id: string) => {
    await prisma.orders.delete({
        where: { id: id },
    })
}

export const storeOrderItem = async (orderData: Omit<OrderItemsType, "id">) => {
    const order = await prisma.order_items.create({
        data: orderData,
    })

    return order;
} 

export const destroyOrderItem = async(id: string) => {
    await prisma.order_items.delete({
        where: { id: id },
    })
}
