import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import prisma from '../prisma/client'
import { JWT_SECRET } from '../config/env'
import { SignInInput, UserInput } from '../schemas/auth.schema'
import { JwtPayload } from '../interfaces/user'
import { AUTH_ERRORS, USER_ERRORS } from '../constants/error.constants'
import { createError } from '../utils/createError'

export const signIn = async (
    req: Request<{}, {}, SignInInput>,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body
    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })

        if (!user) {
            return next(createError(AUTH_ERRORS.INVALID_CREDENTIALS))
        }

        // Check if password valids
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return next(createError(AUTH_ERRORS.INVALID_CREDENTIALS))
        }

        const payload: JwtPayload = {
            user_id: user.user_id,
            role: user.role,
        }

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })

        // * Log for debugging
        console.log(user)
        console.log(payload)
        console.log(token)

        res.json({ status: 'success', data: { user, token } })
    } catch (error) {
        next(error)
    }
}

export const signUp = async (
    req: Request<{}, {}, UserInput>,
    res: Response,
    next: NextFunction
) => {
    const { name, email, password, address, phone_number } = req.body

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
            },
            omit: {
                password: true,
            },
        })

        // Create JWT
        const payload: JwtPayload = {
            user_id: user.user_id,
            role: user.role,
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })

        // * log for debugging
        console.log(payload)
        console.log(user)
        console.log(hashedPassword)
        console.log(token)

        res.status(201).json({ status: 'success', data: { user, token } })
    } catch (error) {
        // TODO: Handle prisma error
        next(error)
    }
}

// TODO: Sign-Out
export const signOut = async (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: 'sign-out' })
}
