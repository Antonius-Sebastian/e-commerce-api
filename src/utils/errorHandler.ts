import {
    PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library'
import { ZodError } from 'zod'

export const formatZodError = (err: ZodError) => {
    const formattedErrors = err.errors.map((error) => {
        const field = error.path.join('.')
        const { code, message, path } = error

        // Create more friendly messages based on error code
        let friendlyMessage = message
        switch (error.code) {
            case 'invalid_type':
                const { expected, received } = error
                friendlyMessage = `Expected ${expected}, received ${received}`
                break
            case 'invalid_string':
                if (error.validation === 'email') {
                    friendlyMessage = 'Invalid email format'
                } else if (error.validation === 'url') {
                    friendlyMessage = 'Invalid URL format'
                }
                break
            case 'too_small':
                const min = error.minimum
                const type = error.type === 'string' ? 'characters' : 'items'
                friendlyMessage = `Should be at least ${min} ${type}`
                break
            case 'too_big':
                const max = error.maximum
                const typeBig = error.type === 'string' ? 'characters' : 'items'
                friendlyMessage = `Should not exceed ${max} ${typeBig}`
                break
        }

        return {
            message: friendlyMessage,
            field,
            errorCode: code,
            path,
        }
    })
    // Group errors by field for clearer client-side validation handling
    const groupedErrors: {
        [key: string]: any
    } = {}
    formattedErrors.forEach((error) => {
        if (!groupedErrors[error.field]) {
            groupedErrors[error.field] = []
        }
        groupedErrors[error.field].push(error)
    })

    return {
        // formattedErrors,
        ...groupedErrors,
    }
}

export const handlePrismaKnownError = (err: PrismaClientKnownRequestError) => {
    let statusCode = 400
    let message = 'Database error'

    // Handle specific Prisma error codes
    switch (err.code) {
        case 'P2002': // Unique constraint violation
            message = `Unique constraint violation on field: ${err.meta?.target}`
            break
        case 'P2003': // Foreign key constraint violation
            message = `Foreign key constraint violation on field: ${err.meta?.field_name}`
            break
        case 'P2025': // Record not found
            message = 'Record not found'
            statusCode = 404
            break
        default:
            message = `Database error: ${err.code}`
    }

    return { statusCode, message }
}

export const getPrismaErrorMetadata = (err: PrismaClientKnownRequestError) => {
    return {
        code: err.code,
        meta: err.meta,
        clientVersion: err.clientVersion,
    }
}

export const parseError = (err: any) => {
    let statusCode = 500
    let message = 'Something went wrong'
    let status = 'error'
    let errors: any = undefined

    if (err.statusCode && err.status) {
        // AppError
        statusCode = err.statusCode
        message = err.message
        status = err.status
    } else if (err instanceof ZodError) {
        statusCode = 400
        message = 'Validation error'
        errors = formatZodError(err)
    } else if (err instanceof PrismaClientKnownRequestError) {
        const prismaError = handlePrismaKnownError(err)
        statusCode = prismaError.statusCode
        message = prismaError.message
    } else if (err instanceof PrismaClientUnknownRequestError) {
        statusCode = 500
        message = 'Unknown database error occurred'
    } else if (err instanceof PrismaClientValidationError) {
        statusCode = 400
        message = 'Database validation error'
    } else {
        message = err.message || message
    }

    return { statusCode, message, status, errors }
}
