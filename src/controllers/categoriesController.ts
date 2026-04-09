import express from 'express';

export const getCategories = async(req: express.Request, res: express.Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}