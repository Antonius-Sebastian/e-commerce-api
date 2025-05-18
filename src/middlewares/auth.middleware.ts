import { NextFunction, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { Role } from '@prisma/client'

import { JWT_SECRET } from '../config/env'
import prisma from '../prisma/client'
import { JwtPayload, User } from '../interfaces/user'
import { createError } from '../utils/createError'
import { AUTH_ERRORS, RESOURCE_ERRORS } from '../constants/error.constants'

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
            return next(createError(AUTH_ERRORS.MISSING_AUTH))
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

        if (!user) {
            return next(createError(AUTH_ERRORS.USER_NOT_FOUND))
        }

        req.user = user
        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            if (error instanceof jwt.TokenExpiredError) {
                return next(createError(AUTH_ERRORS.TOKEN_EXPIRED))
            } else if (error instanceof jwt.NotBeforeError) {
                return next(createError(AUTH_ERRORS.TOKEN_VERIFICATION_FAILED))
            } else {
                return next(createError(AUTH_ERRORS.TOKEN_INVALID))
            }
        }
        next(error)
    }
}

export const restrictTo = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(createError(RESOURCE_ERRORS.UNAUTHORIZED_ACCESS))
        }
        next()
    }
}
