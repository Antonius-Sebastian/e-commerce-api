import { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/AppError'
import { ZodError } from 'zod'
import { NODE_ENV } from '../config/env'

export const errorMiddleware = (
    err: Error | AppError | ZodError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500
    let message = 'Something went wrong'
    let status = 'error'
    let stack: string | undefined = undefined
    let errors: any = undefined

    if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
        status = err.status
    } else if (err instanceof ZodError) {
        statusCode = 400
        message = 'Validation error'
        errors = err.errors.map((error) => ({
            message: error.message,
            field: error.path.join('.'),
        }))
    } else {
        message = err.message || message
    }

    if (NODE_ENV === 'development') {
        stack = err.stack
    }

    res.status(statusCode).json({
        status,
        message,
        ...(errors && { errors }),
        ...(stack && { stack }),
    })
}
