import express from 'express';
import type { PaginationType } from '../types/index.ts';
import { countUsersByRole, destroyUser, fetchUser, fetchUsersByRoleWithPagination, storeUser, updateUser } from '../services/usersServices.ts';
import { generatePassword } from '../helpers/index.ts';

export const getAdminUsers = async (req: express.Request | PaginationType, res: express.Response) => {

    const { page, limit, skip } = req as PaginationType;
            
    const totalCount = await countUsersByRole('ADMIN');

    const users = await fetchUsersByRoleWithPagination(skip, limit, 'ADMIN');

    return res.status(200).json({
        message: "Admin users fetched successfully!!!",
        users,
        metadata: {
            page: page,
            limit: limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        }
    })    
}

export const getCustomerUsers = async (req: express.Request | PaginationType, res: express.Response) => {

    const { page, limit, skip } = req as PaginationType;
            
    const totalCount = await countUsersByRole('CUSTOMER');

    const users = await fetchUsersByRoleWithPagination(skip, limit, 'CUSTOMER');

    return res.status(200).json({
        message: "Customer users fetched successfully!!!",
        users,
        metadata: {
            page: page,
            limit: limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        }
    })    
}

export const getUser = async (req: express.Request, res: express.Response) => {

    const { id } = req.params;                

    const user = await fetchUser(String(id));

    return res.status(200).json({
        message: "User fetched successfully!!!",
        status: 'success',
        user,
    });
        
}

export const createUserByAdmin = async (req: express.Request, res: express.Response) => {

    const { first_name, email, last_name, role, phone,  } = req.body;                

    const user = await storeUser({
        email,
        first_name,
        last_name,
        role: role as 'ADMIN' | 'CUSTOMER',
        phone,
        password: generatePassword(8),
    });

    return res.status(200).json({
        message: "User created successfully!!!",
        status: 'success',
        user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
        },
    });
    
}

export const updateUserByAdmin = async (req: express.Request, res: express.Response) => {

    const { id } = req.params;                

    const { first_name, email, last_name, role, phone } = req.body;                

    const user = await updateUser(String(id), {
        email,
        first_name,
        last_name,
        role: role as 'ADMIN' | 'CUSTOMER',
        phone,
    });

    return res.status(200).json({
        message: "User updated successfully!!!",
        status: 'success',
        user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
        },
    });
        
}


export const deleteUserByAdmin = async (req: express.Request, res: express.Response) => {

    const { id } = req.params;                

    const user = await destroyUser(String(id));

    return res.status(200).json({
        message: "User deleted successfully!!!",
        status: 'success',
        user,
    }); 
}