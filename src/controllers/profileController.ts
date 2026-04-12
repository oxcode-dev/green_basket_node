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
            where: { id: auth?.id },
            omit: ['password'],
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
                // avatar: user?.avatar,
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
        const auth = req.user
        const user = await prisma.users.findFirst({
            where: { id: auth?.id },
            omit: ['password'],
        })

        if(!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const { first_name, last_name, email, phone } = req.body;

        if(
            !first_name || !last_name || !email
        ) {
            return res.status(400).json({
                message: "Required fields are missing!",
            })
        }

        if(first_name) user.first_name = first_name;
        if(last_name) user.last_name = last_name;
        if(email) user.email = email;
        // if(username) user.username = username;
        // if(bio) user.bio = bio;

        const updatedUser = await prisma.users.update({
            where: { email: user.email },
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
        const user = await prisma.users.findUnique({ where: {id: auth?.id} });

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

    const user = await prisma.users.findUnique({ where: {id: req.user?.id} });
    
    await prisma.users.delete({ where: {id: req.user?.id} });

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