import { NextFunction, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'

import { JWT_SECRET } from '../config/env'
import prisma from '../prisma/client'
import { AppError } from '../utils/AppError'
import { Role } from '@prisma/client'
import { JwtPayload, User } from '../types/user'

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            throw new AppError('You are not logged in. Please log in to access.', 401)
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
        const user = await prisma.user.findUnique({
            where: {
                user_id: decoded.user_id,
            },
            select: {
                user_id: true,
                name: true,
                email: true,
                role: true,
            },
        })

        // * Log for debugging
        console.log('protect')
        console.log(token)
        console.log(decoded)
        console.log(user)

        if (!user) {
            throw new AppError('The user belonging to this token no longer exists.', 403)
        }

        req.user = user
        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            if (error instanceof jwt.TokenExpiredError) {
                return next(new AppError('Your token has expired. Please log in again.', 401))
            } else if (error instanceof jwt.NotBeforeError) {
                return next(new AppError('Token not yet active. Please try again later.', 401))
            } else {
                return next(new AppError('Invalid token. Please log in again.', 401))
            }
        }
        next(error)
    }
}

export const restrictTo = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // * Log for debugging
        console.log('restrict to')
        console.log(req.user)

        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('Forbidden Access', 403))
        }
        next()
    }
}
