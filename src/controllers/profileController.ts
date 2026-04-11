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
        const user = await User.findById(auth?.id)

        if(!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const { first_name, last_name, email, bio, username } = req.body;

        if(
            !first_name || !last_name || !email || !username
        ) {
            return res.status(400).json({
                message: "Required fields are missing!",
            })
        }

        if(first_name) user.first_name = first_name;
        if(last_name) user.last_name = last_name;
        if(email) user.email = email;
        if(username) user.username = username;
        if(bio) user.bio = bio;

        await user.save();

        let data = {
            user,
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
        const user = await User.findById(auth?.id)

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

        user.password = await bcrypt.hash(password, 12);
        await user.save();

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

    const user = await User.findById(req.user?.id);
    const posts = user?.posts || [];
    const followers = user?.followers || [];
    const following = user?.followings || [];
    const userId = user?.id;

    // delete post & user images ⚠️⚠️
    const result = await User.findByIdAndDelete(userId);

    res.cookie('token', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    // for (let i = 0; i < posts.length; i++) {
    //     const post = await Post.findById(posts[i]);
    //     await post.deleteOne();
    // }

    // for (let i = 0; i < followers.length; i++) {
    //     const follower = await User.findById(followers[i]);

    //     const index = follower?.following.indexOf(userId);
    //     follower?.following.splice(index, 1);
    //     await follower.save();
    // }

    // for (let i = 0; i < following.length; i++) {
    //     const follows = await User.findById(following[i]);

    //     const index = follows?.followers.indexOf(userId);
    //     follows.followers.splice(index, 1);
    //     await follows.save();
    // }

    res.status(200).json({
        success: true,
        message: "Profile Deleted"
    });
};