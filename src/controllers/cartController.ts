import express from 'express';
import { getCartKey } from '../utils/index.ts';
import { deleteCart, deleteCartItem, fetchCart, fetchCartItem, modifyCartItems, storeCart } from '../services/cartServices.ts';
import { fetchProduct } from '../services/productServices.ts';

export const addToCart = async(req: express.Request, res: express.Response) => {
    const { productId, quantity = 1 }: { productId: string, quantity: number } = req.body;

    const key = getCartKey(req);

    const product = await fetchProduct(productId);

    if (!product) return res.status(403).json({ message: "Product not found" });

    const { total, items } = await storeCart(key, productId, quantity)

    res.status(201).json({ message: 'Added to cart successfully', cart: { items, total } });

}

export const getCart = async(req: express.Request, res: express.Response) => {
    const key = getCartKey(req);

    const { total, items } = await fetchCart(key)

    res.status(200).json({ message: 'Fetch cart successfully', cart: { items, total } });
}

export const updateCartItem = async (req: express.Request, res: express.Response) => {
  
    const { productId } = req.params as { productId: string };
    const { quantity } = req.body as { quantity: number };

    const key = getCartKey(req);

    const existing = await fetchCartItem(key, String(productId));

    if (!existing) return res.status(404).json({ message: "Item not found" });

    const { total, items } = await modifyCartItems(key, productId, quantity)

    res.json({ message: "Cart updated", cart: { items, total } });
};

export const removeCartItem = async (req: express.Request, res: express.Response) => {
    const { productId } = req.params as { productId: string };

    const key = getCartKey(req);

    const { total, items } = await deleteCartItem(key, productId)

    res.json({ message: "Item removed", cart: { items, total } });
};

export const clearCart = async (req: express.Request, res: express.Response) => {
    const key = getCartKey(req);

    const { total, items } = await deleteCart(key)

    res.json({ message: "Cart cleared", cart: { items, total } });
}; 