import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import prisma from '../prisma/client'
import { AppError } from '../utils/AppError'
import { UserInput } from '../schemas/authSchema'
import { User } from '../types/user'
import { Prisma } from '@prisma/client'

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            omit: {
                password: true,
            },
        })
        res.json({ status: 'success', data: { users } })
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                user_id: req.params.user_id,
            },
            omit: {
                password: true,
            },
        })

        if (!user) {
            throw new AppError('User not found', 404)
        }

        res.json({ message: 'success', data: { user } })
    } catch (error) {
        next(error)
    }
}

export const addUser = async (
    req: Request<{}, {}, UserInput>,
    res: Response,
    next: NextFunction
) => {
    const { name, email, password, address, phone_number, role } = req.body
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            throw new AppError('User already exists', 401)
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                address,
                phone_number,
                role,
            },
            omit: {
                password: true,
            },
        })

        // * Log for debugging
        console.log('add user')
        console.log(user)
        console.log(hashedPassword)

        res.json({ status: 'success', data: { user } })
    } catch (error) {
        // TODO: Handle prisma error
        next(error)
    }
}

export const updateUser = async (
    req: Request<{ user_id: string }, {}, UserInput>,
    res: Response,
    next: NextFunction
) => {
    const { name, email, password, address, phone_number, role } = req.body
    const { user_id } = req.params
    try {
        // Only admin can update anyone, user can update self
        if (!req.user) {
            throw new AppError('Unauthorized', 401)
        }

        if (req.user.role !== 'ADMIN' && req.user.user_id !== user_id) {
            throw new AppError('You are not allowed to update this user', 403)
        }

        // Check if user  exists
        const existingUser = await prisma.user.findUnique({ where: { user_id } })
        if (!existingUser) {
            throw new AppError('User not found', 404)
        }

        let hashedPassword = existingUser.password
        if (password && password.trim() !== '') {
            // * New password
            console.log('New password')
            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(password, salt)
        }

        // Update User
        const user = await prisma.user.update({
            data: {
                name,
                email,
                password: hashedPassword,
                address,
                phone_number,
                role,
            },
            where: {
                user_id,
            },
            omit: {
                password: true,
            },
        })

        // * Log for debugging
        console.log('update user')
        console.log(user_id)
        console.log(existingUser)
        console.log(user)

        res.json({ status: 'success', data: { user } })
    } catch (error) {
        // TODO: Handle prisma error
        next(error)
    }
}

export const deleteUser = async (
    req: Request<{ user_id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.params
    try {
        const user = await prisma.user.delete({
            where: { user_id },
            omit: {
                password: true,
            },
        })
        res.json({ status: 'success', data: { user } })
    } catch (error) {
        next(error)
    }
}

// TODO: Search user controller
export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { keyword } = req.query

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: String(keyword), mode: 'insensitive' } },
                    { email: { contains: String(keyword), mode: 'insensitive' } },
                ],
            },
        })
        // * Log for debugging
        console.log('search user')
        console.log(keyword)
        console.log(users)

        res.json({ status: 'success', data: { users } })
    } catch (error) {
        next(error)
    }
}
