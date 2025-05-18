import { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/AppError'
import { ZodError } from 'zod'
import { NODE_ENV } from '../config/env'
import {
    PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library'
import { formatZodError, getPrismaErrorMetadata, parseError } from '../utils/errorHandler'

export const errorMiddleware = (
    err:
        | Error
        | AppError
        | ZodError
        | PrismaClientUnknownRequestError
        | PrismaClientValidationError
        | PrismaClientKnownRequestError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { message, statusCode, status, errors } = parseError(err)

    // Handle development-specific information
    let stack: string | undefined = undefined
    let developmentInfo: any = undefined

    if (NODE_ENV === 'development') {
        stack = err.stack

        // Add additional metadata for Prisma errors in development mode
        if (err instanceof PrismaClientKnownRequestError) {
            developmentInfo = getPrismaErrorMetadata(err)
        }
    }

    res.status(statusCode).json({
        status,
        message,
        ...(errors && { errors }),
        ...(stack && { stack }),
        ...(developmentInfo && { developmentInfo }),
    })
}
