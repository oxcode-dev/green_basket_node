import express from 'express';
import bcrypt from 'bcryptjs';
import type { RequestWithUser } from '../types/index.ts';
import { fetchUser, updateUser, updateUserPassword } from '../services/usersServices.ts';
import { User } from '../models/index.ts';

export const getUserDetails = async (req: RequestWithUser, res: express.Response) => {
    const auth = req.user

    const user = await fetchUser(String(auth?.id))

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
            phone: user?.phone,
            orders: user?.orders,
            reviews: user?.reviews,
            addresses: user?.addresses,
            wishlists: user?.wishlists,
        },
    }

    res.status(200).json(data);
}

export const updateUserDetails = async (req: RequestWithUser, res: express.Response) => {
    const auth = req.user;

    const { first_name, last_name, email, phone } = req.body;

    const updatedUser = await updateUser(String(auth?.id), {
        email,
        first_name,
        last_name,
        role: 'CUSTOMER',
        phone,
    })

    let data = {
        status: "success",
        message: "Profile updated successfully",
        user: {
            id: updatedUser?.id || '',
            fullName: updatedUser?.first_name + ' ' + updatedUser?.last_name,
            email: updatedUser?.email,
            first_name: updatedUser?.first_name,
            last_name: updatedUser?.last_name,
            avatar: updatedUser?.avatar,
            phone: updatedUser?.phone,
        },
    };
    res.status(201).json(data);
}

export const changePassword = async (req: RequestWithUser, res: express.Response) => {
    const auth = req.user
    
    const { password, confirm_password } = req.body;

    if(!password || !confirm_password) {
        return res.status(400).json({ message: 'Password fields are required' })
    }

    if(password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' })
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await updateUserPassword(String(auth?.id), {
        password: hashedPassword,
    });

    let data = {
        status: "success",
        message: "Password changed successfully",
    };

    res.status(201).json(data);
}

export const deleteProfile = async (req: RequestWithUser, res: express.Response) => {

    const user = await User.findUnique({ where: {id: String(req.user?.id)} });
    
    await User.delete({ where: {id: String(req.user?.id)} });

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
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const auth = req.user;

    // Construct the full URL to the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/avatars/${req.file.filename}`;

    const updatedUser = await User.update({
        where: { id: String(auth?.id) },
        data: { 
            avatar: imageUrl,
        },
    });

    let data = {
        status: "success",
        message: "Avatar Uploaded successfully",
        file: req.file,
        user: {
            id: updatedUser?.id || '',
            fullName: updatedUser?.first_name + ' ' + updatedUser?.last_name,
            email: updatedUser?.email,
            first_name: updatedUser?.first_name,
            last_name: updatedUser?.last_name,
            avatar: updatedUser?.avatar,
            phone: updatedUser?.phone,
        },
    };

    res.status(201).json(data);
}