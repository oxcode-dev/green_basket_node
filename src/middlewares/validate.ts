import express from 'express';
import { z, ZodError } from 'zod';

export const validateInputData = (schema: z.ZodTypeAny) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction)=>{
        try{
            schema.parse(req.body);
            next();
        } catch(err){
            if (err instanceof ZodError){
                const errors = err?.issues || []
                const errorMsg = errors.map((issue)=> ({
                    message: `${issue.message}`,
                    input: issue.path[0]
                }))
                res.status(400).json({status: false, message: "Invalid data", errors: errorMsg})
            } else {
                return res.status(500).json({ success: false, error: "Server Error: Unexpected error during validation" });
            }
        }
    }
}