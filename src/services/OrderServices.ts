import { Order, OrderItem } from "../models/index.ts";
import type { OrderItemsType, OrderType } from "../types/index.ts";

export const fetchAllOrders = async () => {
    return await Order.findMany();
}

export const fetchOrder = async (id: string) => {
    return await Order.findFirst({
        where: { 
            id: String(Array.isArray(id) ? id[0] : id)
        },
        include: { order_items: true }
    });
}

export const fetchOrderByPaymentReference = async (value: string) => {
    return await Order.findFirst({
        where: { 
            payment_reference: value,
        },
        include: { order_items: true }
    });
}

export const fetchOrdersWithPagination = async(skip: number, limit: number) => {
    return await Order.findMany({
        skip: skip,
        take: limit,
        include: { order_items: true },
        orderBy: { created_at: 'desc' }
    });
}

export const fetchCustomerOrdersWithPagination = async(user_id: string, skip: number, limit: number) => {
    return await Order.findMany({
        skip: skip,
        take: limit,
        include: { order_items: true },
        orderBy: { created_at: 'desc' },
        where: { user_id: user_id }
    });
}

export const countAllCustomerOrders = async (user_id: string) => {
    return await Order.count({
        where: { user_id: user_id }
    });
}

export const countAllOrders = async () => {
    return await Order.count();
}

export const storeOrder = async (orderData: Omit<OrderType, "id">) => {
    const order = await Order.create({
        data: orderData,
    })

    return order;
} 

export const updateOrder = async (id: string, orderData: Partial<OrderType>) => {
    const order = await Order.update({
        where: { id: id },
        data: orderData,
    })

    return order;
} 

export const destroyOrder = async(id: string) => {
    await Order.delete({
        where: { id: id },
    })
}

export const storeOrderItem = async (orderData: Omit<OrderItemsType, "id">) => {
    const order = await OrderItem.create({
        data: orderData,
    })

    return order;
} 

export const destroyOrderItem = async(id: string) => {
    await OrderItem.delete({
        where: { id: id },
    })
}
