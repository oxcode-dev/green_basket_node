import express from 'express';

import fs from 'fs'
import path from 'path'
import { fetchAllUsers } from '../services/usersServices.ts';


const testRoutes = (app: express.Application) => {

    app.get('/api/delete-image/:filename', async (req: any, res: express.Response) => {

        const filePath = path.join(__dirname, '/../../uploads/avatars', req.params.filename);

        fs.unlink(filePath, (err) => {
            if (err) {
                // console.error(err);
                return res.status(500).send(`Error deleting file: ${err}`);
            }
            res.status(200).send('File deleted successfully');
        })
    });

    app.get('/test', async (req: any, res: express.Response) => {
        res.status(200).json({ message: 'Users fetched successfully', users: await fetchAllUsers() });
    })

}

export default testRoutes