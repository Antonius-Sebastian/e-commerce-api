import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import prisma from '../prisma/client'
import { AppError } from '../utils/AppError'
import { UserInput } from '../schemas/auth.schema'
import { User } from '../interfaces/user'
import { createError } from '../utils/createError'
import { AUTH_ERRORS, RESOURCE_ERRORS, USER_ERRORS } from '../constants/error.constants'

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

export const getUser = async (
    req: Request<{ user_id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.params
    try {
        if (!req.user) {
            return next(createError(AUTH_ERRORS.MISSING_AUTH))
        }

        if (req.user.role !== 'ADMIN' && req.user.user_id !== user_id) {
            return next(createError(AUTH_ERRORS.INSUFFICIENT_PERMISSIONS))
        }

        const user = await prisma.user.findUnique({
            where: {
                user_id: user_id,
            },
            omit: {
                password: true,
            },
        })

        // * Log for debugging
        console.log('get user')
        console.log(user_id)
        console.log(user)

        if (!user) {
            return next(createError(USER_ERRORS.NOT_FOUND))
        }

        res.json({ message: 'success', data: { user } })
    } catch (error) {
        next(error)
    }
}

// TODO: search based on query, username, email, role
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
            return next(createError(USER_ERRORS.ALREADY_EXISTS))
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
            return next(createError(AUTH_ERRORS.MISSING_AUTH))
        }

        if (req.user.role !== 'ADMIN' && req.user.user_id !== user_id) {
            return next(createError(AUTH_ERRORS.INSUFFICIENT_PERMISSIONS))
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { user_id } })
        if (!existingUser) {
            return next(createError(USER_ERRORS.NOT_FOUND))
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
