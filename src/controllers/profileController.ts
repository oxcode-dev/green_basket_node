import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.ts';

interface RequestWithUser extends express.Request {
    user: {
        id: string;
    } | null
}

export const getUserDetails = async (req: RequestWithUser, res: express.Response) => {
    try {
        const auth = req.user
        const user = await prisma.users.findFirst({
            where: { id: String(auth?.id) },
            // omit: ['password'],
        })

         if (!user) {
            res.status(400).json({ msg: "User does not exist." });
        }

        let data = {
            status: "success",
            message: "Profile retrieved successfully",
            user: {
                id: user?.id || '',
                fullName: user?.first_name + ' ' + user?.last_name,
                email: user?.email,
                first_name: user?.first_name,
                last_name: user?.last_name,
                avatar: user?.avatar,
                // bio: user?.bio,
            },
        }

        res.status(200).json(data);
    } catch(error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const updateUserDetails = async (req: RequestWithUser, res: express.Response) => {
    try {
        const auth = req.user;

        const { first_name, last_name, email, phone } = req.body;

        if(
            !first_name || !last_name || !email
        ) {
            return res.status(400).json({
                message: "Required fields are missing!",
            })
        }

        const updatedUser = await prisma.users.update({
            where: { id: String(auth?.id) },
            data: { 
                first_name,
                last_name,
                email, 
                phone,
            },
        });

        let data = {
            user: updatedUser,
            status: "success",
            message: "Profile updated successfully",
        };
        res.status(201).json(data);
    } catch(error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const changePassword = async (req: RequestWithUser, res: express.Response) => {
    try {
        const auth = req.user
        const user = await prisma.users.findUnique({ where: {id: String(auth?.id)} });

        if(!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        
        const { password, confirm_password } = req.body;

        if(!password || !confirm_password) {
            return res.status(400).json({ message: 'Password fields are required' })
        }

        if(password !== confirm_password) {
            return res.status(400).json({ message: 'Passwords do not match' })
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        await prisma.users.update({
            where: { email: user.email },
            data: { password: hashedPassword },
        });

        let data = {
            status: "success",
            message: "Password changed successfully",
        };
        res.status(201).json(data);
    } catch(error) {
        return res.status(500).json({ message: 'server error'})
    }
}

export const deleteProfile = async (req: RequestWithUser, res: express.Response) => {

    const user = await prisma.users.findUnique({ where: {id: String(req.user?.id)} });
    
    await prisma.users.delete({ where: {id: String(req.user?.id)} });

    // const userId = user?.id;

    // delete post & user images ⚠️⚠️
    // const result = await User.findByIdAndDelete(userId);

    res.cookie('token', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Profile Deleted"
    });
};

export const uploadAvatar = async (req: RequestWithUser, res: express.Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const auth = req.user;

        const updatedUser = await prisma.users.update({
            where: { id: String(auth?.id) },
            data: { 
                avatar: req.file?.filename,
            },
        });

        let data = {
            user: updatedUser,
            status: "success",
            message: "Avatar Uploaded successfully",
        };
        res.status(201).json(data);

        // Here you can add additional validation for file type and size if needed
        // return res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    } catch (error) {
        return res.status(500).json({ message: 'server error'})
    }
   
}