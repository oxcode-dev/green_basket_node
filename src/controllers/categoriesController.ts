import express, {type Request} from 'express';
import { destroyCategory, fetchCategories, fetchCategory, storeCategory, updateCategory } from '../services/categoryServices.ts';

export const getCategories = async(req: express.Request, res: express.Response) => {
    const categories = await fetchCategories();

    return res.status(200).json({
        message: "Categories retrieved successfully!!!",
        categories
    })
}

export const getCategory = async(req: Request, res: express.Response) => {
    const { id } = req.params as {id: string};
    
    const category = await fetchCategory(id);

    return res.status(200).json({
        message: "Category retrieved successfully!!!",
        category
    })
}


export const createCategory = async (req: express.Request, res: express.Response) => {
    const { name, description } = req.body;

    const category = await storeCategory(name, description);

    return res.status(201).json({
        message: "Category created successfully!!!",
        category
    })
}

export const editCategory = async (req: express.Request, res: express.Response) => {
    const { name, description } = req.body;

    const { id } = req.params as { id: string }; 

    const category = await updateCategory(id, name, description);

    return res.status(201).json({
        message: "Category updated successfully!!!",
        category
    })
}

export const deleteCategory = async (req: express.Request, res: express.Response) => {
    const { id } = req.params as { id: string }; 

    await destroyCategory(id);

    return res.status(201).json({
        message: "Category deleted successfully!!!",
    })
}